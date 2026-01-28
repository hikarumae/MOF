// src/components/preview/FilePreview.tsx

'use client';

import React from 'react';
import { File, FileText } from 'lucide-react';
import { SearchResult } from '../../types/file';

interface FilePreviewProps {
  selectedFile: SearchResult | null;
  width: number; // ★追加: 外から幅を受け取る
}

// ★修正: width プロップを受け取るように変更
export const FilePreview = ({ selectedFile, width }: FilePreviewProps) => {

  const handleOpenFile = () => {
    if (selectedFile?.uri) {
      window.open(selectedFile.uri, '_blank', 'noopener,noreferrer');
    }
  };

  // ファイル形式を判定するヘルパー
  const getFileType = (file: SearchResult) => {
    const uri = file.uri?.toLowerCase() || '';
    const format = file.format?.toUpperCase() || '';
    
    if (format === 'PDF' || uri.includes('.pdf')) return 'pdf';
    if (['JPG', 'JPEG', 'PNG', 'GIF'].includes(format) || uri.match(/\.(jpg|jpeg|png|gif)/)) return 'image';
    return 'other';
  };

  return (
   // ★修正:
    // 1. "w-72" を削除 (固定幅をやめる)
    // 2. style={{ width }} を追加 (動的な幅を適用)
    // 3. "shrink-0" を追加 (縮まないようにする)
    <aside 
      className="hidden lg:block bg-white p-6 border-l border-gray-200 h-full overflow-y-auto shrink-0"
      style={{ width: `${width}px` }}
    >
   <h2 className="font-bold text-lg mb-3">プレビュー</h2>
      
      {selectedFile ? (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
            <p className="text-xs text-slate-500 font-bold">ファイル名：</p>
            <p className="font-bold text-blue-900 text-sm break-words">{selectedFile.name}</p>
          </div>

          <div className="space-y6">
            <p className="text-xs text-slate-500 font-bold">件名：
              <span className="text-sm">{selectedFile.documentTitle || "-"}
              </span>  
              </p>
          </div>

          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-bold">文書カテゴリ：
            <span className="text-sm">{selectedFile.documentCategory}</span>
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-bold">文書日付：
            <span className="text-sm">{selectedFile.documentDate}</span>
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-bold">ファイル形式：
            <span className="text-sm uppercase">{selectedFile.format}</span>
            </p>
          </div>

          {/* プレビュー表示エリア */}
         {/* ▼▼▼ 修正箇所：styleでアスペクト比を指定し、PDF設定を追加 ▼▼▼ */}
          <div 
            className="w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-300 relative"
            style={{ aspectRatio: '3/4' }} // ★重要: これで幅に合わせて高さも変わります
          >
            {getFileType(selectedFile) === 'pdf' ? (
              <iframe 
                // ★重要: view=FitH を追加して「幅に合わせてズーム」するように設定
                src={`${selectedFile.uri}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-full object-cover"
                title="PDF Preview"
              />
            ) : getFileType(selectedFile) === 'image' ? (
              <img 
                src={selectedFile.uri} 
                alt="Preview" 
                className="w-full h-full object-contain bg-white"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 gap-2">
                <File className="w-10 h-10 text-gray-300" />
                <span className="text-xs">プレビュー不可</span>
              </div>
            )}
          </div>
          {/* ▲▲▲ 修正ここまで ▲▲▲ */}

          <button 
            onClick={handleOpenFile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
          >
            ファイルを開く
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
          <FileText className="w-10 h-10" />
          <p className="text-sm">リストからファイルを選択</p>
        </div>
      )}
    </aside>
  );
};