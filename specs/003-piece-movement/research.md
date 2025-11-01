# Research: 駒の移動機能

**Feature**: 003-piece-movement
**Date**: 2025-11-02
**Status**: 完了

## 調査項目と結果

### 1. React Hooksによる状態管理パターン

**調査内容**: 駒の選択状態と盤面状態を効率的に管理する方法

**Decision**: `useState`を使用したシンプルな状態管理

**Rationale**:
- **選択状態**: `useState<Position | null>`で現在選択されている駒の位置を管理
- **盤面状態**: `useState<(Piece | null)[][]>`で9×9の2次元配列として盤面を管理
- Redux等の外部ライブラリは不要 - 状態はShogiBoard コンポーネント内に限定される
- useState は React の基本機能であり、学習コストが低い
- 状態の更新はイミュータブルな方法で行う(配列・オブジェクトのコピーを作成)

**Alternatives Considered**:
- **useReducer**: より複雑な状態遷移に適しているが、現時点では過剰
- **外部状態管理ライブラリ(Redux, Zustand)**: グローバルな状態共有が不要なため不採用

### 2. 駒の移動ルール実装パターン

**調査内容**: 8種類の駒(歩、香、桂、銀、金、飛、角、王)の移動ルールを効率的に実装する方法

**Decision**: 駒種ごとの移動ベクトル + 経路チェック関数

**Rationale**:
- 各駒種の移動可能な方向をベクトル配列で定義
- 例: 歩(先手) = `[{dFile: 0, dRank: 1}]`, 飛車 = `[{dFile: 0, dRank: 1}, {dFile: 0, dRank: -1}, {dFile: 1, dRank: 0}, {dFile: -1, dRank: 0}]`
- 長距離移動駒(飛車、角、香)は経路上の障害物をチェック
- 短距離移動駒(歩、桂、銀、金、王)は1マスのみ判定
- 将来の拡張(成り駒)にも対応しやすい構造
- file/rank表記を使用し、既存の型定義と整合性を保つ

**Alternatives Considered**:
- **個別の判定関数**: 各駒種ごとに専用の関数を実装。コード重複が多く保守性が低い
- **ルールエンジン**: 過度に抽象化され、現時点では複雑すぎる

**Implementation Details**:
```typescript
// 移動ルール定義の例 (先手の場合)
const MOVE_PATTERNS: Record<PieceType, MovePattern> = {
  歩: { vectors: [{dFile: 0, dRank: 1}], range: 1 },
  香: { vectors: [{dFile: 0, dRank: 1}], range: Infinity },
  桂: { vectors: [{dFile: -1, dRank: 2}, {dFile: 1, dRank: 2}], range: 1 },
  // ... 他の駒種
};
```

### 3. 駒の選択状態の視覚表示

**調査内容**: 選択中の駒を視覚的に識別可能にする方法

**Decision**: Tailwind CSSのクラスを使用した背景色変更 + 枠線表示

**Rationale**:
- 選択状態: `bg-yellow-200 ring-4 ring-yellow-500`
- 非選択状態: 通常の背景色(`bg-amber-100`)
- SC-004の要件(90%以上が識別可能)を満たすための十分なコントラスト
- アニメーション不要 - パフォーマンス要件(0.1秒以内)を満たすため
- アクセシビリティ: 色だけでなく枠線でも識別可能

**Alternatives Considered**:
- **アニメーション効果**: パフォーマンス要件を満たすのが困難
- **影の追加**: 視認性は向上するが、パフォーマンスへの影響が懸念される

**Implementation Details**:
```typescript
// Piece コンポーネントでの条件付きクラス適用
<div className={`piece ${isSelected ? 'bg-yellow-200 ring-4 ring-yellow-500' : 'bg-amber-100'}`}>
  {pieceText}
</div>
```

### 4. 移動ルール判定のパフォーマンス最適化

**調査内容**: 移動可能マスの判定を高速に行う方法

**Decision**: 同期的な判定関数 + メモ化なし(初期実装)

**Rationale**:
- 9×9=81マスの盤面は十分小さく、全マスをチェックしても高速
- 移動可能マスの計算は駒選択時に1回のみ実行
- TypeScriptの最適化により、ループ処理は十分高速
- SC-001, SC-002の要件(0.1秒、0.2秒以内)を余裕で満たす
- 初期実装ではシンプルさを優先し、パフォーマンス問題が発生した場合のみ最適化

**Alternatives Considered**:
- **メモ化(useMemo)**: 現時点では不要、将来的に必要になった場合に導入
- **Web Worker**: 過剰な複雑性、同期処理で十分

### 5. テスト戦略

**調査内容**: 移動ルールと状態管理の効果的なテスト方法

**Decision**: ユニットテスト(logic/) + コンポーネントテスト(components/)の2層構造

**Rationale**:
- **ユニットテスト**: `moveRules.ts`の各駒種の移動ルール判定を個別にテスト
  - 各駒種につき、移動可能なパターンと不可能なパターンをテスト
  - 経路上の障害物判定をテスト
  - エッジケース(盤外、盤の端)をテスト
- **コンポーネントテスト**: `ShogiBoard.tsx`のユーザー操作をテスト
  - 駒の選択・選択解除
  - 駒の移動
  - 不正な移動の拒否
- React Testing Libraryの`fireEvent`でクリックイベントをシミュレート
- 受入基準(Acceptance Scenarios)を直接テストケースに変換

**Alternatives Considered**:
- **E2Eテスト**: 初期フェーズでは過剰、実装が安定してから追加を検討
- **統合テストのみ**: ロジックのバグの原因特定が困難になる

## ベストプラクティスと推奨事項

### 1. イミュータブルな状態更新

盤面状態の更新時は常に新しい配列を作成する:

```typescript
// Good: イミュータブルな更新
const newBoard = board.map(piece => {
  if (piece.file === from.file && piece.rank === from.rank) {
    return { ...piece, file: to.file, rank: to.rank };
  }
  return piece;
});
setBoard(newBoard);

// Bad: 元の配列を直接変更
const piece = board.find(p => p.file === from.file && p.rank === from.rank);
if (piece) {
  piece.file = to.file; // ❌ Reactが変更を検知できない
}
```

### 2. 型安全性の確保

TypeScriptの型システムを最大限活用:

```typescript
// Position型で座標を厳密に管理 (file: 1-9, rank: 1-9)
type Position = { file: number; rank: number };

// 駒種を列挙型で定義
type PieceType = '歩' | '香' | '桂' | '銀' | '金' | '飛' | '角' | '王';
```

### 3. 単一責任の原則

各関数は1つの責務のみを持つ:

```typescript
// Good: 責務を分離
function isValidMove(from: Position, to: Position, piece: Piece, board: Board): boolean {
  const pattern = MOVE_PATTERNS[piece.type];
  if (!isInMoveRange(from, to, pattern)) return false;
  if (!isPathClear(from, to, board)) return false;
  if (isOccupied(to, board)) return false;
  return true;
}

// Bad: 1つの関数に全てを詰め込む
function checkEverything() { /* 複雑すぎる */ }
```

### 4. テスタビリティ

ビジネスロジックをコンポーネントから分離:

```typescript
// logic/moveRules.ts - テストしやすい純粋関数
export function calculateValidMoves(
  piece: Piece, 
  position: Position, 
  board: Board
): Position[] {
  // ロジックのみ、UIの依存なし
}

// components/ShogiBoard.tsx - ロジックを利用
const validMoves = calculateValidMoves(selectedPiece, selectedPosition, board);
```

## 技術的リスクと対策

### リスク1: パフォーマンス劣化

**リスク**: 移動可能マスの計算が遅い

**可能性**: 低 (81マスは小規模)

**対策**: 
- 初期実装は最適化なしで進める
- パフォーマンス測定を実施
- 問題が発生した場合のみ、useMemoで最適化

### リスク2: 移動ルールのバグ

**リスク**: 駒種ごとの移動ルール実装に誤りがある

**可能性**: 中

**対策**:
- 各駒種につき網羅的なユニットテストを作成
- 将棋のルールブックを参照して正確性を確認
- エッジケース(盤の端、障害物)を明示的にテスト

### リスク3: 状態管理の複雑化

**リスク**: 将来の機能追加で状態管理が複雑になる

**可能性**: 中

**対策**:
- 現時点ではuseStateで十分、必要に応じてuseReducerに移行可能
- 状態更新ロジックを関数として分離し、リファクタリングしやすくする
- イミュータブルな更新パターンを徹底

## 参考資料

- [React Hooks 公式ドキュメント](https://react.dev/reference/react/hooks)
- [将棋のルール - 日本将棋連盟](https://www.shogi.or.jp/knowledge/shogi/)
- [React Testing Library ベストプラクティス](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/handbook/intro.html)

## 未解決の課題

なし - すべての技術的決定が完了しました。
