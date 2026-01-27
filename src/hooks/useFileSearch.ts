// src.hooks.useFileSearch.ts

'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { SearchResult } from '../types/file';
import { BACKEND_API_URL, DEFAULT_FILE_FORMAT, DEFAULT_DOCUMENT_CATEGORY, DEFAULT_DOCUMENT_DATE } from '../constants/config';

const TIMEOUT_MS = 30_000;

export const useFileSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearched(true);
    setIsLoading(true);
    setError(null);
    setSelectedFile(null);
    setAiAnswer(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const url = `${BACKEND_API_URL}/ask?q=${encodeURIComponent(searchQuery)}`;
      console.log("BACKEND_API_URL =", BACKEND_API_URL);
      console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);
      console.log("fetch url =", url);
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Fetch エラー: ${res.status}`);

      const data = await res.json();
      const sources = Array.isArray(data.sources) ? data.sources : [];

      const formattedResults: SearchResult[] = sources.map((s: any, index: number) => {//index: numberを追加
        const fileName = s.file_name ?? "資料名";
        const chunkId = Number.isFinite(s.chunk_id) ? s.chunk_id : 0;
        const category = s.category ?? "unknown";

        return {
          id: `${fileName}#${chunkId}_${index}`,//_${index}を追加
          name: fileName,
          summary: s.text ?? "",
          category,
          uri: s.uri ?? "",
          page: (typeof s.page === "number" ? s.page : null),
          chunkId,
          tags: [category],
          documentCategory: DEFAULT_DOCUMENT_CATEGORY, 
          documentDate: DEFAULT_DOCUMENT_DATE,
          format: DEFAULT_FILE_FORMAT,
        };
      });

      setSearchResults(formattedResults);

      setSelectedFile(formattedResults.length > 0 ? formattedResults[0] : null);

      const answer =
        typeof data.answer === "string" && data.answer.trim() ? data.answer : null;
      setAiAnswer(answer);


// ---------------------------------------------------------
      // ★追加(たも)：ここから Azure Table Storage への問い合わせ処理
      // ---------------------------------------------------------
      
      // 検索結果からファイル名のリストを作成（URIから抽出）
      const fileNames = formattedResults.map(r => {
        try {
          // ★まず「?」で区切って、クエリパラメータ（sig=...）を捨てる
          const uriWithoutQuery = r.uri.split('?')[0];

          // ★その後、「/」で区切って最後のファイル名部分を取る
          const parts = uriWithoutQuery.split('/');
          const extractedName = parts[parts.length - 1];

          // ★日本語デコードして返す（空なら元のnameを使う）
          return decodeURIComponent(extractedName || r.name);
        } catch (e) {
          // エラー時は元の名前を返す
          return r.name;
        }
      });

      // デバッグ用にブラウザのコンソールにも出す（確認用）
      console.log("【Frontend Debug】抽出したファイル名リスト:", fileNames);

      // 重複を除去
      const uniqueFileNames = Array.from(new Set(fileNames));

      if (uniqueFileNames.length > 0) {
        // 前の手順で作った API を呼び出す
        // ※ app/api/file-metadata/route.ts が作成されている必要があります
        const metaRes = await fetch('/api/file-metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileNames: uniqueFileNames }),
        });

        if (metaRes.ok) {
          const metaMap = await metaRes.json(); // { "filename": { category: "...", date: "..." }, ... }

          // ★重要：ここでも「?」以降を削除してから照合する！
          setSearchResults(prevResults => {
            return prevResults.map(item => {
              // URLからきれいなファイル名を抽出
              const uriWithoutQuery = item.uri.split('?')[0];
              const fName = decodeURIComponent(uriWithoutQuery.split('/').pop() || item.name);
              
              // マップと照合
              const info = metaMap[fName];
              
              if (info) {
                return {
                  ...item,
                  documentCategory: info.category,
                  documentDate: info.date
                };
              }
              return item;
            });
          });

          // 取得したメタデータを使って searchResults を更新
          setSearchResults(prevResults => {
            const newResults = prevResults.map(item => {
              const fName = decodeURIComponent(item.uri.split('/').pop() || item.name);
              const info = metaMap[fName];
              
              if (info) {
                return {
                  ...item,
                  documentCategory: info.category, // テーブルから取得した値
                  documentDate: info.date          // テーブルから取得した値
                };
              }
              return item;
            });
            return newResults;
          });

          // ★重要：選択中のファイル（プレビュー）も同様に更新
          setSelectedFile(prevSelected => {
            if (!prevSelected) return null;
            const uriWithoutQuery = prevSelected.uri.split('?')[0];
            const fName = decodeURIComponent(uriWithoutQuery.split('/').pop() || prevSelected.name);
            const info = metaMap[fName];
            
            if (info) {
              return {
                ...prevSelected,
                documentCategory: info.category,
                documentDate: info.date
              };
            }
            return prevSelected;
          });
        }
      }
      // ---------------------------------------------------------
      // ★追加終了（たも）
      // ---------------------------------------------------------

    } catch (err: any) {
      console.error("検索エラー:", err);

      // 追加：画面にも詳細を出す（切り分け用）
      const msg =
        err?.name === "AbortError" ? "タイムアウトしました" :
        err?.message ? `エラー: ${err.message}` :
        `不明なエラー: ${String(err)}`;
      setError(msg);
      setSearchResults([]);
      setSelectedFile(null);

    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearched,
    setIsSearched,
    searchResults,
    selectedFile,
    setSelectedFile,
    isLoading,
    error,
    aiAnswer,
    handleSearch,
  };
};
