# API Contracts: 駒クリック時の選択ハイライト表示

**Feature**: 013-piece-click-highlight
**Date**: 2025年12月14日

## 概要

この機能は主にUI層の変更であり、外部APIは関与しません。このドキュメントでは、内部の関数シグネチャとコンポーネントのプロップス契約を定義します。

## 関数契約

### selectionLogic.ts

#### canSelectPiece

駒が現在の手番で選択可能かを判定します。

**シグネチャ**:

```typescript
function canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean
```

**パラメータ**:

| 名前 | 型 | 必須 | 説明 |
|------|-----|------|------|
| `piece` | `Piece \| null` | ✓ | 判定対象の駒。nullの場合は空マスを表す |
| `currentTurn` | `Turn` | ✓ | 現在の手番（'sente' または 'gote'） |

**戻り値**:

| 型 | 説明 |
|----|------|
| `boolean` | 選択可能な場合true、それ以外false |

**ロジック**:

```
if piece is null:
  return false
return piece.player === currentTurn
```

**使用例**:

```typescript
import { canSelectPiece } from '../logic/selectionLogic';

const piece = pieces.find(p => p.file === 5 && p.rank === 7);
const isSelectable = canSelectPiece(piece ?? null, currentTurn);

if (isSelectable) {
  setSelection({ type: 'board', position: { file: 5, rank: 7 } });
}
```

**エラー処理**:

この関数は純粋関数であり、例外をスローしません。無効な入力（undefined等）に対しては型システムで保護されます。

**テストケース**:

| ケース | piece | currentTurn | 期待される結果 |
|--------|-------|-------------|----------------|
| 空マス | null | 'sente' | false |
| 先手の駒、先手の番 | { player: 'sente', ... } | 'sente' | true |
| 先手の駒、後手の番 | { player: 'sente', ... } | 'gote' | false |
| 後手の駒、先手の番 | { player: 'gote', ... } | 'sente' | false |
| 後手の駒、後手の番 | { player: 'gote', ... } | 'gote' | true |

## コンポーネント契約

### Square.tsx（既存コンポーネントの拡張）

マス目を表示するコンポーネント。選択状態に応じて枠のスタイルを変更します。

**プロップス**:

| 名前 | 型 | 必須 | デフォルト | 説明 |
|------|-----|------|------------|------|
| `piece` | `Piece \| null` | ✓ | - | このマスに配置されている駒（空の場合null） |
| `position` | `Position` | ✓ | - | このマスの座標 |
| `isSelected` | `boolean` | ✓ | false | 選択状態かどうか |
| `onClick` | `(position: Position) => void` | ✓ | - | クリック時のハンドラ |
| `isValidTarget` | `boolean` | ✗ | false | 移動先として有効かどうか（既存機能） |

**変更内容**:

- スタイルクラスの条件分岐を変更
- 選択時（`isSelected === true`）の枠色を `border-4 border-orange-600` に変更
- 既存の `border-2 border-black` を削除

**スタイル仕様**:

```typescript
const borderClass = isSelected 
  ? 'border-4 border-orange-600'  // 選択時: オレンジの太枠
  : 'border border-gray-400';      // 非選択時: グレーの細枠
```

### Board.tsx（既存コンポーネントの変更）

盤面全体を表示するコンポーネント。

**プロップス変更**: なし

**内部ロジック変更**:
- Square.tsxに渡す `isSelected` の判定ロジックは変更なし
- 親コンポーネント（ShogiBoard.tsx）から渡される `selectedPosition` をそのまま使用

### ShogiBoard.tsx（既存コンポーネントの変更）

将棋盤のメインコンポーネント。選択ロジックを統合します。

**プロップス変更**: なし（トップレベルコンポーネント）

**内部変更**:

#### handleSquareClick の更新

```typescript
const handleSquareClick = (position: Position) => {
  const clickedPiece = pieces.find(
    (p) => p.file === position.file && p.rank === position.rank
  ) ?? null;

  // 新規: 選択可否判定を追加
  if (!canSelectPiece(clickedPiece, currentTurn)) {
    // 選択不可能な駒または空マス → 何もしない
    return;
  }

  // 既存ロジック: 選択可能な駒の場合のみ以下を実行
  // ...
};
```

## 型定義

### 既存型（変更なし）

```typescript
// types/piece.ts
export type Player = 'sente' | 'gote';
export type PieceType = '王' | '玉' | '飛' | '角' | '金' | '銀' | '桂' | '香' | '歩';

export interface Piece {
  type: PieceType;
  player: Player;
  file: number;
  rank: number;
  promoted: boolean;
}

// types/turn.ts
export type Turn = 'sente' | 'gote';

// types/position.ts
export interface Position {
  file: number;
  rank: number;
}

// types/selection.ts
export type Selection = BoardSelection | CapturedSelection;

export interface BoardSelection {
  type: 'board';
  position: Position;
}

export interface CapturedSelection {
  type: 'captured';
  player: Player;
  pieceType: PieceType;
}
```

### 新規型

この機能では新しい型定義は追加しません。

## スタイル契約

### Tailwind CSSクラス

#### 選択枠のスタイル

**選択状態の枠**:

```css
/* Tailwindクラス */
border-4 border-orange-600

/* 対応するCSS（参考） */
border-width: 4px;
border-color: #EA580C;
```

**非選択状態の枠**:

```css
/* Tailwindクラス */
border border-gray-400

/* 対応するCSS（参考） */
border-width: 1px;
border-color: #9CA3AF;
```

#### アクセシビリティ

**コントラスト比**:
- オレンジ色（#EA580C）と白背景: 4.52:1 (WCAG AA合格)
- オレンジ色（#EA580C）と盤面背景（#C8B560）: 3.18:1 (大きなUI要素として合格)

## 統合ポイント

### 既存機能との統合

#### 駒移動機能との統合

- 選択後の駒移動ロジックは変更なし
- 移動完了後の選択解除は既存の `setSelection(null)` で対応

#### 手番管理との統合

- `switchTurn` 関数呼び出し後、選択状態を自動リセット
- 既存のロジックで対応可能（追加実装不要の可能性あり）

#### 持ち駒選択との統合

- 持ち駒の選択（`CapturedSelection`）は本機能のスコープ外
- 既存の動作を維持

## バージョン管理

**初版**: 2025年12月14日
**変更履歴**: なし

## 備考

- この契約書は実装前の設計ドキュメントです
- 実装時に追加の型やプロップスが必要になった場合、このドキュメントを更新してください
- テストコードは契約書の仕様に基づいて作成してください
