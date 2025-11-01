# Data Model: 駒の移動機能

**Feature**: 003-piece-movement
**Date**: 2025-11-02
**Status**: Phase 1 Design

## 概要

このドキュメントでは、駒の移動機能で使用するデータ構造と状態管理の設計を定義する。主要なエンティティは、選択状態、盤面状態、移動ルールパターン、および移動可能マスの集合である。

## エンティティ定義

### 1. Position (座標)

**説明**: 将棋盤上のマスの位置を表す

**フィールド**:
- `file`: 筋 (1-9, 1が右端、9が左端)
- `rank`: 段 (1-9, 1が先手側、9が後手側)

**型定義** (`src/types/position.ts`):
```typescript
export interface Position {
  /** 筋 (1-9の数値、1が右端、9が左端) */
  file: number;
  /** 段 (1-9の数値、1が先手側、9が後手側) */
  rank: number;
}
```

**バリデーション**:
- `file`と`rank`は1以上9以下の整数
- 盤外の座標は無効

**使用例**:
```typescript
const position: Position = { file: 5, rank: 6 }; // 五6 (先手の歩の初期位置付近)
```

---

### 2. Piece (駒)

**説明**: 将棋の駒を表す

**フィールド**:
- `type`: 駒の種類 ('歩' | '香' | '桂' | '銀' | '金' | '飛' | '角' | '王')
- `player`: 駒の所有者 ('先手' | '後手')
- `isPromoted`: 成っているかどうか (現フェーズでは常にfalse)

**型定義** (`src/types/piece.ts`):
```typescript
export type PieceType = '歩' | '香' | '桂' | '銀' | '金' | '飛' | '角' | '王';
export type Player = '先手' | '後手';

export type Piece = {
  type: PieceType;
  player: Player;
  isPromoted: boolean; // 現フェーズでは常にfalse
};
```

**バリデーション**:
- `type`は定義された8種類のいずれか
- `player`は'先手'または'後手'
- `isPromoted`は現フェーズでは常にfalse

**使用例**:
```typescript
const piece: Piece = {
  type: '歩',
  player: '先手',
  isPromoted: false
};
```

---

### 3. Board (盤面)

**説明**: 将棋盤の状態を表す9×9の2次元配列、またはPieceの配列

**型定義** (`src/types/board.ts`):
```typescript
export type Board = (Piece | null)[][];
// または
export type Board = Piece[];
```

**注意**: 既存の実装では、各Pieceが`file`と`rank`を持っているため、Pieceの配列として管理することも可能です。

**構造オプション1: 2次元配列**:
- 配列のインデックス: `board[rank-1][file-1]`
- `rank`: 1-9の段を表す
- `file`: 1-9の筋を表す
- 空のマスは`null`

**構造オプション2: Piece配列** (既存実装):
- 各Pieceが位置情報(`file`, `rank`)を持つ
- 空マスは配列に含まれない
- 既存の`INITIAL_POSITION`と互換性あり

**使用例**:
```typescript
// オプション1: 2次元配列
const board: (Piece | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
board[5][4] = { type: '歩', player: 'sente', file: 5, rank: 6 }; // 五6の歩

// オプション2: Piece配列 (既存実装)
const board: Piece[] = INITIAL_POSITION;
```

---

### 4. SelectedState (選択状態)

**説明**: 現在選択されている駒の状態を表す

**フィールド**:
- `position`: 選択中の駒の位置 (Position | null)
- `null`の場合は何も選択されていない

**型定義** (`src/logic/boardState.ts`):
```typescript
export type SelectedState = Position | null;
```

**状態遷移**:
1. 初期状態: `null` (何も選択されていない)
2. 駒をクリック → その駒の`Position`
3. 空マスをクリック → `null`
4. 別の駒をクリック → 新しい駒の`Position`
5. 移動完了 → `null`

**使用例**:
```typescript
const [selected, setSelected] = useState<SelectedState>(null);

// 駒を選択 (5七の地点)
setSelected({ file: 5, rank: 7 });

// 選択解除
setSelected(null);
```

---

### 5. MovePattern (移動パターン)

**説明**: 各駒種の移動可能な方向とレンジを定義

**フィールド**:
- `vectors`: 移動可能な方向のベクトル配列 `{ dFile: number, dRank: number }[]`
- `range`: 移動可能な距離 (1 または Infinity)

**型定義** (`src/logic/moveRules.ts`):
```typescript
type Vector = { dFile: number; dRank: number };

export type MovePattern = {
  vectors: Vector[];
  range: number; // 1 または Infinity
};
```

**駒種別の移動パターン** (先手の場合):

| 駒種 | vectors | range | 備考 |
|------|---------|-------|------|
| 歩 | `[{dFile: 0, dRank: 1}]` | 1 | 前方1マス |
| 香 | `[{dFile: 0, dRank: 1}]` | Infinity | 前方直進 |
| 桂 | `[{dFile: -1, dRank: 2}, {dFile: 1, dRank: 2}]` | 1 | 前方2マス+左右1マス |
| 銀 | `[{dFile: -1, dRank: 1}, {dFile: 0, dRank: 1}, {dFile: 1, dRank: 1}, {dFile: -1, dRank: -1}, {dFile: 1, dRank: -1}]` | 1 | 前方3方向+後方斜め2方向 |
| 金 | `[{dFile: -1, dRank: 1}, {dFile: 0, dRank: 1}, {dFile: 1, dRank: 1}, {dFile: -1, dRank: 0}, {dFile: 1, dRank: 0}, {dFile: 0, dRank: -1}]` | 1 | 前方3方向+横2方向+真後ろ |
| 飛 | `[{dFile: 0, dRank: 1}, {dFile: 0, dRank: -1}, {dFile: 1, dRank: 0}, {dFile: -1, dRank: 0}]` | Infinity | 縦横直進 |
| 角 | `[{dFile: 1, dRank: 1}, {dFile: 1, dRank: -1}, {dFile: -1, dRank: 1}, {dFile: -1, dRank: -1}]` | Infinity | 斜め4方向直進 |
| 王 | `[{dFile: -1, dRank: 1}, {dFile: 0, dRank: 1}, {dFile: 1, dRank: 1}, {dFile: -1, dRank: 0}, {dFile: 1, dRank: 0}, {dFile: -1, dRank: -1}, {dFile: 0, dRank: -1}, {dFile: 1, dRank: -1}]` | 1 | 全方向1マス |

**注意事項**:
- 先手の座標系で定義(後手の場合は符号を反転させる)
- `dRank`が正 = 前方(段が大きくなる方向)、負 = 後方
- `dFile`が正 = 左(筋が大きくなる方向)、負 = 右
- 将棋の盤面では、rank 1が先手側、rank 9が後手側

**使用例**:
```typescript
const MOVE_PATTERNS: Record<PieceType, MovePattern> = {
  歩: { vectors: [{dFile: 0, dRank: 1}], range: 1 },
  香: { vectors: [{dFile: 0, dRank: 1}], range: Infinity },
  // ... 他の駒種
};
```

---

### 6. ValidMoves (移動可能マスの集合)

**説明**: 選択された駒が移動できるマスの集合

**型定義**:
```typescript
export type ValidMoves = Position[];
```

**計算ロジック**:
1. 選択された駒の`MovePattern`を取得
2. 各`vector`について、`range`の範囲内でマスをチェック
3. 盤外のマスを除外
4. 経路上に他の駒があるか確認(長距離移動駒のみ)
5. 移動先に駒がある場合は除外(現フェーズでは取り合いなし)

**使用例**:
```typescript
const validMoves: ValidMoves = calculateValidMoves(
  selectedPiece,
  selectedPosition,
  board
);

// validMoves = [{ file: 5, rank: 6 }, { file: 5, rank: 5 }, ...]
// 例: 5七の駒が5六、5五に移動可能な場合
```

---

## 状態管理設計

### React Hooksによる状態管理

**使用するHooks**:
- `useState<Board>`: 盤面状態
- `useState<SelectedState>`: 選択状態

**状態管理の場所**:
- `ShogiBoard`コンポーネント内で管理
- 親コンポーネント(App)には状態を持たせない

**状態の初期化**:
```typescript
const [board, setBoard] = useState<Board>(initialPosition);
const [selected, setSelected] = useState<SelectedState>(null);
```

### 状態更新パターン

#### 1. 駒の選択

```typescript
function handlePieceClick(position: Position) {
  const piece = board.find(p => p.file === position.file && p.rank === position.rank);
  
  if (piece) {
    // 駒が存在する場合、選択
    setSelected(position);
  }
}
```

#### 2. 駒の移動

```typescript
function handleSquareClick(toPosition: Position) {
  if (!selected) return; // 何も選択されていない
  
  const fromPosition = selected;
  const piece = board.find(p => p.file === fromPosition.file && p.rank === fromPosition.rank);
  
  if (!piece) return; // 選択位置に駒がない(異常)
  
  // 移動可能かチェック
  if (!isValidMove(fromPosition, toPosition, piece, board)) {
    return; // 移動不可
  }
  
  // イミュータブルに盤面を更新
  const newBoard = board
    .filter(p => !(p.file === fromPosition.file && p.rank === fromPosition.rank)) // 元の位置から削除
    .concat([{ ...piece, file: toPosition.file, rank: toPosition.rank }]); // 新しい位置に追加
  
  setBoard(newBoard);
  setSelected(null); // 選択解除
}
```

#### 3. 選択解除

```typescript
function handleEmptySquareClick() {
  setSelected(null);
}
```

---

## ロジック関数の設計

### `calculateValidMoves(piece, position, board): Position[]`

**目的**: 指定された駒の移動可能なマスを計算

**パラメータ**:
- `piece`: Piece - 移動する駒
- `position`: Position - 駒の現在位置
- `board`: Board - 現在の盤面状態

**戻り値**: `Position[]` - 移動可能なマスの配列

**処理フロー**:
1. 駒種から`MovePattern`を取得
2. 先手/後手に応じてベクトルを調整
3. 各ベクトルについて移動先を計算
4. 盤外チェック
5. 経路上の障害物チェック(長距離移動駒)
6. 移動先の駒の有無チェック

---

### `isValidMove(from, to, piece, board): boolean`

**目的**: 指定された移動が有効かどうかを判定

**パラメータ**:
- `from`: Position - 移動元
- `to`: Position - 移動先
- `piece`: Piece - 移動する駒
- `board`: Board - 現在の盤面状態

**戻り値**: `boolean` - 移動可能ならtrue

**処理フロー**:
1. 移動先が盤内かチェック
2. 移動パターンに合致するかチェック
3. 経路上に障害物がないかチェック
4. 移動先に駒がないかチェック

---

### `isPathClear(from, to, board): boolean`

**目的**: 移動元から移動先までの経路に障害物がないかチェック

**パラメータ**:
- `from`: Position - 移動元
- `to`: Position - 移動先
- `board`: Board - 現在の盤面状態

**戻り値**: `boolean` - 経路がクリアならtrue

**注意**: 桂馬は経路チェック不要(飛び越える)

---

## データフロー図

```
[User Click on Piece]
        ↓
[handlePieceClick(position)]
        ↓
[setSelected(position)] ← 選択状態更新
        ↓
[Piece Component Re-render] ← 選択状態の視覚表示
        ↓
[User Click on Square]
        ↓
[handleSquareClick(toPosition)]
        ↓
[isValidMove(from, to, piece, board)] ← 移動可能性チェック
        ↓
    YES / NO
        ↓
   [YES: 移動実行]
        ↓
[setBoard(newBoard)] ← 盤面状態更新
[setSelected(null)] ← 選択解除
        ↓
[ShogiBoard Re-render] ← 新しい盤面表示
```

---

## バリデーションルール

### 1. 座標のバリデーション

```typescript
function isValidPosition(pos: Position): boolean {
  return pos.file >= 1 && pos.file <= 9 && pos.rank >= 1 && pos.rank <= 9;
}
```

### 2. 移動先の駒チェック

```typescript
function isOccupied(pos: Position, board: Piece[]): boolean {
  return board.some(p => p.file === pos.file && p.rank === pos.rank);
}
```

### 3. 移動パターンの検証

```typescript
function isInMovePattern(from: Position, to: Position, pattern: MovePattern, player: Player): boolean {
  const direction = player === 'sente' ? 1 : -1;
  const dFile = to.file - from.file;
  const dRank = (to.rank - from.rank) * direction;
  
  return pattern.vectors.some(v => 
    v.dFile === dFile && v.dRank === dRank ||
    (pattern.range === Infinity && 
     Math.sign(v.dFile) === Math.sign(dFile) && 
     Math.sign(v.dRank) === Math.sign(dRank))
  );
}
```

---

## 拡張性の考慮

### 将来の機能追加への対応

**駒の成り**:
- `Piece.isPromoted`を使用
- 成った駒用の`MovePattern`を追加

**駒の取り合い**:
- `isValidMove`で移動先の駒の所有者をチェック
- 相手の駒なら取る、自分の駒なら移動不可

**持ち駒**:
- 新しい状態: `capturedPieces: { 先手: Piece[], 後手: Piece[] }`
- 取った駒を`capturedPieces`に追加

**ターン制御**:
- 新しい状態: `currentPlayer: Player`
- 移動後に`currentPlayer`を切り替え

---

## まとめ

このデータモデルは、駒の移動機能を実装するために必要な全てのデータ構造と状態管理パターンを定義している。React Hooksによるシンプルな状態管理を採用し、将来の機能拡張にも対応できる設計となっている。
