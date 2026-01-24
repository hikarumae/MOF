# MOF_Frontend README

# 使い方
npm run dev
(.envなどは特段不要のはず)

# API仕様
## GET /ask
### 送信データ形式
- http://..../ask?q=質問文

### 送信例
- http://localhost:8000/ask?q=職務権限の規定書は？
- http://localhost:8000/ask?q=就業時間を定めた書類を教えて。
- http://localhost:8000/ask?q=大量のパソコンを購入した契約書
- http://localhost:8000/ask?q=東京メディカル社との契約書は？


### 受信データ形式
{
  "answer": "string",
  "sources": [
    {
      "file_name": "string",
      "uri": "string",
      "category": "string",
      "page": 1,
      "chunk_id": 0,
      "text": "string"
    }
  ]
}

### 受信データ例
{
  "answer": "就業規則 2025改定 第6版には、就業時間は原則8:00から17:00と定められています。",
  "sources": [
    {
      "file_name": "就業規則_2025改定.pdf",
      "uri": "https://intra.example.co.jp/docs/shugyo_rules_2025.pdf",
      "category": "rule",
      "page": 12,
      "chunk_id": 34,
      "text": "始業時刻 08:00 終業 17:00"
    },
    {
      "file_name": "人事規程_補足説明.pdf",
      "uri": "https://intra.example.co.jp/docs/jinji_supplement.pdf",
      "category": "rule",
      "page": 3,
      "chunk_id": 7,
      "text": "就業規則の変更は、1週間までに本人へ通知することとする。"
    }
  ]
}



# ファイル構成
src/
├── app/
│   ├── layout.tsx          # 共通レイアウト（現状のまま）
│   ├── page.tsx            # メインページ（各部品を組み立てる場所）
│   └── globals.css         # グローバルスタイル
├── components/             # 再利用可能なUIパーツ
│   ├── layout/             # 構造に関するコンポーネント
│   │   └── Header.tsx      # Header
│   ├── search/             # 検索機能に関連する部品
│   │   ├── SearchForm.tsx  # 検索入力
│   │   ├── SearchResultList.tsx # 結果一覧
│   │   └── ResultCard.tsx  # 各ファイルの結果カード
│   └── preview/            # プレビュー関連
│       └── FilePreview.tsx # 右側のプレビューエリア
├── hooks/                  # ビジネスロジック
│   └── useFileSearch.ts    # handleSearch や fetch のロジックを抽出
├── types/                  # 型定義
│   └── file.ts             # SearchResult 型を定義
└── constants/              # 定数
    └── config.ts           # API_BASE_URL などの設定値

```