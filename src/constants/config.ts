/**
 * アプリケーション全体で使用する定数
 */

// src.constants.config.ts

// APIのベースURL
// 環境変数 NEXT_PUBLIC_API_URL があればそれを使用し、なければローカル環境をデフォルトにする
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// アプリケーション名
export const APP_NAME = "司書AIアプリ MOF";

// その他の定数（必要に応じて追加）
export const DEFAULT_FILE_FORMAT = "PDF";
export const SYSTEM_AUTHOR_NAME = "システム";
export const LAST_UPDATED_PLACEHOLDER = "2026/01/04";
