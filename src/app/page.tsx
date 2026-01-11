'use client';

import React, { useState } from 'react';
import { Search, Bell, User, Upload, FileText, Sparkles, LayoutGrid, File } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { SearchResult } from '../types/file';
import { SearchResultList } from '../components/search/SearchResultList';
import { FilePreview } from '../components/preview/FilePreview';
import { useFileSearch } from '../hooks/useFileSearch';
import { SearchForm } from '../components/search/SearchForm';


export default function Home() {
  // ロジックをフックから呼び出し
  const {
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
  } = useFileSearch();

  // --- ページ1：検索前の画面 ---
  if (!isSearched) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Header onLogoClick={() => setIsSearched(false)} />
        <main className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center gap-16">
          <section className="w-full max-w-3xl">
            <div className="border-2 border-dashed border-blue-500 bg-blue-50/20 rounded-xl p-10 flex flex-col items-center justify-center gap-6 text-center h-56">
              <p className="font-bold text-slate-700">ファイル保存</p>
              <button className="bg-slate-500 hover:bg-slate-600 text-white px-10 py-3 rounded-md shadow-md font-medium transition-colors w-64">
                ファイルを保存する
              </button>
            </div>
          </section>
          <section className="w-full max-w-4xl flex flex-col items-center gap-3">
            <p className="text-slate-500 text-sm">ファイルを探す（検索ボックスに質問を入力してください）</p>
            
            <SearchForm 
            value={searchQuery} 
            onChange={setSearchQuery} 
            onSubmit={handleSearch} 
            variant="large" 
            />

          </section>
        </main>
      </div>
    );
  }

  // --- ページ2：検索結果の画面 ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Header onLogoClick={() => setIsSearched(false)} />
      
      <div className="flex flex-1 overflow-hidden">
        

        {/* 中央カラム：検索と結果 */}
        <main className="flex-1 overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            
            {/* 上部：保存と検索 */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-2">ファイルを保存する</h3>
                <button className="w-full bg-slate-500 hover:bg-slate-600 text-white py-3 rounded-md shadow-sm font-medium transition-colors">
                  保存するファイルを選択する
                </button>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 mb-2">ファイルを探す</h3>
                
                <SearchForm 
                value={searchQuery} 
                onChange={setSearchQuery} 
                onSubmit={handleSearch} 
                variant="small" 
                />

              </div>
            </div>

            {/* AIの回答を表示するエリア */}
            {aiAnswer && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
                <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-3">
                  <Sparkles className="w-5 h-5" /> AIの回答
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
              </div>
            )}


            {/* 下部：検索結果リスト */}
            <div>
              <h2 className="text-lg font-bold mb-4">
                {isLoading ? '検索中...' : `検索結果 : ${searchResults.length} 件`}
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!error && searchResults.length === 0 && (
                    <p className="text-slate-500 py-4">該当するファイルが見つかりませんでした。</p>
                  )}

                  <SearchResultList 
                  results={searchResults} // フックから返ってきた結果
                  selectedFileId={selectedFile?.id ?? null} // 選択中のID
                  onFileSelect={setSelectedFile} // 選択関数
/>
                  
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 右カラム：ファイルプレビュー */}
        <FilePreview selectedFile={selectedFile} />

      </div>
    </div>
  );
}