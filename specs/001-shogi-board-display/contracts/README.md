# Contracts: 将棋盤と駒の初期配置表示

**Date**: 2025-11-01
**Feature**: 001-shogi-board-display

## 概要

この機能は静的な表示のみを提供するため、外部APIやサービス契約は存在しません。

## コンポーネント契約

この機能では、Reactコンポーネント間のprops契約が主要な「契約」となります。

### 1. ShogiBoard コンポーネント

**役割**: 将棋盤全体を統合し、駒を配置する最上位コンポーネント

**Props**:
```typescript
interface ShogiBoardProps {
  /** 初期配置データ(デフォルト: INITIAL_POSITION) */
  pieces?: Piece[];
}
```

**責任**:
- 初期配置データを受け取る(省略時はデフォルト値を使用)
- Boardコンポーネントに各マス目と駒の情報を渡す
- ページ背景色(#C8B560)を適用する

**使用例**:
```tsx
// デフォルト初期配置を使用
<ShogiBoard />

// カスタム配置を使用(将来の拡張用)
<ShogiBoard pieces={customPosition} />
```

---

### 2. Board コンポーネント

**役割**: 9×9のグリッドレイアウトを提供し、マス目を配置する

**Props**:
```typescript
interface BoardProps {
  /** 将棋盤上の全ての駒 */
  pieces: Piece[];
}
```

**責任**:
- CSS Gridで9×9のマス目を生成
- 各マス目に対応する駒を見つけてSquareコンポーネントに渡す
- 将棋盤の背景色(#D4A574)を適用
- レスポンシブサイズ調整(最小300x300px)

**使用例**:
```tsx
<Board pieces={INITIAL_POSITION} />
```

---

### 3. Square コンポーネント

**役割**: 個別のマス目を表示し、駒があれば配置する

**Props**:
```typescript
interface SquareProps {
  /** マス目の位置 */
  position: Position;

  /** このマス目に配置されている駒(なければundefined) */
  piece?: Piece;
}
```

**責任**:
- マス目の境界線を表示
- 駒があればPieceコンポーネントをレンダリング
- アクセシビリティ属性(`role="gridcell"`)を設定

**使用例**:
```tsx
// 空のマス目
<Square position={{ file: 1, rank: 4 }} />

// 駒が配置されたマス目
<Square
  position={{ file: 5, rank: 9 }}
  piece={{ type: '王', player: 'sente', file: 5, rank: 9 }}
/>
```

---

### 4. Piece コンポーネント

**役割**: 駒を表示する

**Props**:
```typescript
interface PieceProps {
  /** 駒のデータ */
  piece: Piece;
}
```

**責任**:
- 駒の種類(type)をテキストで表示
- 駒の色(#8B4513)を適用
- 後手の駒を180度回転
- フォントサイズをマス目の70%に設定
- アクセシビリティラベル(`aria-label`)を設定

**使用例**:
```tsx
<Piece piece={{ type: '王', player: 'sente', file: 5, rank: 9 }} />
```

---

## データフロー契約

```
INITIAL_POSITION (data/initialPosition.ts)
    ↓
ShogiBoard (統合)
    ↓ pieces
Board (グリッド生成)
    ↓ pieces + position計算
Square (マス目 × 81)
    ↓ piece (if exists)
Piece (駒表示)
```

### データの不変性

- すべてのpropsは読み取り専用
- 子コンポーネントはpropsを変更してはならない
- データの流れは常に親から子への一方向

---

## スタイリング契約

### 色の定義

| 要素 | 色コード | 用途 |
|------|---------|------|
| ページ背景 | `#C8B560` | 畳をイメージした黄緑がかった茶色 |
| 将棋盤 | `#D4A574` | 木製をイメージした薄茶色 |
| 駒テキスト | `#8B4513` | 濃茶色 |
| マス目境界線 | `#8B4513` | 濃茶色(駒と同じ) |

### サイズの契約

| 要素 | サイズ仕様 |
|------|-----------|
| 将棋盤 | 最小: 300×300px, 最大: 90vmin |
| 駒のフォント | マス目の高さの70% |
| マス目 | 将棋盤の1/9(グリッドで自動調整) |

---

## アクセシビリティ契約

### ARIA属性

- **Board**: `role="grid"`, `aria-label="将棋盤"`
- **Square**: `role="gridcell"`
- **Piece**: `aria-label="{player}の{type}"` (例: "先手の王", "後手の飛")

### キーボード操作

この機能では、キーボード操作は実装しません(静的表示のみ)。将来の拡張時に追加予定。

---

## パフォーマンス契約

### 目標

- **初期レンダリング**: 1秒以内に将棋盤を表示
- **全駒配置**: 2秒以内に40枚の駒を配置
- **リサイズ**: 60fpsでスムーズなレスポンシブ調整

### 最適化戦略

1. **メモ化**: `React.memo`で不要な再レンダリングを防止
2. **遅延読み込み**: なし(すべて静的データ)
3. **バンドルサイズ**: 初期配置データをツリーシェイキング可能な形式で提供

---

## テスト契約

### ユニットテスト

各コンポーネントは以下をテストする必要があります:

1. **ShogiBoard**: デフォルトで40枚の駒がレンダリングされる
2. **Board**: 81個のSquareコンポーネントがレンダリングされる
3. **Square**: 駒があればPieceコンポーネントがレンダリングされる
4. **Piece**: 正しいテキストと色、後手の駒は回転している

### 統合テスト

- 完全な初期配置が正しくレンダリングされる
- レスポンシブサイズ調整が機能する
- 配色が仕様通りに適用されている

---

## 将来の拡張契約

この機能は将来、以下の契約を追加する可能性があります(現在は実装しない):

1. **駒移動API**: `onPieceMove(from: Position, to: Position): void`
2. **盤面状態API**: `onBoardStateChange(state: BoardState): void`
3. **棋譜読み込みAPI**: `loadKifu(kifu: KifuData): void`

現在の設計は、これらの拡張を容易にするための基盤として機能します。
