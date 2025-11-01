# Quick Start Guide: 駒の移動機能

**Feature**: 003-piece-movement
**Date**: 2025-11-02
**Audience**: 開発者

## 概要

このガイドでは、駒の移動機能の開発環境をセットアップし、実装を開始するための手順を説明します。

## 前提条件

このフィーチャーは既存のプロジェクト(002-shogi-board-display)の上に構築されます。以下が既にセットアップされていることを確認してください:

- Node.js v18以上
- npm v9以上
- Git
- プロジェクトのクローン完了
- ブランチ `002-shogi-board-display` の実装が完了し、マージ済み

## セットアップ手順

### 1. ブランチの切り替え

```bash
# mainブランチに移動
git checkout main

# 最新の変更を取得
git pull origin main

# 003-piece-movementブランチに切り替え
git checkout 003-piece-movement
```

### 2. 依存関係のインストール

```bash
# プロジェクトルートで実行
npm install
```

**主な依存関係**:
- React 19.1.1 (既存)
- TypeScript 5.9.3 (既存)
- Tailwind CSS 4.1.16 (既存)
- Vite 7.1.7 (既存)
- Vitest (既存)
- React Testing Library (既存)

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、既存の将棋盤表示が確認できます。

### 4. 既存の実装を確認

以下のファイルが既に実装されていることを確認:

```bash
src/
├── components/
│   ├── Board.tsx           # 将棋盤コンポーネント
│   ├── Square.tsx          # マス目コンポーネント
│   ├── Piece.tsx           # 駒コンポーネント
│   └── ShogiBoard.tsx      # 統合コンポーネント
├── types/
│   ├── piece.ts            # 駒の型定義
│   ├── position.ts         # 座標の型定義
│   └── board.ts            # 将棋盤の型定義
├── data/
│   └── initialPosition.ts  # 初期配置データ
└── App.tsx
```

### 5. テストの実行

```bash
# すべてのテストを実行
npm test

# ウォッチモードで実行
npm test -- --watch

# カバレッジレポートを生成
npm run test:coverage
```

既存のテストがすべてパスすることを確認してください。

## 開発フロー

### TDD (Test-Driven Development) の実践

このプロジェクトではTDDを厳格に遵守します:

1. **Red**: まずテストを書き、失敗することを確認
2. **Green**: テストをパスする最小限の実装
3. **Refactor**: コードを改善しながらテストは常にパス

### 開発の順序

以下の順序で実装を進めることを推奨します:

#### Phase 1: 移動ルールロジックの実装

1. **テストファイル作成**: `tests/logic/moveRules.test.ts`
2. **テストケース追加**: 各駒種の移動パターン
3. **実装**: `src/logic/moveRules.ts`
4. **確認**: テストがパス

```bash
# 移動ルールのテストのみ実行
npm test -- moveRules
```

#### Phase 2: 盤面状態管理の実装

1. **テストファイル作成**: `tests/logic/boardState.test.ts`
2. **テストケース追加**: 盤面の更新ロジック
3. **実装**: `src/logic/boardState.ts`
4. **確認**: テストがパス

#### Phase 3: UIコンポーネントの拡張

1. **Pieceコンポーネントの拡張**:
   - テスト追加: 選択状態の視覚表示
   - 実装: `isSelected` propとスタイリング

2. **Squareコンポーネントの拡張**:
   - テスト追加: クリックハンドラー
   - 実装: `onClick` prop

3. **ShogiBoardコンポーネントの拡張**:
   - テスト追加: 駒の選択・移動
   - 実装: React Hooksによる状態管理

```bash
# コンポーネントのテストのみ実行
npm test -- components
```

### 実装例: 最初のテストケース

`tests/logic/moveRules.test.ts` の例:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateValidMoves } from '@/logic/moveRules';
import type { Piece, Position, Board } from '@/types';

describe('calculateValidMoves', () => {
  it('先手の歩は前方(段が増える方向)1マスのみ移動可能', () => {
    const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7 };
    const position: Position = { file: 5, rank: 7 };
    const board: Board = [piece]; // 5七の歩のみ
    
    const validMoves = calculateValidMoves(piece, position, board);
    
    expect(validMoves).toHaveLength(1);
    expect(validMoves).toContainEqual({ file: 5, rank: 8 }); // 5八に移動
  });
  
  // 他のテストケースを追加...
});
```

## デバッグ

### React DevTools

ブラウザの拡張機能 "React Developer Tools" をインストールすることを推奨します:

- [Chrome版](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox版](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### デバッグコマンド

```bash
# TypeScriptの型チェック
npm run build

# ESLintでコード品質チェック
npm run lint

# プロダクションビルド
npm run build
```

### よくある問題と解決方法

#### 問題1: テストが失敗する

```bash
# キャッシュをクリア
rm -rf node_modules/.vite
npm test
```

#### 問題2: 型エラーが出る

```bash
# 型定義を再生成
npm run build
```

#### 問題3: 開発サーバーが起動しない

```bash
# ポートが使用中の場合、別のポートを指定
npm run dev -- --port 5174
```

## コーディング規約

### 日本語コメント

すべてのコメントは日本語で記述してください:

```typescript
// Good
// 駒の移動可能なマスを計算する関数
function calculateValidMoves() { ... }

// Bad
// Calculate valid moves for a piece
function calculateValidMoves() { ... }
```

### 型定義

TypeScriptの型を明示的に定義してください:

```typescript
// Good
function isValidMove(from: Position, to: Position, piece: Piece): boolean {
  ...
}

// Bad
function isValidMove(from, to, piece) {
  ...
}
```

### イミュータブルな更新

状態更新は常にイミュータブルに:

```typescript
// Good: イミュータブルな更新
const newBoard = board.map(piece => {
  if (piece.file === from.file && piece.rank === from.rank) {
    return { ...piece, file: to.file, rank: to.rank };
  }
  return piece;
});

// Bad: 元のオブジェクトを直接変更
const piece = board.find(p => p.file === from.file && p.rank === from.rank);
if (piece) {
  piece.file = to.file; // ❌ Reactが変更を検知できない
}
```

## リソース

### ドキュメント

- [spec.md](./spec.md) - 機能仕様書
- [plan.md](./plan.md) - 実装計画
- [data-model.md](./data-model.md) - データモデル定義
- [research.md](./research.md) - 技術調査結果
- [contracts/README.md](./contracts/README.md) - コンポーネントインターフェース

### 参考資料

- [React Hooks ドキュメント](https://react.dev/reference/react/hooks)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vitest ドキュメント](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 次のステップ

1. `data-model.md`を読んでデータ構造を理解する
2. `contracts/README.md`を読んでコンポーネントインターフェースを確認する
3. 最初のテストケースを書く(`tests/logic/moveRules.test.ts`)
4. Red-Green-Refactorサイクルで実装を進める

## サポート

問題が発生した場合:

1. 既存のドキュメントを確認
2. テストを実行して問題を特定
3. チームメンバーに相談

Happy coding! 🎉
