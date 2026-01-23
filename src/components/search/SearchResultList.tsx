'use client';

import React from 'react';
import { SearchResult } from '../../types/file';
import { ResultCard } from './ResultCard'; 

interface SearchResultListProps {
  results: SearchResult[];
  selectedFileId: string | null;
  onFileSelect: (file: SearchResult) => void;
}

export const SearchResultList = ({ results, selectedFileId, onFileSelect }: SearchResultListProps) => {
  if (results.length === 0) {
    return <p className="text-slate-500 py-4">該当するファイルが見つかりませんでした。</p>;
  }

  return (
    <div className="space-y-4">
      {results.map((file) => (
        // ここは ResultCard コンポーネントを使用
        <ResultCard 
          key={file.id}
          file={file}
          isSelected={selectedFileId === file.id}
          onClick={() => onFileSelect(file)}
        />
      ))}
    </div>
  );
};