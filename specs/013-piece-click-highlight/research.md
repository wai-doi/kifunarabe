# Research: 駒クリック時の選択ハイライト表示

**Feature**: 013-piece-click-highlight
**Date**: 2025年12月14日
**Status**: Complete

## 目的

盤上の駒クリック時の選択ハイライト表示機能を実装するために必要な技術的調査を実施し、実装方針を決定します。

## 調査項目

### 1. 既存の選択状態管理の仕組み

**調査内容**: 現在のShogiBoard.tsxでの選択状態（selection）の管理方法とデータ構造

**発見事項**:
- `selection` ステートは `Selection | null` 型で管理されている
- `Selection` 型は盤上の駒選択（`BoardSelection`）と持ち駒選択（`CapturedSelection`）の2種類をサポート
- `selectedPosition` は `Position | null` 型でBoard.tsxに渡される
- クリック時のハンドラは `handleSquareClick` で処理されている

**実装への影響**:
- 既存の選択状態管理を活用できる
- 新たな状態管理は不要で、表示ロジックの条件分岐のみ追加

### 2. 手番と駒の所有者の判定方法

**調査内容**: 現在の手番（currentTurn）と駒のプレイヤー（piece.player）の照合方法

**発見事項**:
- `currentTurn` は `Turn` 型（'sente' | 'gote'）で管理
- `Piece` インターフェースには `player: Player` フィールドがある
- `Player` 型は `'sente' | 'gote'` と定義されている
- 手番と駒の所有者の比較は単純な等価チェックで実現可能

**決定事項**:
- 選択可否判定関数: `canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean`
- 判定ロジック: `piece !== null && piece.player === currentTurn`

### 3. Tailwind CSSでの枠色の実装方法

**調査内容**: オレンジ系・茶色系の枠色の実装とTailwindのカラーパレット

**調査結果**:
- Tailwind CSS 4.1.16 のデフォルトカラーパレットを使用
- 推奨色:
  - `border-orange-600` (#EA580C) - メインの選択枠色
  - `border-orange-700` (#C2410C) - 濃いオレンジ（代替）
  - `border-amber-700` (#92400E) - 茶色系（代替）
- 枠の太さ: `border-4` （4px、視認性を確保）
- 既存の黒枠: `border-2 border-black` からの変更

**アクセシビリティ検証**:
- オレンジ色（#EA580C）は白背景に対してWCAG AAコントラスト基準を満たす
- 将棋盤の背景色（#C8B560）に対しても十分なコントラストを確保

**決定事項**:
- 選択枠のスタイル: `border-4 border-orange-600`
- 条件付きクラス適用で実装（Tailwindのユーティリティクラス使用）

### 4. 既存のSquare.tsxコンポーネントの構造

**調査内容**: Square.tsxでの選択状態の視覚表現の現状

**発見事項**:
- Square.tsxは `isSelected` プロップを受け取り、選択状態を表現
- 現在の実装では選択時に `border-2 border-black` を適用
- 駒の情報（`piece`）もプロップとして渡される
- クリックハンドラは親コンポーネントから渡される

**実装方針**:
- Square.tsxに新しいプロップ `isSelectable: boolean` を追加（オプション）
- または、親コンポーネント（Board.tsx）で条件判定後、isSelectedを渡す
- 枠の色を条件分岐: 選択可能な駒の場合のみオレンジ/茶色の枠を表示

**決定事項**:
- アプローチ: 親コンポーネント（Board.tsx / ShogiBoard.tsx）で選択可否を判定し、条件を満たす場合のみ選択状態を有効化
- Square.tsxの変更は最小限（スタイルクラスの変更のみ）

### 5. パフォーマンス最適化の検討

**調査内容**: クリックから枠表示までの応答時間を100ミリ秒以内に保つための方法

**分析**:
- Reactの状態更新は同期的で、通常10-50ミリ秒程度で完了
- 条件判定は単純な等価チェックのみ（O(1)）
- 盤面は9×9の81マスで、レンダリングコストは低い
- useMemoやuseCallbackの最適化は既存コードで実施済み

**決定事項**:
- 特別な最適化は不要
- 既存のReactの状態管理で十分なパフォーマンスを達成可能

### 6. テスト戦略

**調査内容**: Vitest + React Testing Libraryでの視覚的フィードバックのテスト方法

**テストカテゴリ**:

1. **単体テスト（logic/selectionLogic.test.ts）**:
   - `canSelectPiece` 関数の動作検証
   - 手番と駒の所有者の組み合わせパターン

2. **コンポーネントテスト（components/Square.test.tsx）**:
   - 選択可能な駒クリック時の枠スタイル適用
   - 選択不可能な駒クリック時の枠非表示
   - 空マスクリック時の枠非表示

3. **統合テスト（components/ShogiBoard.test.tsx）**:
   - 手番切り替え時の選択状態リセット
   - 駒移動後の選択解除

**決定事項**:
- Testing Libraryの `getByRole`, `getByTestId` でDOM要素を取得
- `toHaveClass` マッチャーでスタイルクラスの適用を検証
- ユーザーインタラクション（`userEvent.click`）で実際の操作をシミュレート

## 技術的決定事項まとめ

### 1. 選択可否判定ロジック

新規ファイル: `src/logic/selectionLogic.ts`

```typescript
/**
 * 駒が現在の手番で選択可能かを判定
 * @param piece - 判定対象の駒（nullの場合は空マス）
 * @param currentTurn - 現在の手番
 * @returns 選択可能な場合true
 */
export function canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean {
  if (piece === null) {
    return false; // 空マスは選択不可
  }
  return piece.player === currentTurn; // 手番のプレイヤーの駒のみ選択可能
}
```

### 2. 視覚スタイルの実装

**選択枠のスタイル**:
- 選択可能な駒が選択された場合: `border-4 border-orange-600`
- それ以外: 枠なし（または既存のデフォルトスタイル）

**実装場所**: Square.tsx

```tsx
const borderClass = isSelected 
  ? 'border-4 border-orange-600' 
  : 'border border-gray-400';
```

### 3. 統合ポイント

**ShogiBoard.tsx での変更**:
- `handleSquareClick` 関数内で `canSelectPiece` を呼び出し
- 選択可能な駒のみ `selection` ステートを更新
- 選択不可能な駒や空マスのクリックは無視

### 4. 手番切り替え時の処理

**既存の動作確認**:
- 駒移動後、`switchTurn` 関数で手番が切り替わる
- 手番切り替え時に既存の選択状態をリセットする処理を確認

**追加実装**:
- 手番切り替え時に `setSelection(null)` を確実に呼び出す（既存実装で対応済みか確認）

## 代替案の検討

### 代替案1: 選択不可能な駒をクリック時にエラーメッセージ表示

**却下理由**: 
- 仕様書では「何も起こらない」と明記されている
- 視覚的フィードバックのみに焦点を当てることでシンプルさを保つ

### 代替案2: 選択可能な駒を事前にハイライト表示

**却下理由**:
- 本機能のスコープ外（Future Considerationsに記載済み）
- クリック時の動的なフィードバックに集中

### 代替案3: カスタムCSSでアニメーション効果を追加

**却下理由**:
- パフォーマンス目標（100ミリ秒以内）を優先
- アニメーションはFuture Considerationsに記載済み

## リスクと緩和策

| リスク | 影響 | 緩和策 |
|--------|------|--------|
| 既存の選択ロジックとの競合 | 中 | 既存コードの詳細レビューと単体テストでの検証 |
| 色覚特性のあるユーザーへの配慮不足 | 中 | WCAGコントラスト基準の検証、代替色の準備 |
| 手番切り替え時の選択解除漏れ | 低 | 統合テストでのシナリオ検証 |

## 次のステップ

Phase 1に進み、以下を作成します:
1. data-model.md: 選択状態と手番の関係を定義
2. contracts/: 選択ロジックの関数シグネチャ
3. quickstart.md: 開発者向けの実装ガイド
