'use client';

import { useState } from 'react';
import { SearchResult } from '../types/file';
import { API_BASE_URL, SYSTEM_AUTHOR_NAME, DEFAULT_FILE_FORMAT, LAST_UPDATED_PLACEHOLDER } from '../constants/config';

export const useFileSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearched(true);
    setIsLoading(true);
    setError(null);
    setSelectedFile(null);
    setAiAnswer(null);

    try {
const url = `${API_BASE_URL}/ask?q=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`エラー: ${res.status}`);

      const data = await res.json();
      
      const formattedResults = data.contexts.map((ctx: any, index: number) => ({
        id: index,
        name: ctx.file_name || "関連資料",
        summary: ctx.text,
        tags: [ctx.metadata?.category || "AI分析"],
        author: SYSTEM_AUTHOR_NAME,   // ★定数を使用
        lastUpdated: LAST_UPDATED_PLACEHOLDER, // 適宜更新日時を設定
        format: DEFAULT_FILE_FORMAT   // ★定数を使用
      }));

      setSearchResults(formattedResults);
      if (formattedResults.length > 0) {
        setSelectedFile(formattedResults[0]);
      }
    } catch (error) {
      console.error("検索エラー:", error);
      setError("検索中にエラーが発生しました。");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // page.tsx で使いたい変数や関数をすべて返す
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