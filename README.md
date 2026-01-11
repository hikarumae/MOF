


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