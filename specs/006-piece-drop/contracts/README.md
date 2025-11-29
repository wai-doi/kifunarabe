# Contracts: 持ち駒を打つ機能

**Feature**: 006-piece-drop
**Date**: 2025-11-29

## 概要

このフィーチャーはフロントエンドのみのReactアプリケーションであり、バックエンドAPIは存在しない。
このドキュメントでは、コンポーネント間のインターフェース契約と、ロジック関数のシグネチャを定義する。

## コンポーネント契約

### 1. CapturedPieces コンポーネント

**現在のProps**:
```typescript
interface CapturedPiecesProps {
  capturedPieces: CapturedPiecesMap;
  player: Player;
}
```

**拡張後のProps**:
```typescript
interface CapturedPiecesProps {
  capturedPieces: CapturedPiecesMap;
  player: Player;
  // 新規追加
  onPieceClick?: (pieceType: PieceType) => void;
  selectedPieceType?: PieceType | null;
  isSelectable?: boolean;
}
```

**契約**:
- `onPieceClick`: 持ち駒がクリックされた時に呼び出される。駒種を引数として渡す
- `selectedPieceType`: 現在選択中の駒種。ハイライト表示に使用
- `isSelectable`: false の場合、クリックイベントを無視（相手の手番時）

### 2. ShogiBoard コンポーネント

**状態の拡張**:
```typescript
// 現在
const [selected, setSelected] = useState<Position | null>(null);

// 拡張後
const [selection, setSelection] = useState<Selection | null>(null);
```

**新規ハンドラ**:
```typescript
// 持ち駒がクリックされた時
handleCapturedPieceClick(player: Player, pieceType: PieceType): void

// 盤面クリック時（既存を拡張）
handleSquareClick(position: Position): void
  // selection.type === 'captured' の場合、打つ処理を実行
```

## ロジック関数契約

### 1. dropLogic.ts（新規）

```typescript
/**
 * 指定位置に駒を打てるか判定する
 * @param pieces - 盤面上の駒配列
 * @param position - 打ちたい位置
 * @returns 打てる場合 true
 */
function canDropPiece(pieces: Piece[], position: Position): boolean;

/**
 * 盤面に駒を打つ（イミュータブル）
 * @param pieces - 盤面上の駒配列
 * @param position - 打つ位置
 * @param pieceType - 駒の種類
 * @param player - プレイヤー
 * @returns 駒が追加された新しい盤面
 */
function dropPiece(
  pieces: Piece[],
  position: Position,
  pieceType: PieceType,
  player: Player
): Piece[];
```

### 2. captureLogic.ts（拡張）

```typescript
/**
 * 持ち駒から1つ削除する（イミュータブル）
 * @param capturedPieces - 現在の持ち駒
 * @param pieceType - 削除する駒の種類
 * @param player - プレイヤー
 * @returns 更新された持ち駒
 * @throws 持ち駒が0個の場合はエラー
 */
function removeFromCapturedPieces(
  capturedPieces: CapturedPieces,
  pieceType: PieceType,
  player: Player
): CapturedPieces;
```

## 型定義契約

### types/selection.ts（新規）

```typescript
/**
 * 盤面上の駒を選択した状態
 */
interface BoardSelection {
  type: 'board';
  position: Position;
  player: Player;
}

/**
 * 持ち駒を選択した状態
 */
interface CapturedSelection {
  type: 'captured';
  pieceType: PieceType;
  player: Player;
}

/**
 * 選択状態の共用型
 */
type Selection = BoardSelection | CapturedSelection;
```

## イベントフロー契約

### 持ち駒を打つ場合

```
1. [CapturedPieces] onPieceClick(pieceType) を発火
2. [ShogiBoard] handleCapturedPieceClick を呼び出し
   - バリデーション: 現在の手番 === player
   - 成功: setSelection({ type: 'captured', pieceType, player })
   - 失敗: 何もしない
3. [Board] onSquareClick(position) を発火
4. [ShogiBoard] handleSquareClick を呼び出し
   - selection.type === 'captured' を確認
   - canDropPiece(pieces, position) でバリデーション
   - 成功:
     - setPieces(dropPiece(...))
     - setCapturedPieces(removeFromCapturedPieces(...))
     - setCurrentTurn(switchTurn(...))
     - setSelection(null)
   - 失敗: 選択状態を維持
```

### 選択切り替えの場合

```
持ち駒選択中に盤面の自分の駒をクリック:
1. [Board] onSquareClick(position) を発火
2. [ShogiBoard] 位置に自分の駒があることを確認
3. setSelection({ type: 'board', position, player: currentTurn })

盤面駒選択中に持ち駒をクリック:
1. [CapturedPieces] onPieceClick(pieceType) を発火
2. [ShogiBoard] handleCapturedPieceClick を呼び出し
3. setSelection({ type: 'captured', pieceType, player: currentTurn })
```
