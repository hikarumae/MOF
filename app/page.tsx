'use client';

import React, { useState } from 'react';
import { Search, Bell, User, Upload, FileText, Sparkles, LayoutGrid, File } from 'lucide-react';

// 型定義
type SearchResult = {
  id: number;
  name: string;
  summary: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  format: string;
};

export default function Home() {
  // 画面の状態を管理する変数
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  
  // 検索結果のリスト
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // ▼選択中のファイルを管理する状態（初期値はnull）
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AIの回答を表示するための状態
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearched(true);
    setIsLoading(true);
    setError(null);
    setSelectedFile(null);
    setAiAnswer(null); // 前の回答を消す

    try {
      const url = `http://localhost:8000/ask?q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`エラー: ${res.status}`);
      }

      const data = await res.json();
      
      // ▼ ここを修正：バックエンドの返却値に合わせてセット
      // data.answer がAIの回答、data.contexts が関連ファイルリストです
      setAiAnswer(data.answer);
      
      // contextsの中身をsearchResultsとして扱う
      // 各コンテキストに id がない場合は、mapの中で付与します
      const formattedResults = data.contexts.map((ctx: any, index: number) => ({
        id: index,
        name: ctx.file_name || "関連資料", // バックエンドのキー名に合わせて調整
        summary: ctx.text,
        tags: [ctx.metadata?.category || "AI分析"],
        author: "システム",
        lastUpdated: "2026/01/04",
        format: "PDF"
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

  // --- 共通パーツ：ヘッダー ---
  const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsSearched(false)}>
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">司書AIアプリ MOF</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );

  // --- ページ1：検索前の画面 ---
  if (!isSearched) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Header />
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
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full group">
                <div className="flex items-center bg-gray-100 rounded-full px-6 h-[64px] border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-lg transition-all">
                  <Search className="w-6 h-6 text-slate-400 mr-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="質問するか、ファイルを探す... （例：A社の最新契約書は？）" 
                    className="flex-1 text-lg outline-none bg-transparent placeholder:text-slate-400"
                  />
                  <Sparkles className="w-6 h-6 text-blue-500 ml-4" />
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // --- ページ2：検索結果の画面 ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* 左サイドバー：フィルター */}
        <aside className="w-64 border-r border-gray-200 p-6 overflow-y-auto bg-white hidden md:block">
          <h2 className="font-bold text-lg mb-6">フィルター</h2>
          <div className="mb-8">
            <h3 className="flex items-center gap-2 font-bold text-sm text-slate-700 mb-3">
              <Sparkles className="w-4 h-4 text-blue-500" /> AI生成タグ
            </h3>
            <div className="space-y-3">
              {['契約書', '請求書', 'A社案件', '2025年度'].map((tag) => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-bold text-sm text-slate-700 mb-3">
              <FileText className="w-4 h-4 text-blue-500" /> ファイル種類
            </h3>
            <div className="space-y-3">
              {['PDF', 'Excel', 'Word', 'PowerPoint'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

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
                <form onSubmit={handleSearch}>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 h-12 border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-md transition-all">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-slate-800"
                    />
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                </form>
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

                  {searchResults.map((file) => (
                    // ▼【追加 3】onClickで選択状態を更新。選択中のものは青い枠線をつける
                    <div 
                      key={file.id} 
                      onClick={() => setSelectedFile(file)}
                      className={`
                        p-5 rounded-lg border transition-all cursor-pointer group
                        ${selectedFile?.id === file.id 
                          ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' // 選択中のスタイル
                          : 'bg-gray-100/50 border-gray-200 hover:border-blue-300 hover:shadow-md' // 未選択のスタイル
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <h3 className={`font-bold text-lg group-hover:text-blue-700 ${selectedFile?.id === file.id ? 'text-blue-800' : 'text-slate-800'}`}>
                            {file.name}
                          </h3>
                          <div className="bg-white/50 p-3 rounded text-sm text-slate-600 border border-gray-200">
                            {file.summary}
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                            {file.tags && file.tags.map((tag) => (
                              <span key={tag} className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                タグ（{tag}）
                              </span>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded text-xs text-slate-600 mt-2">
                            <div className="border-r border-gray-300 px-2">作成者: {file.author}</div>
                            <div className="border-r border-gray-300 px-2">最終更新: {file.lastUpdated}</div>
                            <div className="px-2">形式: {file.format}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 右サイドバー：プレビュー */}
        {/* 選択されたファイル(selectedFile)の内容を表示する */}
        <aside className="w-72 bg-white p-6 hidden lg:block border-l border-gray-200">
          <h2 className="font-bold text-lg mb-6">プレビュー</h2>
          
          {selectedFile ? (
            <div className="space-y-6 fade-in">
               {/* ファイル名 */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                <p className="font-bold text-blue-900 text-sm break-words">{selectedFile.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-bold">作成者</p>
                <p className="text-sm">{selectedFile.author}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-bold">最終更新</p>
                <p className="text-sm">{selectedFile.lastUpdated}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-bold">ファイル形式</p>
                <p className="text-sm">{selectedFile.format}</p>
              </div>

              {/* プレビューエリア（ダミー画像のままですが、用途に合わせて変更可能） */}
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 gap-2">
                 <File className="w-10 h-10 text-gray-300" />
                 <span className="text-xs">プレビュー画像</span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-bold transition-colors">
                ファイルを開く
              </button>
            </div>
          ) : (
            // ファイルが選択されていない時
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
              <FileText className="w-10 h-10" />
              <p className="text-sm">リストからファイルを選択</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}