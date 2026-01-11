'use client';

import React from 'react';
import { SearchResult } from '../../types/file';

interface ResultCardProps {
  file: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}

export const ResultCard = ({ file, isSelected, onClick }: ResultCardProps) => {
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
          <h3 className={`font-bold text-lg group-hover:text-blue-700 ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
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
            <div className="border-r border-gray-300 px-2 text-center">作成者: {file.author}</div>
            <div className="border-r border-gray-300 px-2 text-center">最終更新: {file.lastUpdated}</div>
            <div className="px-2 text-center">形式: {file.format}</div>
          </div>
        </div>
      </div>
    </div>
  );
};