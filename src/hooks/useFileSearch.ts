// src.hooks.useFileSearch.ts

'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { SearchResult } from '../types/file';
import { BACKEND_API_URL, SYSTEM_AUTHOR_NAME, DEFAULT_FILE_FORMAT, LAST_UPDATED_PLACEHOLDER } from '../constants/config';

const TIMEOUT_MS = 10_000;

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
      console.log("fetch url =", url);
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Fetch エラー: ${res.status}`);

      const data = await res.json();
      const sources = Array.isArray(data.sources) ? data.sources : [];

      const formattedResults: SearchResult[] = sources.map((s: any) => {
        const fileName = s.file_name ?? "資料名";
        const chunkId = Number.isFinite(s.chunk_id) ? s.chunk_id : 0;
        const category = s.category ?? "unknown";

        return {
          id: `${fileName}#${chunkId}`,
          name: fileName,
          summary: s.text ?? "",
          category,
          uri: s.uri ?? "",
          page: (typeof s.page === "number" ? s.page : null),
          chunkId,
          tags: [category],
          author: SYSTEM_AUTHOR_NAME,
          lastUpdated: LAST_UPDATED_PLACEHOLDER,
          format: DEFAULT_FILE_FORMAT,
        };
      });

      setSearchResults(formattedResults);
      setSelectedFile(formattedResults.length > 0 ? formattedResults[0] : null);

      const answer =
        typeof data.answer === "string" && data.answer.trim() ? data.answer : null;
      setAiAnswer(answer);

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
