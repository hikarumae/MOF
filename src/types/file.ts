// src/types/file.ts

export type SearchResult = {
  // 画面側で選択判定に使うID（ユニークなら何でもOK）
  id: string;

  // backend: sources.file_name
  name: string;

  // backend: sources.text
  summary: string;

  // backend: sources.category
  category: string;

  // backend: sources.uri
  uri: string;

  // backend: sources.page (nullあり)
  page: number | null;

  // backend: sources.chunk_id
  chunkId: number;

  // 既存UIが参照しているので残す（固定値）
  tags: string[];
  format: string;
  
  // 旧 author: 文書カテゴリとして使用
  documentCategory: string;

  // 旧 lastUpdated: 文書内の日付として使用
  documentDate: string;
};
  

