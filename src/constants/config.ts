// src.constants.config.ts

/**
 * アプリケーション全体で使用する定数
 */

// APIのベースURL
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
//
// ★26.01.24 修正 maccha
// 上記の渡し方だとビルドで固定されてしまていたため、一旦localhostの記載を削除します。
// export const BACKEND_API_URL = 'https://tech0-gen-11-step3-2-py-52.azurewebsites.net';

export const BACKEND_API_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; 

// アプリケーション名
export const APP_NAME = "司書AIアプリ MOF";

// その他の定数（必要に応じて追加）:　データが取れなかった時に表示
export const DEFAULT_FILE_FORMAT = "PDF";

// ▼▼ 修正: 名前を変更し、未取得時のデフォルト値を設定 ▼▼
export const DEFAULT_DOCUMENT_CATEGORY = "未分類"; // 旧 SYSTEM_AUTHOR_NAME
export const DEFAULT_DOCUMENT_DATE = "-";         // 旧 LAST_UPDATED_PLACEHOLDER