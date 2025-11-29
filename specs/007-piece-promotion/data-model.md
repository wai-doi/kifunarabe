# Data Model: 駒の成り機能

**Feature**: 007-piece-promotion
**Date**: 2025-11-30

## エンティティ

### 1. Piece（拡張）

既存のPiece型に`promoted`フラグを追加する。

```typescript
/**
 * 駒の情報
 */
export interface Piece {
  /** 駒の種類 */
  type: PieceType;
  /** プレイヤー */
  player: Player;
  /** 筋 (1-9の数値、1が右端、9が左端) */
  file: number;
  /** 段 (1-9の数値、1が先手側、9が後手側) */
  rank: number;
  /** 成り状態 (true: 成り駒, false: 未成り) */
  promoted: boolean;  // 新規追加
}
```

**バリデーションルール**:
- `promoted`は`boolean`型で、デフォルトは`false`
- 金将（'金'）と王将/玉将（'王', '玉'）は`promoted: true`になれない
- 成り駒が取られた場合、`promoted`は`false`にリセットされる

**状態遷移**:
```
未成り (promoted: false) 
    ↓ [成り条件を満たす移動 + 「成る」選択]
成り駒 (promoted: true)
    ↓ [取られる]
持ち駒 (promoted: false) ※リセット
```

### 2. PromotionChoice（新規）

成り選択の状態を管理するための型。

```typescript
/**
 * 成り選択の状態
 */
export interface PromotionChoice {
  /** 成り選択が必要な駒 */
  piece: Piece;
  /** 移動元の位置 */
  from: Position;
  /** 移動先の位置 */
  to: Position;
}

/**
 * 成り選択状態（nullの場合は選択中でない）
 */
export type PromotionState = PromotionChoice | null;
```

**バリデーションルール**:
- `piece`は成れる駒種であること（金、王、玉以外）
- `piece.promoted`が`false`であること
- 移動元または移動先のいずれかが敵陣であること

### 3. 成り駒の表示マッピング（定数）

```typescript
/**
 * 成り駒の表示文字（一文字表示）
 */
export const PROMOTED_PIECE_DISPLAY: Readonly<Record<PromotablePieceType, string>> = {
  歩: 'と',
  香: '杏',
  桂: '圭',
  銀: '全',
  飛: '竜',
  角: '馬',
} as const;

/**
 * 成れる駒種
 */
export type PromotablePieceType = '歩' | '香' | '桂' | '銀' | '飛' | '角';

/**
 * 成れない駒種
 */
export type NonPromotablePieceType = '金' | '王' | '玉';
```

### 4. 敵陣の定義（定数/関数）

```typescript
/**
 * 敵陣の段の範囲
 */
export const ENEMY_TERRITORY = {
  sente: { min: 7, max: 9 },  // 先手の敵陣: 7〜9段目
  gote: { min: 1, max: 3 },   // 後手の敵陣: 1〜3段目
} as const;
```

## リレーションシップ

```
Piece (1) -----> (1) PromotionChoice
  |                      |
  |  promoted: boolean   |  piece, from, to
  |                      |
  v                      v
MovePattern <-------- Position
  |
  | PROMOTED_MOVE_PATTERNS[type]
  v
ValidMoves
```

## 状態管理への影響

### ShogiBoard コンポーネント

既存の状態に`promotionState`を追加:

```typescript
// 既存の状態
const [board, setBoard] = useState<Piece[]>(initialPosition);
const [selectedPiece, setSelectedPiece] = useState<Selection | null>(null);
const [currentTurn, setCurrentTurn] = useState<Player>('sente');
const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ sente: [], gote: [] });

// 新規追加
const [promotionState, setPromotionState] = useState<PromotionState>(null);
```

**状態フロー**:
1. 駒を移動
2. 成り条件をチェック
3. 条件を満たす場合、`promotionState`を設定
4. PromotionDialogを表示
5. ユーザーが選択
6. 駒を更新（成る場合は`promoted: true`）
7. `promotionState`をnullにリセット
8. 手番を切り替え

## 既存データの移行

既存の`initialPosition`データに`promoted: false`を追加する必要がある。

**Before**:
```typescript
{ type: '歩', player: 'sente', file: 1, rank: 3 }
```

**After**:
```typescript
{ type: '歩', player: 'sente', file: 1, rank: 3, promoted: false }
```

全ての初期配置の駒は`promoted: false`で開始する。
