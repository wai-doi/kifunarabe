# Data Model: 将棋盤と駒の初期配置表示

**Date**: 2025-11-01
**Feature**: 002-shogi-board-display

## エンティティ概要

この機能では、将棋盤、マス目、駒の3つの主要なエンティティを扱います。これらは静的な表示のみを目的としており、状態変更や永続化は含まれません。

## エンティティ定義

### 1. 駒 (Piece)

将棋の駒を表現するエンティティ。

#### 型定義

```typescript
/**
 * 駒の種類
 */
export type PieceType =
  | '王' // 先手の王将
  | '玉' // 後手の玉将
  | '飛' // 飛車
  | '角' // 角行
  | '金' // 金将
  | '銀' // 銀将
  | '桂' // 桂馬
  | '香' // 香車
  | '歩'; // 歩兵

/**
 * 駒の所属(先手・後手)
 */
export type Player = 'sente' | 'gote'; // 先手・後手

/**
 * 駒エンティティ
 */
export interface Piece {
  /** 駒の種類(表示用の日本語文字) */
  type: PieceType;

  /** 駒の所属(先手・後手) */
  player: Player;

  /** 駒の位置(筋: 1-9) */
  file: number;

  /** 駒の位置(段: 1-9) */
  rank: number;
}
```

#### フィールド説明

- **type**: 駒の種類を表す日本語1文字。表示にそのまま使用される。
- **player**: 駒の所属。`'sente'`(先手)の駒は上向き、`'gote'`(後手)の駒は下向きに表示される。
- **file**: 駒の位置(筋)。1-9の範囲。右から左へ1, 2, 3...9。
- **rank**: 駒の位置(段)。1-9の範囲。上から下へ1, 2, 3...9。

#### バリデーションルール

- `file`と`rank`は1-9の範囲内でなければならない
- 同じ`file`と`rank`の組み合わせを持つ駒は1つまで(重複不可)
- `type`が`'王'`の場合、`player`は`'sente'`でなければならない
- `type`が`'玉'`の場合、`player`は`'gote'`でなければならない

#### 例

```typescript
// 先手の王将(5九)
const senteKing: Piece = {
  type: '王',
  player: 'sente',
  file: 5,
  rank: 9
};

// 後手の玉将(5一)
const goteKing: Piece = {
  type: '玉',
  player: 'gote',
  file: 5,
  rank: 1
};
```

---

### 2. 位置 (Position)

将棋盤上の座標を表現する型。

#### 型定義

```typescript
/**
 * 将棋盤上の位置(座標)
 */
export interface Position {
  /** 筋(1-9): 右から左へ */
  file: number;

  /** 段(1-9): 上から下へ */
  rank: number;
}
```

#### フィールド説明

- **file**: 筋(列)を表す数値。1(最右)から9(最左)。
- **rank**: 段(行)を表す数値。1(最上)から9(最下)。

#### バリデーションルール

- `file`は1-9の範囲内でなければならない
- `rank`は1-9の範囲内でなければならない

---

### 3. マス目 (Square)

将棋盤上の個別のマス目を表現するコンポーネントのprops。

#### 型定義

```typescript
/**
 * マス目のprops
 */
export interface SquareProps {
  /** マス目の位置 */
  position: Position;

  /** このマス目に配置されている駒(なければundefined) */
  piece?: Piece;
}
```

#### フィールド説明

- **position**: マス目の座標
- **piece**: このマス目に配置されている駒。空のマス目の場合は`undefined`。

---

### 4. 将棋盤 (Board)

将棋盤全体を表現するエンティティ。

#### 型定義

```typescript
/**
 * 将棋盤の状態
 */
export interface BoardState {
  /** 将棋盤上の全ての駒 */
  pieces: Piece[];
}
```

#### フィールド説明

- **pieces**: 将棋盤上に配置されている全ての駒の配列。初期配置では40枚。

#### バリデーションルール

- `pieces`配列内で、同じ位置(`file`, `rank`)を持つ駒は1つまで
- 初期配置では正確に40枚の駒が必要

---

## 初期配置データ

将棋の標準的な初期配置を定義します。

### データ構造

```typescript
/**
 * 将棋の初期配置
 */
export const INITIAL_POSITION: Piece[] = [
  // 後手(gote)の駒 - 上段(rank 1-3)
  { type: '香', player: 'gote', file: 1, rank: 1 },
  { type: '桂', player: 'gote', file: 2, rank: 1 },
  { type: '銀', player: 'gote', file: 3, rank: 1 },
  { type: '金', player: 'gote', file: 4, rank: 1 },
  { type: '玉', player: 'gote', file: 5, rank: 1 },
  { type: '金', player: 'gote', file: 6, rank: 1 },
  { type: '銀', player: 'gote', file: 7, rank: 1 },
  { type: '桂', player: 'gote', file: 8, rank: 1 },
  { type: '香', player: 'gote', file: 9, rank: 1 },
  { type: '飛', player: 'gote', file: 2, rank: 2 },
  { type: '角', player: 'gote', file: 8, rank: 2 },
  { type: '歩', player: 'gote', file: 1, rank: 3 },
  { type: '歩', player: 'gote', file: 2, rank: 3 },
  { type: '歩', player: 'gote', file: 3, rank: 3 },
  { type: '歩', player: 'gote', file: 4, rank: 3 },
  { type: '歩', player: 'gote', file: 5, rank: 3 },
  { type: '歩', player: 'gote', file: 6, rank: 3 },
  { type: '歩', player: 'gote', file: 7, rank: 3 },
  { type: '歩', player: 'gote', file: 8, rank: 3 },
  { type: '歩', player: 'gote', file: 9, rank: 3 },

  // 先手(sente)の駒 - 下段(rank 7-9)
  { type: '歩', player: 'sente', file: 1, rank: 7 },
  { type: '歩', player: 'sente', file: 2, rank: 7 },
  { type: '歩', player: 'sente', file: 3, rank: 7 },
  { type: '歩', player: 'sente', file: 4, rank: 7 },
  { type: '歩', player: 'sente', file: 5, rank: 7 },
  { type: '歩', player: 'sente', file: 6, rank: 7 },
  { type: '歩', player: 'sente', file: 7, rank: 7 },
  { type: '歩', player: 'sente', file: 8, rank: 7 },
  { type: '歩', player: 'sente', file: 9, rank: 7 },
  { type: '角', player: 'sente', file: 2, rank: 8 },
  { type: '飛', player: 'sente', file: 8, rank: 8 },
  { type: '香', player: 'sente', file: 1, rank: 9 },
  { type: '桂', player: 'sente', file: 2, rank: 9 },
  { type: '銀', player: 'sente', file: 3, rank: 9 },
  { type: '金', player: 'sente', file: 4, rank: 9 },
  { type: '王', player: 'sente', file: 5, rank: 9 },
  { type: '金', player: 'sente', file: 6, rank: 9 },
  { type: '銀', player: 'sente', file: 7, rank: 9 },
  { type: '桂', player: 'sente', file: 8, rank: 9 },
  { type: '香', player: 'sente', file: 9, rank: 9 },
];
```

### 配置の特徴

- 合計40枚の駒
- 後手の駒: 20枚(rank 1-3に配置)
- 先手の駒: 20枚(rank 7-9に配置)
- 重複する位置なし
- 日本将棋連盟の標準ルールに準拠

---

## 関係性

```
BoardState (1)
    |
    | has many
    v
Piece (0..40)
    |
    | has
    v
Position (embedded)
```

- `BoardState`は複数の`Piece`を持つ
- 各`Piece`は1つの`Position`(file, rank)を持つ
- `Square`コンポーネントは1つの`Position`と0または1つの`Piece`を受け取る

---

## 状態管理

この機能では状態変更がないため、状態管理ライブラリは不要です。

- **データフロー**: `INITIAL_POSITION` → `ShogiBoard` → `Board` → `Square` → `Piece`
- **propsによる一方向のデータ渡し**のみ
- **不変データ**: すべてのデータは読み取り専用

---

## 将来の拡張性

将来のフェーズで以下の拡張が予想されます(このフェーズでは実装しない):

1. **駒の移動**: `Piece`の`file`, `rank`を変更する状態管理
2. **成り駒**: `type`に`'と'`, `'成銀'`などを追加
3. **持ち駒**: `Piece`に`captured: boolean`フィールドを追加
4. **棋譜**: 手の履歴を記録する`Move`エンティティ
5. **対局状態**: `BoardState`に`currentPlayer`, `moveHistory`を追加

これらの拡張に備え、データ構造はシンプルで拡張可能な設計としています。
