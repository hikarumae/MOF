'use client';

import React from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  variant?: 'large' | 'small'; // 見た目を切り替えるためのオプション
}

export const SearchForm = ({ value, onChange, onSubmit, variant = 'small' }: SearchFormProps) => {
  // 検索前の大きなデザイン
  if (variant === 'large') {
    return (
      <form onSubmit={onSubmit} className="w-full">
        <div className="relative w-full group">
          <div className="flex items-center bg-gray-100 rounded-full px-6 h-[64px] border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-lg transition-all">
            <Search className="w-6 h-6 text-slate-400 mr-4" />
            <input 
              type="text" 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="ここに質問を入力（例：出張の日当は？結婚の祝い金は？）" 
              className="flex-1 text-lg outline-none bg-transparent placeholder:text-slate-400"
            />
            <Sparkles className="w-6 h-6 text-blue-500 ml-4" />
          </div>
        </div>
      </form>
    );
  }

  // 結果画面のコンパクトなデザイン
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center bg-gray-100 rounded-lg px-4 h-12 border border-transparent focus-within:bg-white focus-within:border-blue-300 focus-within:shadow-md transition-all">
        <Search className="w-5 h-5 text-slate-400 mr-3" />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-800"
        />
        <Sparkles className="w-5 h-5 text-blue-500" />
      </div>
    </form>
  );
};