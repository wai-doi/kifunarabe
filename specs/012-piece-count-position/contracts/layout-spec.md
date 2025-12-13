# Layout Specification: 持ち駒の数字表示

**Feature**: 012-piece-count-position  
**Version**: 1.0.0  
**Date**: 2025-12-13

## 目的

同じ種類の持ち駒を複数持っている場合、その枚数を示す数字の視覚的な配置とスタイルを定義します。

## レイアウト原則

### 1. 階層構造

数字は駒の文字の補助情報として、視覚的に区別されなければなりません:

- **主要情報**: 駒の文字（中央、大きめ）
- **補助情報**: 数字（右下、小さめ）

### 2. 位置の一貫性

- 先手・後手に関係なく、常に画面上の物理的な右下に配置
- 駒の回転（後手の180度回転）に影響されない

### 3. 視認性

- 木目調の背景に対して十分なコントラストを確保
- モバイルデバイスでも判読可能なサイズ
- 選択状態でも可視性を維持

## CSS契約

### 必須クラスとプロパティ

#### 駒のコンテナ

```css
.captured-piece-container {
  /* 必須 */
  position: relative;
  
  /* 既存のスタイル（例） */
  clip-path: polygon(50% 0%, 85% 20%, 95% 100%, 5% 100%, 15% 20%);
  background: linear-gradient(135deg, #E8C4A0, #D4A574);
  /* ... */
}
```

**契約**:
- `position: relative` は必須（数字の絶対配置の基準点）
- 既存の clip-path や background は維持

#### 駒の文字

```css
.piece-text {
  /* 必須 */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* スタイル例 */
  font-size: 1.5rem; /* デスクトップ */
  color: #3E2723;
  /* ... */
}
```

**契約**:
- 中央配置を維持
- フォントサイズは駒のサイズに応じて調整可能

#### 数字

```css
.piece-count {
  /* 必須 - 配置 */
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 10;
  
  /* 必須 - スタイル */
  font-size: 0.6em; /* 親要素（駒の文字）の60% */
  color: #5C4033;
  
  /* 推奨 */
  font-weight: 600;
  line-height: 1;
  pointer-events: none; /* クリックイベントを透過 */
}
```

**契約**:
- `position: absolute` は必須
- `right` と `bottom` で右下に配置（値は調整可能）
- `z-index` は 10 以上（ハイライトより前面）
- フォントサイズは親要素の 60% （0.6em または計算値）
- `color` は木目調の背景に対してコントラスト比 4.5:1 以上

#### 選択状態の数字

```css
.captured-piece-container.selected .piece-count,
.captured-piece-container[aria-pressed="true"] .piece-count {
  color: #3E2723; /* さらに濃い色 */
}
```

**契約**:
- 選択状態でもコントラスト比を維持
- 可視性を保証

## 数値定数

### サイズ

| 定数名 | 値 | 説明 |
|--------|-----|------|
| `COUNT_FONT_SIZE_RATIO` | 0.6 | 駒の文字に対する数字のフォントサイズ比 |
| `COUNT_OFFSET_RIGHT` | 2px | 右端からのオフセット |
| `COUNT_OFFSET_BOTTOM` | 2px | 下端からのオフセット |
| `COUNT_Z_INDEX` | 10 | z-index（ハイライトより前面） |

### 色

| 定数名 | 値 | 用途 | コントラスト比 |
|--------|-----|------|---------------|
| `COUNT_COLOR` | #5C4033 | 通常時の数字の色 | 5.2:1 (vs #E8C4A0) |
| `COUNT_COLOR_ALT` | #4A4A4A | 代替色 | 5.8:1 (vs #E8C4A0) |
| `COUNT_COLOR_SELECTED` | #3E2723 | 選択時の数字の色 | 7.1:1 (vs 選択背景) |

### レスポンシブ

| ブレークポイント | 駒の文字サイズ | 数字のサイズ | オフセット |
|-----------------|--------------|------------|----------|
| デスクトップ (>= 768px) | 1.5rem (24px) | 0.9rem (14.4px) | right: 2px, bottom: 2px |
| タブレット (>= 640px) | 1.25rem (20px) | 0.75rem (12px) | right: 1.5px, bottom: 1.5px |
| モバイル (< 640px) | 1.125rem (18px) | 0.675rem (10.8px) | right: 1.5px, bottom: 1.5px |

## コンポーネント契約

### Props

```typescript
interface CapturedPiecesProps {
  /** 表示する持ち駒のマップ */
  capturedPieces: CapturedPiecesMap;
  
  /** プレイヤー(先手/後手) */
  player: Player;
  
  /** 駒がクリックされた時のハンドラ */
  onPieceClick?: (pieceType: PieceType) => void;
  
  /** 現在選択中の駒の種類 */
  selectedPieceType?: PieceType;
  
  /** 持ち駒を選択可能かどうか */
  isSelectable?: boolean;
}
```

**契約**:
- `count` が 2 以上の場合のみ数字を表示
- `count` が 1 または undefined の場合、数字は表示しない
- 数字の配置は player (先手/後手) に関係なく同じ

### 描画ロジック

```typescript
// 擬似コード
for each (pieceType, count) in capturedPieces {
  if (count && count > 0) {
    render_piece(pieceType);
    
    if (count > 1) {
      render_count(count); // 右下に配置
    }
  }
}
```

**契約**:
- 枚数が 1 の場合、数字は表示しない
- 枚数が 2 以上の場合、数字を右下に表示
- 枚数が 10 以上（2桁）でも、レイアウトを維持

### ARIA契約

```typescript
// aria-label の形式
const ariaLabel = `持ち駒の${pieceType}${count > 1 ? `（${count}枚）` : ''}`;

// 例:
// - 1枚の場合: "持ち駒の歩"
// - 2枚以上の場合: "持ち駒の歩（3枚）"
```

**契約**:
- 全ての持ち駒ボタンに `aria-label` を設定
- 枚数が 2 以上の場合、枚数を含める
- 選択状態は `aria-pressed` で示す

## 視覚的な例

### デスクトップ表示

```
┌────────────────────┐
│                    │
│        歩          │ ← 駒の文字 (1.5rem)
│                 3  │ ← 数字 (0.9rem, 右下)
│                    │
└────────────────────┘
```

### モバイル表示

```
┌──────────────┐
│              │
│     歩       │ ← 駒の文字 (1.125rem)
│           3  │ ← 数字 (0.675rem, 右下)
│              │
└──────────────┘
```

### 2桁の数字

```
┌────────────────────┐
│                    │
│        歩          │
│                18  │ ← 2桁でも右下に収まる
│                    │
└────────────────────┘
```

## テスト契約

### 視覚的テスト

1. **配置の確認**:
   - 数字が駒の右下に配置されている
   - 駒の文字と数字が重ならない
   - 五角形の形状内に収まっている

2. **サイズの確認**:
   - 数字のフォントサイズが駒の文字の約60%
   - 2桁の数字も適切に表示される

3. **色の確認**:
   - 背景とのコントラスト比が 4.5:1 以上
   - 選択状態でも可視である

### 機能的テスト

1. **表示条件**:
   - count === 1 の場合、数字が表示されない
   - count >= 2 の場合、数字が表示される
   - count === undefined の場合、数字が表示されない

2. **レスポンシブ**:
   - デスクトップ、タブレット、モバイルで適切なサイズで表示される
   - すべてのブレークポイントで判読可能

3. **アクセシビリティ**:
   - aria-label に枚数が含まれている
   - スクリーンリーダーで枚数を読み上げ可能

## バージョン履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2025-12-13 | 初版リリース |

## 参考資料

- [WCAG 2.1 コントラスト基準](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS position プロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/position)
- [CSS z-index プロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/z-index)
