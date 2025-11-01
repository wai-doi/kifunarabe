# Quickstart: 将棋盤と駒の初期配置表示

**Date**: 2025-11-01
**Feature**: 001-shogi-board-display

## 前提条件

- Node.js 18.x以上
- npm 9.x以上
- Git

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/wai-doi/kifunarabe.git
cd kifunarabe
```

### 2. ブランチのチェックアウト

```bash
git checkout 001-shogi-board-display
```

### 3. 依存関係のインストール

```bash
npm install
```

既存の依存関係:
- React 19.1.1
- TypeScript 5.9.3
- Vite 7.1.7
- Tailwind CSS 4.1.16

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、将棋盤が表示されます。

---

## プロジェクト構造

```
kifunarabe/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── Board.tsx       # 将棋盤コンポーネント(作成予定)
│   │   ├── Square.tsx      # マス目コンポーネント(作成予定)
│   │   ├── Piece.tsx       # 駒コンポーネント(作成予定)
│   │   └── ShogiBoard.tsx  # 統合コンポーネント(作成予定)
│   ├── types/              # 型定義(作成予定)
│   │   ├── piece.ts
│   │   ├── position.ts
│   │   └── board.ts
│   ├── data/               # データ(作成予定)
│   │   └── initialPosition.ts
│   ├── App.tsx             # メインアプリケーション
│   ├── main.tsx           # エントリーポイント
│   └── index.css          # グローバルスタイル
├── tests/                  # テスト(作成予定)
│   ├── components/
│   └── data/
├── specs/
│   └── 001-shogi-board-display/
│       ├── spec.md         # 機能仕様
│       ├── plan.md         # 実装計画(このファイル)
│       ├── research.md     # 技術調査
│       ├── data-model.md   # データモデル
│       └── quickstart.md   # このファイル
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## 開発ワークフロー

### TDD(テスト駆動開発)サイクル

このプロジェクトは憲法に従い、テスト駆動開発を実践します。

1. **Red**: テストを先に書き、失敗を確認
2. **Green**: テストが通る最小限の実装
3. **Refactor**: コードを整理

### ステップバイステップ

#### Phase 1: 型定義の作成

```bash
# 型定義ファイルを作成
touch src/types/piece.ts
touch src/types/position.ts
touch src/types/board.ts

# テストファイルを作成
touch tests/types/piece.test.ts
```

**参照**: `specs/001-shogi-board-display/data-model.md` の型定義を使用

#### Phase 2: 初期配置データの作成

```bash
# データファイルを作成
mkdir -p src/data
touch src/data/initialPosition.ts

# テストファイルを作成
mkdir -p tests/data
touch tests/data/initialPosition.test.ts
```

**テスト内容**:
- 配列の長さが40である
- 重複する位置がない
- 王と玉が正しいplayerに属している

#### Phase 3: コンポーネントの作成

作成順序(依存関係の少ない順):

1. **Piece** コンポーネント
   ```bash
   touch src/components/Piece.tsx
   touch tests/components/Piece.test.tsx
   ```
   - 駒の文字を表示
   - 後手の駒を回転
   - 色を適用

2. **Square** コンポーネント
   ```bash
   touch src/components/Square.tsx
   touch tests/components/Square.test.tsx
   ```
   - マス目の境界線
   - 駒があればPieceをレンダリング

3. **Board** コンポーネント
   ```bash
   touch src/components/Board.tsx
   touch tests/components/Board.test.tsx
   ```
   - 9×9のグリッド
   - 81個のSquareを配置

4. **ShogiBoard** コンポーネント
   ```bash
   touch src/components/ShogiBoard.tsx
   touch tests/components/ShogiBoard.test.tsx
   ```
   - すべてを統合
   - 背景色を適用

#### Phase 4: App.tsxの更新

```bash
# App.tsxにShogiBoardを追加
# tests/App.test.tsxも作成
```

---

## テストの実行

### テストフレームワークのセットアップ

```bash
# Vitestと関連パッケージをインストール
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードで実行
npm test -- --watch

# カバレッジレポートを生成
npm run test:coverage
```

---

## ビルドとデプロイ

### 本番ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに生成されます。

### プレビュー

```bash
npm run preview
```

本番ビルドをローカルでプレビューできます。

---

## コーディング規約

### TypeScript

- 厳格な型チェックを有効化(`tsconfig.json`で設定済み)
- `any`型の使用を避ける
- インターフェースと型エイリアスを適切に使い分ける

### React

- 関数コンポーネントを使用
- propsの型定義を必須とする
- `React.memo`で不要な再レンダリングを防止
- カスタムフックは`use`プレフィックスを付ける

### スタイリング

- Tailwind CSSのユーティリティクラスを優先
- カスタムCSSは最小限に(グリッドレイアウトなど)
- 色の値は直接指定せず、仕様書の定義を使用

### コメント

- **日本語で記述**(憲法に従う)
- JSDocコメントで型と説明を追加
- 複雑なロジックには説明コメントを付ける

**例**:
```typescript
/**
 * 将棋の駒を表示するコンポーネント
 * @param piece - 表示する駒のデータ
 */
export const Piece: React.FC<PieceProps> = ({ piece }) => {
  // 後手の駒は180度回転させる
  const rotation = piece.player === 'gote' ? 'rotate-180' : '';

  return (
    <div className={rotation}>
      {piece.type}
    </div>
  );
};
```

---

## トラブルシューティング

### よくある問題

#### 1. 依存関係のエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. Viteサーバーが起動しない

```bash
# ポート5173が使用中の場合、別のポートを指定
npm run dev -- --port 5174
```

#### 3. TypeScriptの型エラー

```bash
# 型定義ファイルを再生成
npm run build
```

#### 4. Tailwind CSSが適用されない

`tailwind.config.js`の`content`設定を確認:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

---

## 次のステップ

1. **テストの作成**: TDDサイクルに従い、各コンポーネントのテストを先に作成
2. **実装**: テストが通るように実装
3. **リファクタリング**: コードを整理し、パフォーマンスを最適化
4. **レビュー**: 憲法準拠を確認し、プルリクエストを作成

---

## 参考ドキュメント

- [仕様書](./spec.md) - 機能の要件と受け入れ基準
- [実装計画](./plan.md) - 技術的なアプローチと設計
- [技術調査](./research.md) - 技術選定の根拠
- [データモデル](./data-model.md) - 型定義とデータ構造
- [コンポーネント契約](./contracts/README.md) - コンポーネント間のインターフェース

---

## サポート

質問や問題がある場合は、以下を確認してください:

1. このQuickstartガイド
2. 上記の参考ドキュメント
3. プロジェクト憲法(`.specify/memory/constitution.md`)
4. GitHubのIssueを検索または作成
