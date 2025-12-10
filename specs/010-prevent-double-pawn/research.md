# Research: 二歩禁止ルール

**Feature**: 010-prevent-double-pawn
**Date**: 2025-12-10
**Status**: Complete

## Overview

このドキュメントは二歩禁止ルールの実装に必要な技術的調査結果をまとめたものです。既存のコードベースの分析、将棋の二歩ルールの正確な定義、実装アプローチの評価を行いました。

## 既存コードベースの分析

### 駒打ちロジック (`src/logic/dropLogic.ts`)

**現状の実装**:
```typescript
export function canDropPiece(pieces: Piece[], position: Position): boolean {
  if (!isWithinBoard(position)) return false;
  const isOccupied = pieces.some(
    (piece) => piece.file === position.file && piece.rank === position.rank
  );
  return !isOccupied;
}
```

**Decision**: `canDropPiece`関数を拡張し、駒種と所有プレイヤーのパラメータを追加
**Rationale**: 
- 既存の関数を拡張することで、後方互換性を維持しながら段階的に機能を追加できる
- 駒種（PieceType）とプレイヤー（Player）の情報があれば、二歩判定が可能
- 既存のテストコードへの影響を最小限に抑えられる

**Alternatives considered**:
1. 新しい`canDropPawn`関数を作成 → 却下理由: 駒種ごとに関数が増える設計は保守性が低い
2. `canDropPiece`を完全に置き換え → 却下理由: 既存の呼び出し箇所全てを変更する必要がある

### 駒の型定義 (`src/types/piece.ts`)

**現状**:
- `Piece`インターフェースには`type`（駒種）、`player`（所有プレイヤー）、`promoted`（成り状態）が含まれる
- `PieceType`には全ての駒種が定義されている（'歩', '香', '桂', etc.）

**Decision**: 既存の型定義をそのまま使用
**Rationale**: 二歩判定に必要な情報（駒種、プレイヤー、成り状態、位置）は全て揃っている

## 二歩ルールの正確な定義

### 基本ルール

**Decision**: 同じ筋に同じプレイヤーの未成の歩が2つ存在してはならない
**Rationale**: 将棋の公式ルールに基づく

### 重要な例外と詳細

1. **成り駒の扱い**
   - **Decision**: 成り駒（と金など）は歩としてカウントしない
   - **Rationale**: 成った駒は元の駒種としての制約を受けない（将棋のルール）
   - **実装**: `piece.type === '歩' && !piece.promoted`で判定

2. **プレイヤーごとの独立性**
   - **Decision**: 先手と後手は別々に判定する
   - **Rationale**: 相手の歩は自分の二歩判定に影響しない
   - **実装**: `piece.player === currentPlayer`でフィルタリング

3. **筋の範囲**
   - **Decision**: 1筋から9筋まで（`file: 1-9`）
   - **Rationale**: 将棋盤の標準サイズ
   - **実装**: `position.file`の値で判定

## 実装アプローチ

### アプローチ1: 筋ごとの歩カウント（採用）

**Decision**: 各筋について、指定プレイヤーの未成の歩の数をカウントし、1以上なら二歩と判定

**実装例**:
```typescript
function hasUnpromotedPawnInFile(
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

**Rationale**:
- シンプルで理解しやすい
- 計算コストが低い（O(n)、nは盤面の駒数、最大40個程度）
- テストが容易
- 将棋のルールを直接的に表現

**Performance**: 
- 最悪ケース: 40駒 × 線形スキャン = 50ミリ秒以内で完了（成功基準SC-004を満たす）

**Alternatives considered**:

1. **筋ごとの駒リストをキャッシュ**
   - メリット: クエリが高速（O(1)）
   - デメリット: 状態管理が複雑化、メモリ使用量増加、駒移動時のキャッシュ更新が必要
   - 却下理由: 性能要件（50ms）は線形スキャンで十分満たせるため、複雑性を導入する必要がない

2. **盤面を2次元配列で管理**
   - メリット: 位置ベースのクエリが高速
   - デメリット: 既存のアーキテクチャ（駒のリスト）を大きく変更する必要がある
   - 却下理由: 既存コードとの互換性を損なう、大規模なリファクタリングが必要

### UI統合

**Decision**: エラーメッセージはモーダルまたはトースト通知で表示

**Rationale**:
- ユーザーに明確なフィードバックを提供
- 既存のReactコンポーネント構造に容易に統合可能

**実装方針**:
1. `App.tsx`に`errorMessage`状態を追加
2. 二歩検証失敗時に状態を更新
3. エラーメッセージを視覚的に表示（モーダルまたは画面上部のバナー）

**Alternatives considered**:
- インラインエラー表示（盤面の横） → 却下理由: レイアウトが複雑になる
- コンソールログのみ → 却下理由: ユーザーに見えない

### 打てる候補マスのハイライト

**Decision**: 持ち駒の歩を選択時に、全ての空きマスを評価し、二歩にならないマスのみをハイライト

**実装方針**:
```typescript
// Board.tsxで実装
const validDropSquares = useMemo(() => {
  if (selectedCapturedPiece?.type !== '歩') return allEmptySquares;
  return allEmptySquares.filter(
    (pos) => !hasUnpromotedPawnInFile(pieces, pos.file, currentPlayer)
  );
}, [selectedCapturedPiece, pieces, currentPlayer]);
```

**Rationale**:
- `useMemo`で計算結果をキャッシュし、不要な再計算を防ぐ
- 選択状態や盤面が変わった時のみ再計算
- パフォーマンスへの影響を最小化

## テスト戦略

### ユニットテスト (`doublePawnValidation.test.ts`)

**テストケース**:
1. 空の盤面で歩を打つ → 成功
2. 同じ筋に歩が既にある → 失敗
3. 異なる筋に歩が既にある → 成功
4. 同じ筋に成り駒がある → 成功（成り駒は歩扱いではない）
5. 相手プレイヤーの歩がある → 成功（相手の歩は影響しない）
6. 全ての筋（1-9）で正しく判定される

### 統合テスト (`dropLogic.test.ts`)

**テストケース**:
1. `canDropPiece`が二歩を正しく拒否する
2. エラーメッセージが生成される
3. 二歩以外の駒は通常通り打てる

### コンポーネントテスト (`Board.test.tsx`)

**テストケース**:
1. 歩を選択時、正しいマスがハイライトされる
2. 二歩になるマスはハイライトされない
3. エラーメッセージが表示される

## 依存関係の管理

### 既存フィーチャーとの統合

1. **006-piece-drop（持ち駒を打つ機能）**
   - 統合ポイント: `dropLogic.ts`の拡張
   - 影響: 既存の`canDropPiece`関数のシグネチャ変更
   - 対応: オーバーロードまたはオプショナルパラメータで後方互換性を維持

2. **007-piece-promotion（駒の成り機能）**
   - 統合ポイント: `promoted`フラグの参照
   - 影響: なし（読み取りのみ）

3. **008-move-history-navigation（履歴ナビゲーション）**
   - 統合ポイント: 履歴を戻った際の盤面状態での二歩判定
   - 影響: なし（現在の盤面状態を参照するだけ）

## 結論

二歩禁止ルールの実装は、既存の`dropLogic.ts`を拡張し、新しい`doublePawnValidation.ts`モジュールを追加することで実現できます。実装はシンプルで、性能要件を満たし、既存コードへの影響を最小限に抑えることができます。全ての技術的な不明点は解決され、Phase 1（データモデルと契約仕様の作成）に進む準備が整いました。

## 次のステップ

1. Phase 1: データモデル（`data-model.md`）の作成
2. Phase 1: 契約仕様（`contracts/`）の作成
3. Phase 1: クイックスタートガイド（`quickstart.md`）の作成
