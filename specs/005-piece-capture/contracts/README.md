# API Contracts: 駒の捕獲機能

**Feature**: 駒の捕獲機能
**Date**: 2025-11-09
**Status**: 完了

## 概要

駒の捕獲機能で使用するコンポーネントとロジックのインターフェースを定義する。各モジュールの責任範囲と公開APIを明確化し、実装前の契約として機能する。

---

## コンポーネント契約

### 1. CapturedPieces コンポーネント

**責任**: プレイヤーの持ち駒を視覚的に表示する

**インターフェース**:
```typescript
interface CapturedPiecesProps {
  /** 表示する持ち駒のマップ */
  capturedPieces: CapturedPiecesMap;
  /** プレイヤー(先手/後手) */
  player: Player;
}

function CapturedPieces(props: CapturedPiecesProps): JSX.Element;
```

**振る舞い**:
- 持ち駒を駒の種類ごとにグループ化して表示
- 数量が2個以上の場合は「駒 ×数量」の形式で表示
- 数量が1個の場合は駒のみ表示
- 持ち駒がない場合は空のエリアを表示
- 先手の持ち駒は盤面下部、後手の持ち駒は盤面上部に配置

**受け入れ基準**:
- [ ] 空の持ち駒マップを渡したとき、空のエリアが表示される
- [ ] 1個の駒を渡したとき、駒のみが表示される(数量表示なし)
- [ ] 複数個の駒を渡したとき、「駒 ×数量」の形式で表示される
- [ ] 複数種類の駒を渡したとき、全ての種類が表示される
- [ ] プレイヤーが'sente'のとき、適切な位置(下部)に表示される
- [ ] プレイヤーが'gote'のとき、適切な位置(上部)に表示される

**スタイリング**:
- Tailwind CSSを使用
- 駒のアイコンはPieceコンポーネントを再利用(小サイズ)
- 横並びのフレックスレイアウト
- 視覚的に区別しやすい背景色

---

### 2. ShogiBoard コンポーネント(拡張)

**責任**: 将棋盤全体を管理し、持ち駒の状態を統合する

**インターフェース拡張**:
```typescript
// 既存のGameStateに持ち駒を追加
interface GameState {
  pieces: Piece[];
  selectedSquare: Position | null;
  currentTurn: Turn;
  capturedPieces: CapturedPieces; // 新規追加
}

function ShogiBoard(): JSX.Element;
```

**振る舞いの追加**:
- 初期状態で空の持ち駒を設定
- 駒の捕獲後に持ち駒の状態を更新
- CapturedPiecesコンポーネントを上部と下部に配置

**受け入れ基準**(追加分):
- [ ] 初期状態で先手と後手の持ち駒が空になっている
- [ ] 駒を取ったとき、持ち駒の状態が正しく更新される
- [ ] 持ち駒の表示が正しく行われる
- [ ] ターン制御が持ち駒の更新後も正しく機能する

---

### 3. Board コンポーネント(拡張)

**責任**: 盤面の表示と駒の移動処理を管理し、駒の捕獲処理を統合する

**インターフェース拡張**:
```typescript
interface BoardProps {
  pieces: Piece[];
  selectedSquare: Position | null;
  currentTurn: Turn;
  onSquareClick: (position: Position) => void;
  capturedPieces: CapturedPieces; // 新規追加
}

function Board(props: BoardProps): JSX.Element;
```

**振る舞いの追加**:
- 駒の移動時に移動先の駒を確認
- 相手の駒がある場合は捕獲処理を実行
- 捕獲後に持ち駒の状態を更新(親コンポーネントに通知)

**受け入れ基準**(追加分):
- [ ] 移動先に相手の駒があるとき、駒が捕獲される
- [ ] 移動先に自分の駒があるとき、移動が拒否される
- [ ] 移動先が空のとき、通常の移動が実行される
- [ ] 捕獲後に持ち駒の状態が親コンポーネントに通知される

---

## ロジック契約

### 1. captureLogic.ts

**責任**: 駒の捕獲に関するビジネスロジックを提供

#### 1.1 getTargetPiece

**シグネチャ**:
```typescript
function getTargetPiece(
  pieces: Piece[],
  position: Position,
  currentPlayer: Player
): Piece | null;
```

**説明**: 指定された位置に相手の駒があるか判定し、あれば返す

**引数**:
- `pieces`: 盤面上の全ての駒
- `position`: 確認する位置
- `currentPlayer`: 現在のプレイヤー

**戻り値**:
- 相手の駒がある場合: その駒(Piece)
- 相手の駒がない場合(空または自分の駒): null

**受け入れ基準**:
- [ ] 移動先に相手の駒があるとき、その駒を返す
- [ ] 移動先が空のとき、nullを返す
- [ ] 移動先に自分の駒があるとき、nullを返す
- [ ] 無効な位置が指定されたとき、nullを返す

#### 1.2 addToCapturedPieces

**シグネチャ**:
```typescript
function addToCapturedPieces(
  capturedPieces: CapturedPieces,
  piece: Piece,
  capturingPlayer: Player
): CapturedPieces;
```

**説明**: 駒を持ち駒に追加する(不変性を保つ)

**引数**:
- `capturedPieces`: 現在の持ち駒の状態
- `piece`: 取った駒
- `capturingPlayer`: 駒を取ったプレイヤー

**戻り値**:
- 更新された持ち駒の状態(新しいオブジェクト)

**副作用**: なし(純粋関数)

**受け入れ基準**:
- [ ] 初めて取る種類の駒のとき、数量1で追加される
- [ ] 既に持っている種類の駒のとき、数量が+1される
- [ ] 元のcapturedPiecesオブジェクトは変更されない(不変性)
- [ ] 取られた駒の所有者情報は無視され、取ったプレイヤーの持ち駒になる

#### 1.3 removePieceFromBoard

**シグネチャ**:
```typescript
function removePieceFromBoard(
  pieces: Piece[],
  position: Position
): Piece[];
```

**説明**: 指定された位置の駒を盤面から削除する(不変性を保つ)

**引数**:
- `pieces`: 盤面上の全ての駒
- `position`: 削除する駒の位置

**戻り値**:
- 駒を削除した新しい配列

**副作用**: なし(純粋関数)

**受け入れ基準**:
- [ ] 指定された位置の駒が削除される
- [ ] 他の駒は影響を受けない
- [ ] 元のpieces配列は変更されない(不変性)
- [ ] 指定された位置に駒がない場合、元の配列と同じ内容を返す

---

### 2. boardState.ts (拡張)

**責任**: 盤面状態の管理を行い、駒の捕獲処理を統合する

#### 2.1 updateBoardAfterMove (拡張)

**シグネチャ**:
```typescript
function updateBoardAfterMove(
  board: Piece[],
  from: Position,
  to: Position,
  capturedPieces: CapturedPieces,
  currentPlayer: Player
): {
  pieces: Piece[];
  capturedPieces: CapturedPieces;
};
```

**説明**: 駒の移動と捕獲を処理し、新しい盤面状態と持ち駒を返す

**引数**:
- `board`: 現在の盤面上の駒
- `from`: 移動元の位置
- `to`: 移動先の位置
- `capturedPieces`: 現在の持ち駒
- `currentPlayer`: 現在のプレイヤー

**戻り値**:
- `pieces`: 更新された盤面の駒配列
- `capturedPieces`: 更新された持ち駒

**処理フロー**:
1. 移動先に相手の駒があるか確認
2. あれば駒を持ち駒に追加し、盤面から削除
3. 移動する駒の位置を更新
4. 新しい状態を返す

**受け入れ基準**:
- [ ] 移動先に相手の駒があるとき、駒が捕獲され持ち駒に追加される
- [ ] 移動先が空のとき、通常の移動が実行される
- [ ] 元の配列/オブジェクトは変更されない(不変性)
- [ ] 駒の移動と捕獲が正しく同期される

#### 2.2 createInitialGameState (拡張)

**シグネチャ**:
```typescript
function createInitialGameState(): GameState;
```

**説明**: 初期ゲーム状態を作成(持ち駒を含む)

**戻り値**:
```typescript
{
  pieces: INITIAL_POSITION,
  selectedSquare: null,
  currentTurn: 'sente',
  capturedPieces: {
    sente: {},
    gote: {}
  }
}
```

**受け入れ基準**:
- [ ] 初期状態で持ち駒が空になっている
- [ ] 先手と後手の持ち駒がそれぞれ空のオブジェクトになっている

---

## テスト契約

### ユニットテスト

各関数/コンポーネントの個別機能をテスト:

1. **captureLogic.test.ts**:
   - `getTargetPiece`の全ケース
   - `addToCapturedPieces`の全ケース
   - `removePieceFromBoard`の全ケース

2. **boardState.test.ts** (追加):
   - `updateBoardAfterMove`での駒の捕獲
   - `createInitialGameState`での持ち駒の初期化

3. **CapturedPieces.test.tsx**:
   - 空の持ち駒の表示
   - 1個の駒の表示
   - 複数個の駒の表示
   - 複数種類の駒の表示
   - プレイヤーごとの配置

### 統合テスト

複数のモジュールを組み合わせたテスト:

1. **ShogiBoard.test.tsx** (追加):
   - 駒の捕獲フロー全体
   - 持ち駒の状態管理
   - ターン制御との統合

2. **Board.test.tsx** (追加):
   - 駒の移動と捕獲の統合
   - 持ち駒の更新通知

### エッジケーステスト

1. **持ち駒の数量管理**:
   - 同じ種類の駒を複数回取る
   - 最大数量の駒を取る

2. **境界条件**:
   - 空の盤面での捕獲
   - 王/玉の取得試行(ゲーム終了)

---

## パフォーマンス契約

### 応答時間

- **駒の捕獲処理**: 0.5秒以内
- **持ち駒表示の更新**: 100ms以内
- **視覚的フィードバック**: 100ms以内

### メモリ使用量

- 持ち駒の状態サイズ: 最大1KB未満
- 不要なオブジェクトの即座なガベージコレクション

### レンダリング最適化

- CapturedPiecesコンポーネント: props変更時のみ再レンダリング
- 不要なリレンダリングの防止(React.memoの検討)

---

## エラー処理契約

### バリデーション

1. **入力検証**:
   - 無効な位置(範囲外)の処理
   - nullまたはundefinedの駒の処理
   - 無効なプレイヤー値の処理

2. **状態の整合性**:
   - 持ち駒の数量が負にならないことを保証
   - 盤面の駒と持ち駒の合計が一定であることを検証

### エラーメッセージ

開発環境でのみコンソールに警告を出力:
- 無効な捕獲操作の試行
- 状態の整合性エラー

---

## 依存関係

```
CapturedPieces
  ├─ Piece (既存コンポーネントを再利用)
  └─ types/capturedPieces

captureLogic
  ├─ types/piece
  ├─ types/position
  └─ types/capturedPieces

boardState (拡張)
  ├─ captureLogic
  ├─ types/board
  ├─ types/piece
  ├─ types/position
  └─ types/capturedPieces

Board (拡張)
  ├─ boardState
  ├─ captureLogic
  └─ types/board

ShogiBoard (拡張)
  ├─ Board
  ├─ CapturedPieces
  └─ boardState
```

---

## 実装順序の推奨

1. **型定義**: `types/capturedPieces.ts`
2. **ロジック**: `logic/captureLogic.ts` (TDD)
3. **状態管理**: `logic/boardState.ts` (拡張、TDD)
4. **コンポーネント**: `components/CapturedPieces.tsx` (TDD)
5. **統合**: `components/Board.tsx` と `components/ShogiBoard.tsx` (拡張、TDD)
6. **統合テスト**: 全体のフロー検証

各ステップでテストファースト(Red-Green-Refactor)を厳守。
