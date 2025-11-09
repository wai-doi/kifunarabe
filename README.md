# 棋譜並べ

Webで棋譜並べができるアプリケーション

## 技術スタック

- **フロントエンド**: React 19.1.1 + TypeScript 5.9.3
- **ビルドツール**: Vite 7.1.12
- **スタイリング**: Tailwind CSS 4.1.16
- **テスト**: Vitest 3.2.4 + React Testing Library

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
- `npm test` - テストを実行（watch モード）
- `npm run test:coverage` - カバレッジレポート付きでテストを実行
- `npm run lint` - ESLintでコードチェック
- `npm run format` - Prettierでコード整形
- `npm run check` - Lint + Format チェックを実行
- `npx tsc --noEmit` - TypeScript型チェックを実行

## 実装済み機能

### 基本機能
- ✅ 将棋盤の表示 (9×9マス目)
- ✅ 駒の初期配置
- ✅ 駒の移動（各駒の基本的な動きルールに従う）
- ✅ ターン制御（先手・後手の交代）
- ✅ 駒の捕獲（相手の駒を取る）
- ✅ 持ち駒の表示（取った駒の管理と表示）

### 駒の動きルール
- 歩: 前方1マス
- 香: 前方直進
- 桂: 前方2マス+左右1マス
- 銀: 前方3方向+後方斜め2方向
- 金: 前方3方向+横2方向+真後ろ
- 飛車: 縦横4方向直進
- 角: 斜め4方向直進
- 王/玉: 全方向1マス

## プロジェクト構造

```
kifunarabe/
├── public/              # 静的アセット
├── src/
│   ├── components/      # Reactコンポーネント
│   │   ├── Board.tsx           # 将棋盤コンポーネント
│   │   ├── Piece.tsx           # 駒コンポーネント
│   │   ├── Square.tsx          # マスコンポーネント
│   │   ├── ShogiBoard.tsx      # 将棋盤統合コンポーネント
│   │   ├── TurnDisplay.tsx     # ターン表示コンポーネント
│   │   └── CapturedPieces.tsx  # 持ち駒表示コンポーネント
│   ├── logic/           # ビジネスロジック
│   │   ├── boardState.ts       # 盤面状態管理
│   │   ├── moveRules.ts        # 駒の移動ルール
│   │   ├── turnControl.ts      # ターン制御
│   │   └── captureLogic.ts     # 駒の捕獲処理
│   ├── types/           # 型定義
│   │   ├── piece.ts            # 駒関連の型
│   │   ├── board.ts            # 盤面関連の型
│   │   ├── position.ts         # 位置関連の型
│   │   ├── turn.ts             # ターン関連の型
│   │   └── capturedPieces.ts   # 持ち駒関連の型
│   ├── data/            # データ
│   │   └── initialPosition.ts  # 初期配置データ
│   ├── App.tsx          # ルートコンポーネント
│   ├── main.tsx         # アプリケーションエントリーポイント
│   └── index.css        # グローバルスタイル（Tailwind含む）
├── tests/               # テストファイル
│   ├── components/      # コンポーネントテスト
│   ├── logic/           # ロジックテスト
│   └── data/            # データテスト
├── specs/               # 機能仕様書
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
