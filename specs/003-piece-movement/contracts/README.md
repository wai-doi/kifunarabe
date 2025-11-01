# Component Contracts: 駒の移動機能

**Feature**: 003-piece-movement
**Date**: 2025-11-02
**Purpose**: コンポーネント間のインターフェース定義

## 概要

このドキュメントでは、駒の移動機能で使用するReactコンポーネントのProps型定義とインターフェースを定義します。既存のコンポーネントの拡張と新規ロジック関数のシグネチャを明確にします。

---

## コンポーネント Contracts

### 1. ShogiBoard (統合コンポーネント)

**役割**: 将棋盤全体を管理し、駒の選択と移動の状態を保持する

**ファイル**: `src/components/ShogiBoard.tsx`

**Props**:
```typescript
interface ShogiBoardProps {
  // 既存のpropsは変更なし
}
```

**内部状態**:
```typescript
// React Hooks
const [board, setBoard] = useState<Board>(initialPosition);
const [selected, setSelected] = useState<Position | null>(null);
```

**提供する機能**:
- 駒のクリックハンドラー: `handlePieceClick(position: Position): void`
- マスのクリックハンドラー: `handleSquareClick(position: Position): void`
- 子コンポーネントへのprops伝達

**変更点**:
- ✅ 状態管理の追加 (useState)
- ✅ クリックハンドラーの実装
- ✅ Boardコンポーネントへのハンドラー伝達

---

### 2. Board (将棋盤コンポーネント)

**役割**: 9×9のグリッドレイアウトを提供し、Squareコンポーネントを配置する

**ファイル**: `src/components/Board.tsx`

**Props**:
```typescript
interface BoardProps {
  board: Board; // (Piece | null)[][]
  selected: Position | null; // 新規追加
  onSquareClick: (position: Position) => void; // 新規追加
}
```

**提供する機能**:
- 9×9のグリッドレイアウト
- 各マスに対してSquareコンポーネントをレンダリング
- 選択状態とクリックハンドラーをSquareに伝達

**変更点**:
- ✅ `selected` propの追加
- ✅ `onSquareClick` propの追加
- ✅ Squareコンポーネントへのprops伝達

**使用例**:
```typescript
<Board 
  board={board} 
  selected={selected}
  onSquareClick={handleSquareClick}
/>
```

---

### 3. Square (マス目コンポーネント)

**役割**: 将棋盤の1マスを表示し、駒を配置し、クリックイベントを処理する

**ファイル**: `src/components/Square.tsx`

**Props**:
```typescript
interface SquareProps {
  position: Position; // 既存
  piece: Piece | null; // 既存
  isSelected: boolean; // 新規追加
  onClick: () => void; // 新規追加
}
```

**提供する機能**:
- マス目の背景色表示
- 駒の配置(Pieceコンポーネントのレンダリング)
- クリックイベントのハンドリング
- 選択状態の判定とPieceコンポーネントへの伝達

**変更点**:
- ✅ `isSelected` propの追加
- ✅ `onClick` propの追加
- ✅ Pieceコンポーネントへの`isSelected`伝達

**使用例**:
```typescript
<Square
  position={{ file: 5, rank: 6 }}
  piece={piece}
  isSelected={selected?.file === 5 && selected?.rank === 6}
  onClick={() => handleSquareClick({ file: 5, rank: 6 })}
/>
```

**実装の詳細**:
```typescript
export function Square({ position, piece, isSelected, onClick }: SquareProps) {
  return (
    <div 
      className="square bg-amber-50 border border-amber-800"
      onClick={onClick}
    >
      {piece && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
}
```

---

### 4. Piece (駒コンポーネント)

**役割**: 駒を視覚的に表示し、選択状態を反映する

**ファイル**: `src/components/Piece.tsx`

**Props**:
```typescript
interface PieceProps {
  piece: Piece; // 既存
  isSelected: boolean; // 新規追加
}
```

**提供する機能**:
- 駒の種類と所有者に応じたテキスト表示
- 選択状態に応じた視覚的スタイリング

**変更点**:
- ✅ `isSelected` propの追加
- ✅ 選択状態に応じたスタイリング(背景色・枠線)

**使用例**:
```typescript
<Piece 
  piece={{ type: '歩', player: 'sente', file: 5, rank: 3 }}
  isSelected={true}
/>
```

**実装の詳細**:
```typescript
export function Piece({ piece, isSelected }: PieceProps) {
  const baseClass = "piece text-amber-900 font-bold";
  const selectedClass = isSelected 
    ? "bg-yellow-200 ring-4 ring-yellow-500" 
    : "bg-amber-100";
  
  return (
    <div className={`${baseClass} ${selectedClass}`}>
      {getPieceText(piece)}
    </div>
  );
}
```

---

## ロジック関数 Contracts

### 1. calculateValidMoves

**ファイル**: `src/logic/moveRules.ts`

**シグネチャ**:
```typescript
export function calculateValidMoves(
  piece: Piece,
  position: Position,
  board: Board
): Position[]
```

**パラメータ**:
- `piece`: 移動する駒
- `position`: 駒の現在位置
- `board`: 現在の盤面状態

**戻り値**: 移動可能なマスの配列

**目的**: 指定された駒が移動可能なすべてのマスを計算する

**テスト要件**:
- 各駒種(歩、香、桂、銀、金、飛、角、王)について移動可能なマスを正しく計算
- 盤外のマスは含まない
- 経路上に駒がある場合は正しく制限される
- 駒がいるマスは除外される

---

### 2. isValidMove

**ファイル**: `src/logic/moveRules.ts`

**シグネチャ**:
```typescript
export function isValidMove(
  from: Position,
  to: Position,
  piece: Piece,
  board: Board
): boolean
```

**パラメータ**:
- `from`: 移動元の位置
- `to`: 移動先の位置
- `piece`: 移動する駒
- `board`: 現在の盤面状態

**戻り値**: 移動可能ならtrue、不可能ならfalse

**目的**: 指定された移動が有効かどうかを判定する

**テスト要件**:
- 移動パターンに合致しない移動はfalse
- 盤外への移動はfalse
- 経路上に駒がある場合はfalse
- 移動先に駒がある場合はfalse

---

### 3. isPathClear

**ファイル**: `src/logic/moveRules.ts`

**シグネチャ**:
```typescript
export function isPathClear(
  from: Position,
  to: Position,
  board: Board
): boolean
```

**パラメータ**:
- `from`: 移動元の位置
- `to`: 移動先の位置
- `board`: 現在の盤面状態

**戻り値**: 経路がクリアならtrue、障害物があればfalse

**目的**: 移動元から移動先までの経路に障害物がないかチェックする

**注意事項**:
- 桂馬は経路チェック不要(飛び越えるため)
- 飛車、角、香のみ使用

**テスト要件**:
- 直線経路上に駒がある場合はfalse
- 直線経路がクリアならtrue
- 移動元と移動先の駒はカウントしない

---

### 4. getAdjustedVectors

**ファイル**: `src/logic/moveRules.ts`

**シグネチャ**:
```typescript
export function getAdjustedVectors(
  piece: Piece,
  pattern: MovePattern
): Vector[]
```

**パラメータ**:
- `piece`: 駒(先手/後手の情報を含む)
- `pattern`: 移動パターン

**戻り値**: 先手/後手に応じて調整された移動ベクトル配列

**目的**: 移動パターンを駒の所有者(先手/後手)に応じて調整する

**ロジック**:
- 先手: ベクトルをそのまま使用
- 後手: ベクトルを反転 (`dFile *= -1, dRank *= -1`)

**テスト要件**:
- 先手の場合、ベクトルはそのまま
- 後手の場合、ベクトルが反転される

---

### 5. updateBoardAfterMove

**ファイル**: `src/logic/boardState.ts`

**シグネチャ**:
```typescript
export function updateBoardAfterMove(
  board: Board,
  from: Position,
  to: Position
): Board
```

**パラメータ**:
- `board`: 現在の盤面状態
- `from`: 移動元の位置
- `to`: 移動先の位置

**戻り値**: 更新された新しい盤面状態(イミュータブル)

**目的**: 駒の移動後の盤面状態を計算する

**ロジック**:
1. 元の盤面をコピー
2. 移動先に駒を配置
3. 移動元を空にする

**テスト要件**:
- 元の盤面は変更されない(イミュータブル)
- 移動先に駒が配置される
- 移動元が空になる

---

## 型定義の参照

### Position

```typescript
export interface Position {
  /** 筋 (1-9の数値、1が右端、9が左端) */
  file: number;
  /** 段 (1-9の数値、1が先手側、9が後手側) */
  rank: number;
}
```

### Piece

```typescript
export type PieceType = '王' | '玉' | '飛' | '角' | '金' | '銀' | '桂' | '香' | '歩';
export type Player = 'sente' | 'gote';

export interface Piece {
  type: PieceType;
  player: Player;
  file: number;
  rank: number;
}
```

### Board

```typescript
export type Board = Piece[];
// または
export type Board = (Piece | null)[][];
```

### MovePattern

```typescript
type Vector = { dFile: number; dRank: number };

export type MovePattern = {
  vectors: Vector[];
  range: number; // 1 または Infinity
};
```

---

## データフロー図

```
[User clicks on Piece]
        ↓
[Square.onClick() triggered]
        ↓
[ShogiBoard.handleSquareClick(position)]
        ↓
[piece存在? → setSelected(position)]
        ↓
[Piece re-renders with isSelected=true]
        ↓
[User clicks on target Square]
        ↓
[Square.onClick() triggered]
        ↓
[ShogiBoard.handleSquareClick(toPosition)]
        ↓
[isValidMove(from, to, piece, board)]
        ↓
    [Valid?]
        ↓
    [YES]
        ↓
[updateBoardAfterMove(board, from, to)]
        ↓
[setBoard(newBoard)]
[setSelected(null)]
        ↓
[ShogiBoard re-renders with new state]
```

---

## イベントハンドラーの命名規約

| イベント | ハンドラー名 | 配置場所 |
|---------|------------|----------|
| マスをクリック | `onSquareClick` | Square → Board → ShogiBoard |
| 駒をクリック | `onPieceClick` | (不要 - Squareのclickで処理) |

---

## スタイリング契約

### 選択状態の視覚表示

**選択中**:
- 背景色: `bg-yellow-200`
- 枠線: `ring-4 ring-yellow-500`

**非選択**:
- 背景色: `bg-amber-100`

### マス目の基本スタイル

- 背景色: `bg-amber-50`
- 枠線: `border border-amber-800`

---

## テストの契約

### コンポーネントテスト

**ShogiBoard.test.tsx**:
- ✅ 駒をクリックして選択できる
- ✅ 選択中の駒が視覚的に識別できる
- ✅ 移動可能なマスをクリックして駒を移動できる
- ✅ 移動不可能なマスをクリックしても移動しない
- ✅ 駒がいるマスには移動できない

**Piece.test.tsx**:
- ✅ 選択状態のスタイルが適用される
- ✅ 非選択状態のスタイルが適用される

**Square.test.tsx**:
- ✅ クリックイベントがトリガーされる
- ✅ 駒がある場合、Pieceコンポーネントがレンダリングされる

### ロジック関数のユニットテスト

**moveRules.test.ts**:
- ✅ 各駒種の移動パターンが正しい
- ✅ 経路上の障害物が検出される
- ✅ 盤外への移動が拒否される
- ✅ 駒がいるマスへの移動が拒否される

**boardState.test.ts**:
- ✅ 盤面の更新がイミュータブルに行われる
- ✅ 駒が正しく移動される
- ✅ 元の位置が空になる

---

## まとめ

このコントラクトドキュメントは、駒の移動機能を実装する際のコンポーネント間のインターフェースと責務を明確にします。各コンポーネントとロジック関数は、定義されたシグネチャに従って実装されるべきです。
