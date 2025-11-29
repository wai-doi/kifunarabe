# Data Model: 持ち駒を打つ機能

**Feature**: 006-piece-drop
**Date**: 2025-11-29

## エンティティ定義

### 1. 選択状態 (Selection)

プレイヤーが現在選択している駒を表す。盤面上の駒または持ち駒のいずれかを選択可能。

```
Selection
├── type: 'board' | 'captured'  # 選択の種類
├── player: Player              # 選択した駒の所有者
└── (type別フィールド)
    ├── [type='board'] position: Position    # 盤面上の位置
    └── [type='captured'] pieceType: PieceType  # 持ち駒の駒種
```

**状態遷移**:
```
null (未選択)
    ↓ 盤面の自分の駒をクリック
BoardSelection (盤面駒選択)
    ↓ 空きマスをクリック (移動)
null

null (未選択)
    ↓ 持ち駒エリアの自分の駒をクリック
CapturedSelection (持ち駒選択)
    ↓ 空きマスをクリック (打つ)
null

BoardSelection ↔ CapturedSelection (相互切り替え可能)
```

**バリデーションルール**:
- 自分の手番の駒のみ選択可能
- 持ち駒が0個の駒種は選択不可

### 2. 持ち駒を打つ操作 (DropAction)

持ち駒を盤面に配置する操作を表す。

```
DropAction
├── pieceType: PieceType   # 打つ駒の種類
├── target: Position       # 配置先の位置
└── player: Player         # 打つプレイヤー
```

**バリデーションルール**:
- target は空きマス（駒が存在しない位置）でなければならない
- player は現在の手番プレイヤーでなければならない
- pieceType は player の持ち駒に存在しなければならない

### 3. 既存エンティティ（変更なし）

以下の既存エンティティはそのまま使用:

- **CapturedPieces**: 先手・後手の持ち駒管理
- **CapturedPiecesMap**: 駒種と数量のマップ
- **Piece**: 駒の種類・位置・所有者
- **Position**: 盤面上の座標 (file, rank)
- **Turn**: 現在の手番 ('sente' | 'gote')

## データフロー

### 持ち駒を打つフロー

```
1. ユーザーが持ち駒エリアをクリック
   └─> CapturedPieces コンポーネントが onPieceClick を発火

2. ShogiBoard が選択状態を更新
   └─> selection: { type: 'captured', player, pieceType }

3. ユーザーが盤面の空きマスをクリック
   └─> Board コンポーネントが onSquareClick を発火

4. ShogiBoard が打つ処理を実行
   ├─> canDropPiece でバリデーション
   ├─> dropPiece で盤面を更新
   ├─> removeFromCapturedPieces で持ち駒を更新
   ├─> switchTurn でターンを切り替え
   └─> selection を null に戻す
```

### 盤面駒移動との統合

```
handleSquareClick(position):
  IF selection.type === 'captured':
    IF 空きマス:
      打つ処理を実行
    ELSE:
      何もしない（打てない）
  ELSE IF selection.type === 'board':
    既存の移動処理を実行
  ELSE (selection === null):
    IF 自分の駒がある:
      選択状態にする
```

## 関係図

```
┌─────────────────┐
│   ShogiBoard    │ ← 統合コンポーネント
├─────────────────┤
│ - pieces[]      │
│ - selection     │ ← 拡張: Selection | null
│ - currentTurn   │
│ - capturedPieces│
└────────┬────────┘
         │
    ┌────┴────┬──────────────┐
    ▼         ▼              ▼
┌───────┐ ┌─────────┐ ┌────────────────┐
│ Board │ │TurnDisp.│ │CapturedPieces  │
└───┬───┘ └─────────┘ └───────┬────────┘
    │                         │
    │ onSquareClick           │ onPieceClick (新規)
    └─────────┬───────────────┘
              ▼
    ┌─────────────────┐
    │    Logic層       │
    ├─────────────────┤
    │ dropLogic.ts    │ ← 新規
    │ captureLogic.ts │ ← 拡張
    │ moveRules.ts    │
    │ boardState.ts   │
    │ turnControl.ts  │
    └─────────────────┘
```
