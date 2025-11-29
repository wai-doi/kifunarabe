# Quickstart: 駒の成り機能

**Feature**: 007-piece-promotion
**Date**: 2025-11-30

## 概要

この機能は、将棋の駒が敵陣で成る（裏返る）ことを可能にします。

## 前提条件

- Node.js 18以上
- npm または yarn
- 既存のkifunarabeプロジェクトがセットアップ済み

## セットアップ

```bash
# リポジトリのルートで
cd /Users/yusuke.doi/src/github.com/wai-doi/kifunarabe

# 依存関係のインストール（必要な場合）
npm install

# 開発サーバーの起動
npm run dev
```

## 実装ステップ

### Step 1: 型の拡張

`src/types/piece.ts` に `promoted` フラグを追加:

```typescript
export interface Piece {
  type: PieceType;
  player: Player;
  file: number;
  rank: number;
  promoted: boolean;  // 追加
}
```

### Step 2: 成り判定ロジックの追加

`src/logic/promotionLogic.ts` を新規作成:

```typescript
// 敵陣判定
export function isInEnemyTerritory(rank: number, player: Player): boolean;

// 成り条件判定
export function canPromoteMove(piece: Piece, from: Position, to: Position): boolean;

// 強制成り判定
export function mustPromote(piece: Piece, toRank: number): boolean;

// 成れる駒種判定
export function isPromotablePieceType(type: PieceType): boolean;
```

### Step 3: 成り駒の移動パターン追加

`src/logic/moveRules.ts` を拡張:

```typescript
// 成り駒の移動パターンを追加
export const PROMOTED_MOVE_PATTERNS: Record<PromotablePieceType, MovePattern>;

// calculateValidMoves を修正して promoted フラグを考慮
```

### Step 4: 成り選択UIの作成

`src/components/PromotionDialog.tsx` を新規作成:

```typescript
interface PromotionDialogProps {
  position: Position;
  onPromote: () => void;
  onDecline: () => void;
}
```

### Step 5: ShogiBoard への統合

`src/components/ShogiBoard.tsx` を修正:

1. `promotionState` ステートを追加
2. 移動処理に成り判定を追加
3. PromotionDialog を条件付きレンダリング

## テスト実行

```bash
# 全テストの実行
npm test

# 特定のテストファイルのみ
npm test -- tests/logic/promotionLogic.test.ts

# UIを使用したテスト実行
npm run test:ui
```

## 動作確認

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで http://localhost:5173 を開く
3. 駒を敵陣に移動させる
4. 「成る/成らない」の選択肢が表示されることを確認
5. 「成る」を選択して駒が成り駒（と、杏、圭、全、竜、馬）に変化することを確認

## ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/types/piece.ts` | `promoted` フラグ追加 |
| `src/logic/promotionLogic.ts` | 新規作成 |
| `src/logic/moveRules.ts` | 成り駒パターン追加 |
| `src/components/PromotionDialog.tsx` | 新規作成 |
| `src/components/Piece.tsx` | 成り駒表示対応 |
| `src/components/ShogiBoard.tsx` | 成り選択フロー統合 |
| `src/data/initialPosition.ts` | `promoted: false` 追加 |
| `tests/logic/promotionLogic.test.ts` | 新規作成 |
| `tests/components/PromotionDialog.test.tsx` | 新規作成 |

## トラブルシューティング

### 成り選択が表示されない

- 移動元または移動先が敵陣かどうか確認
- 駒が成れる種類（歩、香、桂、銀、飛、角）か確認
- 既に成っている駒（promoted: true）でないか確認

### 成り駒の動きがおかしい

- PROMOTED_MOVE_PATTERNS が正しく定義されているか確認
- calculateValidMoves で promoted フラグを正しく参照しているか確認

### TypeScript エラー

- Piece型のすべての使用箇所で promoted フラグを追加したか確認
- 初期配置データに promoted: false を追加したか確認
