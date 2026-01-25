// src.constants.config.ts

/**
 * アプリケーション全体で使用する定数
 */

// APIのベースURL
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
//
// ★26.01.24 修正 maccha
// 上記の渡し方だとビルドで固定されてしまていたため、一旦localhostの記載を削除します。
export const BACKEND_API_URL = 'https://tech0-gen-11-step3-2-py-52.azurewebsites.net';

// アプリケーション名
export const APP_NAME = "司書AIアプリ MOF";

// その他の定数（必要に応じて追加）
export const DEFAULT_FILE_FORMAT = "PDF";
export const SYSTEM_AUTHOR_NAME = "システム";
export const LAST_UPDATED_PLACEHOLDER = "2026/01/04";
