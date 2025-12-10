# Quickstart: 二歩禁止ルール実装

**Feature**: 010-prevent-double-pawn
**Date**: 2025-12-10
**Audience**: 開発者

## はじめに

このガイドは、二歩禁止ルールを実装する開発者向けのクイックスタートです。このフィーチャーは、既存の駒打ちロジックを拡張し、同じ筋に2つ目の歩を打つことを防ぎます。

## 前提条件

- Node.js 18以上がインストールされている
- プロジェクトの依存関係がインストール済み（`npm install`）
- 以下のフィーチャーが既に実装されている:
  - 006-piece-drop（持ち駒を打つ機能）
  - 007-piece-promotion（駒の成り機能）

## 5分でわかる実装概要

### 1. 新しいファイルを作成

```bash
# 型定義
touch src/types/validation.ts

# 検証ロジック
touch src/logic/doublePawnValidation.ts

# テスト
touch tests/logic/doublePawnValidation.test.ts
```

### 2. 型定義を追加（`src/types/validation.ts`）

```typescript
export type ValidationErrorCode = 
  | 'DOUBLE_PAWN'
  | 'OUT_OF_BOARD'
  | 'SQUARE_OCCUPIED';

export interface ValidationResult {
  isValid: boolean;
  errorCode?: ValidationErrorCode;
  errorMessage?: string;
}
```

### 3. 検証ロジックを実装（`src/logic/doublePawnValidation.ts`）

```typescript
import type { Piece, Player } from '../types/piece';

/**
 * 指定された筋に未成の歩が存在するかチェック
 */
export function hasUnpromotedPawnInFile(
  pieces: Piece[],
  file: number,
  player: Player
): boolean {
  return pieces.some(
    (piece) =>
      piece.file === file &&
      piece.type === '歩' &&
      piece.player === player &&
      !piece.promoted
  );
}
```

### 4. 既存の`dropLogic.ts`を拡張

```typescript
// 既存の関数にオプショナルパラメータを追加
export function canDropPiece(
  pieces: Piece[],
  position: Position,
  pieceType?: PieceType,
  player?: Player
): boolean {
  // 既存のチェック
  if (!isWithinBoard(position)) return false;
  const isOccupied = pieces.some(
    (piece) => piece.file === position.file && piece.rank === position.rank
  );
  if (isOccupied) return false;

  // 新規: 二歩チェック（歩を打つ場合のみ）
  if (pieceType === '歩' && player) {
    return !hasUnpromotedPawnInFile(pieces, position.file, player);
  }

  return true;
}
```

### 5. テストを書く

```typescript
// tests/logic/doublePawnValidation.test.ts
import { describe, it, expect } from 'vitest';
import { hasUnpromotedPawnInFile } from '../../src/logic/doublePawnValidation';
import type { Piece } from '../../src/types/piece';

describe('hasUnpromotedPawnInFile', () => {
  it('同じ筋に未成の歩がある場合はtrueを返す', () => {
    const pieces: Piece[] = [
      { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }
    ];
    expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(true);
  });

  it('同じ筋に成り駒がある場合はfalseを返す', () => {
    const pieces: Piece[] = [
      { type: '歩', player: 'sente', file: 3, rank: 7, promoted: true }
    ];
    expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(false);
  });
});
```

### 6. テストを実行

```bash
npm test
```

## 詳細な実装手順

### Phase 1: コアロジックの実装

#### ステップ 1.1: 型定義

`src/types/validation.ts`に検証結果の型を定義します。詳細は[data-model.md](./data-model.md)を参照。

#### ステップ 1.2: 二歩判定関数

`src/logic/doublePawnValidation.ts`に以下の関数を実装:

1. `hasUnpromotedPawnInFile()` - 筋内の歩の存在チェック
2. `validateDoublePawn()` - 包括的な二歩検証
3. `getErrorMessage()` - エラーメッセージの生成

契約仕様は[contracts/doublePawnValidation.ts](./contracts/doublePawnValidation.ts)を参照。

#### ステップ 1.3: テストの作成

TDDアプローチで、まずテストを書いてから実装します:

```typescript
// 基本ケース
- 空の盤面で歩を打つ → 成功
- 同じ筋に歩がある → 失敗
- 異なる筋に歩がある → 成功

// エッジケース
- 成り駒は歩としてカウントしない
- 相手の歩は影響しない
- 全ての筋（1-9）で正しく動作
```

### Phase 2: 既存コードの統合

#### ステップ 2.1: `dropLogic.ts`の拡張

既存の`canDropPiece`関数にオプショナルパラメータを追加:

```typescript
export function canDropPiece(
  pieces: Piece[],
  position: Position,
  pieceType?: PieceType,  // 追加
  player?: Player         // 追加
): boolean
```

**重要**: オプショナルパラメータにすることで、既存のコードとの後方互換性を維持します。

#### ステップ 2.2: UIコンポーネントの更新

1. **`Board.tsx`**: 打てる候補マスの計算に二歩チェックを追加
2. **`App.tsx`**: エラーメッセージの状態管理と表示

```typescript
// Board.tsx
const validDropSquares = useMemo(() => {
  if (selectedCapturedPiece?.type !== '歩') return allEmptySquares;
  
  return allEmptySquares.filter(
    (pos) => !hasUnpromotedPawnInFile(pieces, pos.file, currentPlayer)
  );
}, [selectedCapturedPiece, pieces, currentPlayer]);
```

### Phase 3: エラーハンドリング

#### ステップ 3.1: エラー状態の管理

```typescript
// App.tsx
const [errorMessage, setErrorMessage] = useState<string | null>(null);

const handleDropPiece = (position: Position) => {
  if (!canDropPiece(pieces, position, selectedPiece.type, currentPlayer)) {
    setErrorMessage('二歩は反則です');
    return;
  }
  // 駒を打つ処理...
};
```

#### ステップ 3.2: エラー表示UI

```typescript
// App.tsx
{errorMessage && (
  <div className="error-banner">
    {errorMessage}
    <button onClick={() => setErrorMessage(null)}>閉じる</button>
  </div>
)}
```

## テスト戦略

### ユニットテスト

```bash
# 特定のテストを実行
npm test doublePawnValidation

# カバレッジを確認
npm run test:coverage
```

**目標カバレッジ**: 90%以上

### 統合テスト

```bash
# UIコンポーネントのテスト
npm test Board
npm test App
```

### 手動テスト

1. アプリを起動: `npm run dev`
2. ブラウザで`http://localhost:5173`を開く
3. 以下のシナリオをテスト:
   - 同じ筋に歩を打とうとする → エラーメッセージが表示される
   - 異なる筋に歩を打つ → 成功する
   - 成り駒がある筋に歩を打つ → 成功する

## トラブルシューティング

### 問題: 既存のテストが失敗する

**原因**: `canDropPiece`関数のシグネチャ変更
**解決**: オプショナルパラメータにしているため、既存の呼び出しは動作するはず。失敗する場合は、呼び出し箇所を確認。

### 問題: パフォーマンスが遅い

**原因**: 不要な再計算
**解決**: `useMemo`や`useCallback`でメモ化を確認

### 問題: エラーメッセージが表示されない

**原因**: 状態管理の問題
**解決**: Reactの開発者ツールで`errorMessage`の状態を確認

## 次のステップ

1. `/speckit.tasks`コマンドでタスクを生成
2. タスクに従って実装を進める
3. 各タスク完了後にテストを実行
4. 全てのテストが通ったらPRを作成

## 参考資料

- [仕様書](./spec.md) - フィーチャーの詳細
- [データモデル](./data-model.md) - 型定義の詳細
- [契約仕様](./contracts/doublePawnValidation.ts) - 関数シグネチャ
- [調査結果](./research.md) - 技術的な意思決定の背景

## 質問・サポート

実装中に不明な点があれば、以下を確認してください:

1. このquickstart.mdの該当セクション
2. 契約仕様のJSDocコメント
3. 既存の類似実装（`captureLogic.ts`、`promotionLogic.ts`など）

それでも解決しない場合は、プロジェクトのイシュートラッカーで質問してください。
