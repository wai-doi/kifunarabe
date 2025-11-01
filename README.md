# 棋譜並べ

Webで棋譜並べができるアプリケーション

## 技術スタック

- **フロントエンド**: React 18.x + TypeScript 5.x
- **ビルドツール**: Vite 5.x
- **スタイリング**: Tailwind CSS 4.x

## 前提条件

- Node.js 18.x以上（推奨: 20.x LTS）
- npm または yarn

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 利用可能なコマンド

- `npm run dev` - 開発サーバーを起動（ホットリロード有効）
- `npm run build` - 本番用ビルドを生成
- `npm run preview` - ビルドしたアプリケーションをプレビュー
- `npx tsc --noEmit` - TypeScript型チェックを実行

## プロジェクト構造

```
kifunarabe/
├── public/              # 静的アセット
├── src/
│   ├── components/      # Reactコンポーネント
│   ├── App.tsx          # ルートコンポーネント
│   ├── main.tsx         # アプリケーションエントリーポイント
│   └── index.css        # グローバルスタイル（Tailwind含む）
├── index.html           # HTMLテンプレート
├── package.json         # 依存関係管理
├── tsconfig.json        # TypeScript設定
├── vite.config.ts       # Vite設定
└── tailwind.config.js   # Tailwind CSS設定
```

## トラブルシューティング

### ポートが使用中の場合

デフォルトポート（5173）が使用中の場合、Viteは自動的に別のポートを選択します。表示されたURLにアクセスしてください。

### 依存関係のインストールエラー

```bash
# npm キャッシュをクリア
npm cache clean --force

# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### TypeScriptエラー

```bash
# 型チェックを実行して詳細を確認
npx tsc --noEmit
```

## ライセンス

このプロジェクトはプライベートプロジェクトです。
