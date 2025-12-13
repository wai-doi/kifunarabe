# Data Model: 駒クリック時の選択ハイライト表示

**Feature**: 013-piece-click-highlight
**Date**: 2025年12月14日

## 概要

この機能は既存のデータモデルに大きな変更を加えません。既存の選択状態（Selection）、駒情報（Piece）、手番情報（Turn）を活用し、選択可否の判定ロジックを追加するのみです。

## エンティティとその関係

### 既存エンティティ（変更なし）

#### Piece（駒）

駒の基本情報を表します。

```typescript
interface Piece {
  /** 駒の種類 */
  type: PieceType;
  /** プレイヤー（先手/後手） */
  player: Player;
  /** 筋（1-9、右から左） */
  file: number;
  /** 段（1-9、手前から奥） */
  rank: number;
  /** 成り状態 */
  promoted: boolean;
}
```

**この機能での使用**:
- `player` フィールドを使用して、駒の所有者を判定
- 現在の手番と比較して選択可否を決定

#### Player（プレイヤー）

駒の所有者を表す型です。

```typescript
type Player = 'sente' | 'gote';
```

**この機能での使用**:
- `Piece.player` の型
- `Turn` 型との比較に使用

#### Turn（手番）

現在の手番を表します。

```typescript
type Turn = 'sente' | 'gote';
```

**この機能での使用**:
- 選択可否判定の基準
- `Player` 型と一致する駒のみ選択可能

#### Position（位置）

盤面上の座標を表します。

```typescript
interface Position {
  /** 筋（1-9） */
  file: number;
  /** 段（1-9） */
  rank: number;
}
```

#### Selection（選択状態）

現在選択中の駒または持ち駒を表します。

```typescript
type Selection = BoardSelection | CapturedSelection;

interface BoardSelection {
  type: 'board';
  position: Position;
}

interface CapturedSelection {
  type: 'captured';
  player: Player;
  pieceType: PieceType;
}
```

**この機能での使用**:
- 選択状態の管理に使用
- `BoardSelection` の場合、対応する `Piece` を取得して選択可否を判定

### 新規エンティティ

この機能では新しいエンティティは導入しません。

## 状態遷移

### 選択状態の遷移

```
[未選択] (selection = null)
    │
    ├─ クリック: 空マス → [未選択] (何も起こらない)
    ├─ クリック: 相手の駒 → [未選択] (何も起こらない)
    └─ クリック: 自分の駒 → [選択中] (selection = BoardSelection)
         │
         ├─ クリック: 同じ駒 → [未選択] (選択解除)
         ├─ クリック: 別の自分の駒 → [選択中] (選択切り替え)
         ├─ クリック: 空マス（移動可能） → [未選択] + 駒移動実行
         ├─ クリック: 相手の駒（移動可能） → [未選択] + 駒移動実行
         └─ 手番切り替え → [未選択] (自動リセット)
```

## バリデーションルール

### 選択可否の判定

**ルール**: 駒が選択可能かどうかは、以下の条件を全て満たす必要があります：

1. **駒が存在する**: クリックした位置に駒がある（空マスでない）
2. **手番一致**: 駒の所有者（`piece.player`）が現在の手番（`currentTurn`）と一致する

**実装**:

```typescript
function canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean {
  if (piece === null) {
    return false; // 条件1: 駒が存在しない
  }
  return piece.player === currentTurn; // 条件2: 手番一致
}
```

### 選択状態の自動リセット

**ルール**: 以下の場合、選択状態は自動的にリセット（null）されます：

1. 駒の移動が完了したとき
2. 手番が切り替わったとき

## データフロー

### 駒クリック時のデータフロー

```
1. ユーザーがマス目をクリック
   ↓
2. handleSquareClick(position) が呼ばれる
   ↓
3. position から Piece を取得（pieces 配列を検索）
   ↓
4. canSelectPiece(piece, currentTurn) で選択可否を判定
   ↓
   ├─ false → 何もしない（選択状態を更新しない）
   └─ true → selection を BoardSelection に更新
              ↓
              5. Square コンポーネントが再レンダリング
                 ↓
              6. isSelected = true のマス目に選択枠（オレンジ）を表示
```

### 手番切り替え時のデータフロー

```
1. 駒移動完了
   ↓
2. updateBoardAfterMove() で盤面を更新
   ↓
3. switchTurn(currentTurn) で手番を切り替え
   ↓
4. setCurrentTurn(newTurn) でステート更新
   ↓
5. setSelection(null) で選択状態をリセット
   ↓
6. すべての Square コンポーネントから選択枠が消える
```

## 既存データモデルへの影響

### 変更なし

以下のデータ構造は変更されません：

- `Piece` インターフェース
- `Player` 型
- `Turn` 型
- `Position` インターフェース
- `Selection` 型とそのサブタイプ

### 新規追加関数

`src/logic/selectionLogic.ts` に以下の関数を追加：

```typescript
/**
 * 駒が現在の手番で選択可能かを判定
 */
export function canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean;
```

## パフォーマンス考慮事項

- **選択可否判定**: O(1) の単純な等価チェック
- **駒の検索**: O(n) だが n は最大40（盤上の駒の最大数）で実用上問題なし
- **再レンダリング**: 選択状態が変わったマス目のみ再レンダリング（Reactの最適化により）

## テストデータ

### テストケース1: 先手の手番で先手の駒をクリック

```typescript
const piece: Piece = {
  type: '歩',
  player: 'sente',
  file: 5,
  rank: 7,
  promoted: false,
};
const currentTurn: Turn = 'sente';
const result = canSelectPiece(piece, currentTurn);
// 期待: true
```

### テストケース2: 先手の手番で後手の駒をクリック

```typescript
const piece: Piece = {
  type: '歩',
  player: 'gote',
  file: 5,
  rank: 3,
  promoted: false,
};
const currentTurn: Turn = 'sente';
const result = canSelectPiece(piece, currentTurn);
// 期待: false
```

### テストケース3: 空マスをクリック

```typescript
const piece: Piece | null = null;
const currentTurn: Turn = 'sente';
const result = canSelectPiece(piece, currentTurn);
// 期待: false
```

## まとめ

この機能は既存のデータモデルを活用し、最小限の変更で実装できます。新しいエンティティや複雑な状態管理は不要で、シンプルな条件判定とスタイル適用のみで目標を達成できます。
