// src/app/page.tsx

'use client';

// ★追加: useEffect, useCallback をインポートに追加
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { SearchResultList } from '../components/search/SearchResultList';
import { FilePreview } from '../components/preview/FilePreview';
import { useFileSearch } from '../hooks/useFileSearch';
import { SearchForm } from '../components/search/SearchForm';

export default function Home() {
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

  // -----------------------------------------------------------------
  // ▼▼ リサイズ機能（ここから追加） ▼▼
  // -----------------------------------------------------------------
  const [sidebarWidth, setSidebarWidth] = useState(350); // 初期の幅
  const [isResizing, setIsResizing] = useState(false);

  // ドラッグ開始
  const startResizing = useCallback(() => setIsResizing(true), []);
  
  // ドラッグ終了
  const stopResizing = useCallback(() => setIsResizing(false), []);

  // ドラッグ中の処理
  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        // 右端からの距離を計算して新しい幅にする
        const newWidth = window.innerWidth - mouseMoveEvent.clientX;
        // 最小幅200px, 最大幅800pxの制限を設ける
        if (newWidth > 200 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  // マウスイベントの登録と解除
  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);
  // -----------------------------------------------------------------


  // -----------------------------------------------------------------
  // ▼▼ ドラッグ＆ドロップ機能（以前のまま維持） ▼▼
  // -----------------------------------------------------------------
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToAzure = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) alert('Azureへのアップロードが完了しました！');
    } catch (err) {
      alert('アップロードに失敗しました');
    }
  };

  const handleSaveClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadToAzure(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) uploadToAzure(e.dataTransfer.files[0]);
  };
  // -----------------------------------------------------------------

  // --- ページ1：検索前の画面 ---
  if (!isSearched) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Header onLogoClick={() => setIsSearched(false)} />
        <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-16">
          <section className="w-full max-w-3xl">
            <div onClick={handleSaveClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-6 text-center h-56 transition-all ${isDragging 
              ? "border-blue-700 bg-blue-100" // ドラッグ中の強調スタイル
              : "border-blue-500 bg-blue-50/20 hover:bg-blue-50/40" // 通常時のスタイル
              }`}>
                
              {/* ここが重要：画面には見えないが、ファイル選択ダイアログを開くためのinput */}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <p className="font-bold text-slate-700">
                  {isDragging ? "ここにドロップしてアップロード" : "ファイル保存"}
                </p>
                <p className="text-slate-500">※保存したファイルは、管理者がindex化するまで反映されません。</p>

                <button className="bg-slate-500 hover:bg-slate-600 text-white px-10 py-3 rounded-md shadow-md font-medium transition-colors w-64 pointer-events-none">ファイルを保存する</button>
            </div>
          </section>

          <section className="w-full max-w-4xl flex flex-col items-center gap-3">
            <p className="text-slate-500 text-base font-medium">ファイルを探す</p>
            <p className="text-slate-500">※'mo','fu', 数字 いずれかの入ったGoogleアカウントの人のみアクセスできます。</p>
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
    <div className="h-screen bg-white font-sans text-slate-800 flex flex-col">
      <Header onLogoClick={() => setIsSearched(false)} />
      
      <div className="flex flex-1 overflow-hidden">
        
        {/* 左側：リストエリア */}
        <main className="flex-1 overflow-y-auto bg-white border-r border-gray-200">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            
            {/* 上部：保存と検索 */}
            <div className="space-y-6">

              {/* ファイル保存 */}
              <section className="w-full max-w-3xl">
                <div
                  onClick={handleSaveClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`cursor-pointer border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-6 text-center h-56 transition-all ${
                    isDragging
                      ? "border-blue-700 bg-blue-100"
                      : "border-blue-500 bg-blue-50/20 hover:bg-blue-50/40"
                  }`}
                >
                  {/* 画面には見えないが、ファイル選択ダイアログを開くための input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <p className="font-bold text-slate-700">
                    {isDragging ? "ここにドロップしてアップロード" : "ファイル保存"}
                  </p>
                  <p className="text-slate-500">※保存したファイルは、管理者がindex化するまで反映されません。</p>
                  

                  <button
                    className="bg-slate-500 hover:bg-slate-600 text-white px-10 py-3 rounded-md shadow-md font-medium transition-colors w-64 pointer-events-none"
                    type="button"
                  >
                    アップロード
                  </button>
                </div>
              </section>

              {/* ファイル検索 */}
              <div>
                <section className="w-full max-w-4xl flex flex-col items-center gap-3">
                  <p className="text-slate-500 text-sm">ファイルを探す（検索ボックスに質問を入力してください）</p>
                  <SearchForm value={searchQuery} onChange={setSearchQuery} onSubmit={handleSearch} variant="large" />
                </section>
              </div>
            </div>

            {aiAnswer && (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
                <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-3">
                  <Sparkles className="w-5 h-5" /> AIの回答
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold mb-4">
                {isLoading ? '検索中...' : `検索結果 : ${searchResults.length} 件`}
              </h2>
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm">{error}</div>}

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
                    results={searchResults}
                    selectedFileId={selectedFile?.id ?? null}
                    onFileSelect={setSelectedFile}
                    onFileOpen={(file) => {
                      if (!file.uri) return;
                      window.open(file.uri, "_blank", "noopener,noreferrer");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ★追加: リサイズ用のハンドル（境界線） */}
        {/* PC画面のみ表示 (hidden lg:block) */}
        <div
          className="hidden lg:block w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors hover:w-1.5 active:bg-blue-600 z-50"
          onMouseDown={startResizing}
        />

        {/* 右カラム：ファイルプレビュー */}
        {/* width を state から渡す */}
        <FilePreview 
          selectedFile={selectedFile} 
          width={sidebarWidth} 
        />

      </div>
    </div>
  );
}