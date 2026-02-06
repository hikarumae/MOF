'use client';

import React from 'react';
import { SearchResult } from '../../types/file';

interface ResultCardProps {
  file: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onOpen?: () => void;
}

export const ResultCard = ({ file, isSelected, onClick, onOpen }: ResultCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-5 rounded-lg border transition-all cursor-pointer group
        ${isSelected 
          ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' 
          : 'bg-gray-100/50 border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          {/* 前回のファイル名を表示させるだけのコード
          <h3 className={`font-bold text-lg group-hover:text-blue-700 ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
            {file.name}
          </h3> */}
          <h3
            className={`font-bold text-lg group-hover:text-blue-700 ${
              isSelected ? 'text-blue-800' : 'text-slate-800'
            } ${onOpen ? 'hover:underline' : ''}`} // 開ける時だけそれっぽく
            onClick={(e) => {
              // カード全体のonClick(選択)を止める
              e.stopPropagation();

              // onOpenが渡されていれば開く
              onOpen?.();
            }}
            role={onOpen ? 'button' : undefined}
            tabIndex={onOpen ? 0 : undefined}
            onKeyDown={(e) => {
              // キーボード操作対応（任意だけど軽く入れとくと親切）
              if (!onOpen) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpen();
              }
            }}
          >
            {'file_name' in file ? (file as any).file_name : (file as any).name}
          </h3>
          <div className="bg-white/50 p-3 rounded text-sm text-slate-600 border border-gray-200">
            {file.summary}
          </div>
          
          {/* ★タグは非表示
          <div className="flex gap-2 flex-wrap">
            {file.tags && file.tags.map((tag) => (
              <span key={tag} className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                タグ（{tag}）
              </span>
            ))}
          </div>　*/}

        {/* ▼▼▼ ここを修正しました（3列→4列に変更し、件名を追加） ▼▼▼ */}
          <div className="grid grid-cols-4 gap-2 bg-gray-200 p-2 rounded text-xs text-slate-600 mt-2">

            {/* 既存: カテゴリ */}
            <div className="border-r border-gray-300 px-2 text-center">
              <span className="font-bold text-slate-500 mr-1">カテゴリ:</span>
              {file.documentCategory}
            </div>

            {/* ★追加: 件名（取引先名など） */}
            <div className="border-r border-gray-300 px-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="font-bold text-slate-500 mr-1">件名:</span>
              <span title={file.documentTitle}>{file.documentTitle}</span>
            </div>
            
            {/* 既存: 日付 */}
            <div className="border-r border-gray-300 px-2 text-center">
              <span className="font-bold text-slate-500 mr-1">日付:</span>
              {file.documentDate}
            </div>
            
            {/* 既存: 形式 */}
            <div className="px-2 text-center">
              <span className="font-bold text-slate-500 mr-1">ファイル形式:</span>
              {file.format}
            </div>
          </div>
          {/* ▲▲▲ 修正ここまで ▲▲▲ */}
        
        </div>
      </div>
    </div>
  );
};

