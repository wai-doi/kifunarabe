# Component Contracts: ターンベース駒移動制御

このディレクトリには、ターンベース駒移動制御フェーチャーで使用されるコンポーネントのインターフェース定義が含まれます。

## コンポーネント一覧

### 1. TurnDisplay Component (新規)

**責任**: 現在のターンを視覚的に表示し、無効操作時のアニメーション効果を提供する

**Props**:
```typescript
interface TurnDisplayProps {
  currentTurn: Turn;        // 現在のターン ('sente' | 'gote')
  isHighlighted: boolean;   // アニメーション強調表示フラグ
}
```

**表示内容**:
- 先手のターン: 「先手の番」
- 後手のターン: 「後手の番」

**視覚的スタイル**:
- 配置: 盤面上部中央
- フォント: 大きめで読みやすい
- 色: ターンによって異なる色(例: 先手=濃いグレー、後手=薄いグレー)
- アニメーション: `isHighlighted === true` の時、揺れまたは点滅

**使用例**:
```tsx
<TurnDisplay currentTurn={gameState.currentTurn} isHighlighted={showFeedback} />
```

### 2. Board Component (既存 - 拡張)

**追加責任**: 駒選択時にターン検証を実行

**Props** (既存に追加):
```typescript
interface BoardProps {
  // ... 既存のprops
  currentTurn: Turn;  // 追加: 現在のターン
}
```

**新規機能**:
- `handleSquareClick` 内でターン検証ロジックを呼び出し
- 無効な選択の場合、視覚的フィードバックをトリガー
- 有効な選択の場合、従来の駒選択処理を継続

**インタラクション**:
```typescript
// 駒選択時の処理フロー
onClick(position) {
  const piece = board[position.row][position.col];
  if (piece && piece.player !== currentTurn) {
    // 無効な選択: フィードバックを表示
    triggerVisualFeedback();
    return;
  }
  // 有効な選択: 従来の処理を継続
  selectPiece(position);
}
```

### 3. ShogiBoard Component (既存 - 拡張)

**追加責任**: ターン状態を管理し、ターン表示を統合

**State** (既存に追加):
```typescript
interface GameState {
  board: (Piece | null)[][];
  selectedSquare: Position | null;
  currentTurn: Turn;  // 追加
}
```

**新規機能**:
- `TurnDisplay` コンポーネントを配置
- 駒移動成功後にターンを自動切り替え
- 無効操作時の `isHighlighted` フラグ管理

**レイアウト**:
```tsx
<div className="shogi-board-container">
  <TurnDisplay currentTurn={gameState.currentTurn} isHighlighted={isHighlighted} />
  <Board 
    board={gameState.board}
    currentTurn={gameState.currentTurn}
    onMove={handleMove}
  />
</div>
```

## ロジック契約

### turnControl.ts (新規)

**責任**: ターン制御ロジックの提供

**公開関数**:

```typescript
/**
 * 現在のターンと駒の所有者が一致するかを検証
 * @param currentTurn - 現在のターン
 * @param piecePlayer - 選択された駒の所有者
 * @returns true: 有効, false: 無効
 */
export function canSelectPiece(currentTurn: Turn, piecePlayer: Player): boolean;

```typescript
/**
 * ターンを切り替える
 * @param currentTurn - 現在のターン
 * @returns 次のターン ('sente' → 'gote' または 'gote' → 'sente')
 */
export function switchTurn(currentTurn: Turn): Turn;

/**
 * ターンの表示名を取得
 * @param turn - ターン ('sente' | 'gote')
 * @returns 表示名 (例: "先手の番")
 */
export function getTurnDisplayName(turn: Turn): string;
```
```

**実装契約**:
- すべての関数は純粋関数(副作用なし)
- 型安全性を保証
- エッジケースの処理(nullチェック等)を含む

### boardState.ts (既存 - 拡張)

**追加機能**: ターン状態を含むゲーム状態の管理

**拡張関数**:

```typescript
/**
 * 初期ゲーム状態を作成(ターン情報を含む)
 * @returns 初期ゲーム状態
 */
export function createInitialGameState(): GameState;

/**
 * 駒の移動を実行し、ターンを切り替える
 * @param gameState - 現在のゲーム状態
 * @param from - 移動元の位置
 * @param to - 移動先の位置
 * @returns 更新されたゲーム状態(ターン切り替え済み)
 */
export function movePieceAndSwitchTurn(
  gameState: GameState,
  from: Position,
  to: Position
): GameState;
```

## テスト契約

各コンポーネントとロジックは以下のテストケースを満たす必要がある:

### TurnDisplay Component
- [ ] 先手のターンを正しく表示する
- [ ] 後手のターンを正しく表示する
- [ ] `isHighlighted === true` の時、アニメーションが適用される
- [ ] `isHighlighted === false` の時、通常表示される

### turnControl.ts
- [ ] `canSelectPiece`: 同じプレイヤーの駒を選択した場合、trueを返す
- [ ] `canSelectPiece`: 異なるプレイヤーの駒を選択した場合、falseを返す
- [ ] `switchTurn`: 'sente' → 'gote' に切り替わる
- [ ] `switchTurn`: 'gote' → 'sente' に切り替わる
- [ ] `getTurnDisplayName`: 'sente' → "先手の番"
- [ ] `getTurnDisplayName`: 'gote' → "後手の番"

### Board Component (統合テスト)
- [ ] 先手のターンに先手の駒を選択できる
- [ ] 先手のターンに後手の駒を選択できない
- [ ] 後手のターンに後手の駒を選択できる
- [ ] 後手のターンに先手の駒を選択できない
- [ ] 無効な選択時に視覚的フィードバックが表示される

### ShogiBoard Component (E2Eテスト)
- [ ] ゲーム開始時、ターンが先手である
- [ ] 先手が駒を動かすと、ターンが後手に切り替わる
- [ ] 後手が駒を動かすと、ターンが先手に切り替わる
- [ ] ページリロード時、ターンが先手にリセットされる

## API契約(該当なし)

本フェーチャーはクライアントサイドのみで完結するため、外部APIとの契約は存在しない。

## データフロー

```
User Input (駒をクリック)
  ↓
Board.handleSquareClick()
  ↓
turnControl.canSelectPiece(currentTurn, piece.player)
  ↓
  ├─ true: 駒を選択、移動可能マスをハイライト
  │   ↓
  │   User Input (移動先をクリック)
  │   ↓
  │   boardState.movePieceAndSwitchTurn()
  │   ↓
  │   gameState.currentTurn を更新
  │   ↓
  │   TurnDisplay に新しいターンを伝播
  │
  └─ false: 視覚的フィードバックを表示
      ↓
      ShogiBoard.isHighlighted = true
      ↓
      TurnDisplay にアニメーションを適用
      ↓
      0.5秒後に isHighlighted = false
```

## パフォーマンス契約

- ターン切り替え: 0.5秒以内
- 視覚的フィードバック表示: 100ms以内
- アニメーション実行: スムーズ(60fps以上)
- ターン検証: 同期処理、遅延なし
