# Quickstart: 棋譜並べWebアプリケーション - 初期セットアップ

**Date**: 2025年11月1日
**Feature**: 001-kifu-viewer-app

## 前提条件

- Node.js 18.x以上がインストールされていること（推奨: 20.x LTS）
- npm または yarn がインストールされていること
- モダンWebブラウザ（Chrome、Firefox、Safari、Edge の最新版）

## セットアップ手順

### 1. プロジェクトの作成

```bash
# Viteを使用してReact + TypeScriptプロジェクトを作成
npm create vite@latest kifunarabe -- --template react-ts

# プロジェクトディレクトリに移動
cd kifunarabe
```

### 2. 依存関係のインストール

```bash
# 基本的な依存関係をインストール
npm install

# Tailwind CSSと関連パッケージをインストール
npm install -D tailwindcss postcss autoprefixer
```

### 3. Tailwind CSSの設定

```bash
# Tailwind CSS設定ファイルを生成
npx tailwindcss init -p
```

`tailwind.config.js` を以下のように編集:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`src/index.css` を以下のように編集:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. トップ画面の実装

`src/App.tsx` を以下のように編集:

```typescript
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          棋譜並べ
        </h1>
        <p className="text-gray-600">
          Webで棋譜並べができるアプリケーション
        </p>
      </div>
    </div>
  )
}

export default App
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスし、トップ画面が表示されることを確認します。

## 利用可能なコマンド

- `npm run dev` - 開発サーバーを起動（ホットリロード有効）
- `npm run build` - 本番用ビルドを生成
- `npm run preview` - ビルドしたアプリケーションをプレビュー
- `npx tsc --noEmit` - TypeScript型チェックを実行

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

## 次のステップ

初期セットアップが完了したら、以下の作業に進むことができます:

1. 棋譜並べの具体的な機能の仕様作成
2. コンポーネント設計
3. テストフレームワークの導入（Vitest + React Testing Library）

詳細は今後の機能仕様で定義されます。
