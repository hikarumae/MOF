'use client';

import React from 'react';
import { File, FileText } from 'lucide-react';
import { SearchResult } from '../../types/file';

interface FilePreviewProps {
  selectedFile: SearchResult | null;
}

// ファイルプレビューコンポーネント
export const FilePreview = ({ selectedFile }: FilePreviewProps) => {
  return (
    <aside className="hidden lg:block w-72 bg-white p-6 border-l border-gray-200">
      <h2 className="font-bold text-lg mb-6">プレビュー</h2>
      
      {selectedFile ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
            <p className="font-bold text-blue-900 text-sm break-words">{selectedFile.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">文書カテゴリ</p>
            <p className="text-sm">{selectedFile.documentCategory}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">文書日付</p>
            <p className="text-sm">{selectedFile.documentDate}</p>
          </div>

          {/* ▼▼ ファイル形式（拡張子などを表示） ▼▼ */}
          <div className="space-y-1">
            <p className="text-xs text-slate-500 font-bold">ファイル形式</p>
            <p className="text-sm uppercase">{selectedFile.format}</p>
          </div>

          <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 gap-2">
            <File className="w-10 h-10 text-gray-300" />
            <span className="text-xs">プレビュー画像</span>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-bold transition-colors">
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