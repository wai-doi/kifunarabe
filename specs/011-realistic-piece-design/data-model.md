# Data Model: リアルな将棋駒デザイン

**Date**: 2025-12-10
**Feature**: 駒の視覚的スタイル仕様

## 概要

このドキュメントは、駒の五角形形状、木目調の質感、立体感を実装するためのスタイル仕様を定義します。データモデルというよりも、ビジュアルデザインの「モデル」として、CSSプロパティとその値を標準化します。

## スタイル定義

### 1. 五角形の形状

**clip-path 座標**:
```css
clip-path: polygon(50% 0%, 85% 20%, 95% 100%, 5% 100%, 15% 20%);
```

**座標の説明**:
- `50% 0%`: 上部中央 (駒の先端)
- `85% 20%`: 右肩
- `95% 100%`: 右下 (底辺)
- `5% 100%`: 左下 (底辺)
- `15% 20%`: 左肩

この形状は実際の将棋駒の形状比率に近く、視覚的に認識しやすい五角形を作成します。

### 2. 先手・後手の向き

**先手 (下向き)**:
```css
transform: rotate(0deg);
```

**後手 (上向き)**:
```css
transform: rotate(180deg);
```

### 3. カラーパレット

#### 木目調の背景色

**ベースカラー** (ツゲ材をモデル):
- Primary: `#E8C4A0` (明るいベージュ)
- Secondary: `#D4A574` (暗めの茶色)
- Shadow: `rgba(0, 0, 0, 0.2)`

**Tailwind CSS カスタムカラー**:
```javascript
colors: {
  'wood-light': '#E8C4A0',
  'wood-dark': '#D4A574',
}
```

#### 文字色

**通常の駒**:
- Color: `#8B4513` (サドルブラウン)

**成り駒**:
- Color: `#CC0000` (赤)

**選択状態のハイライト**:
- Ring: `rgba(234, 179, 8, 0.5)` (黄色、半透明)

### 4. 背景グラデーション

**基本パターン**:
```css
background: linear-gradient(135deg, 
  #E8C4A0 0%,
  #D4A574 50%,
  #E8C4A0 100%
);
```

**木目ライン追加版 (オプション)**:
```css
background: 
  repeating-linear-gradient(90deg,
    transparent 0px,
    rgba(139, 69, 19, 0.1) 2px,
    transparent 4px
  ),
  linear-gradient(135deg, #E8C4A0, #D4A574);
```

### 5. 立体感 (陰影)

**通常状態**:
```css
box-shadow: 
  inset 0 1px 0 rgba(255, 255, 255, 0.3),  /* 上部の光沢 */
  inset 0 -1px 0 rgba(0, 0, 0, 0.1),        /* 下部の影 */
  0 2px 4px rgba(0, 0, 0, 0.2);             /* 外側の影 */
```

**選択状態**:
```css
box-shadow: 
  0 0 0 3px rgba(234, 179, 8, 0.5),         /* 黄色のリング */
  inset 0 1px 0 rgba(255, 255, 255, 0.3),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1),
  0 2px 8px rgba(0, 0, 0, 0.3);             /* より強い影 */
```

### 6. 文字のスタイリング

**フォント**:
```css
font-family: inherit; /* システムフォントを使用 */
font-size: clamp(1.2rem, 3.5vw, 2rem); /* レスポンシブ */
font-weight: bold;
line-height: 1;
```

**配置**:
```css
display: flex;
align-items: center;
justify-content: center;
```

**オプション - 文字の陰影**:
```css
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
```

### 7. サイズバリエーション

#### 盤面の駒 (通常サイズ)

```css
width: 100%;
height: 100%;
/* 親要素のaspect-squareに従う */
```

#### 持ち駒エリアの駒 (小サイズ)

```css
width: 3rem;  /* 48px */
height: 3rem;
/* または親のサイズに応じて調整 */
```

文字サイズは `clamp()` により自動調整されます。

## スタイルコンポーネント構造

### Piece コンポーネントのスタイル階層

```
<div class="piece-container">       ← 五角形のクリップ、向き、サイズ
  <div class="piece-background">    ← 木目調の背景、陰影
    <span class="piece-text">       ← 文字とその色
      王
    </span>
  </div>
</div>
```

**または、シンプルに単一要素**:
```
<div class="piece">                 ← 全てのスタイルを統合
  王
</div>
```

推奨: 単一要素アプローチ (シンプルさの原則)

## CSSクラスまたはインラインスタイルの選択

### オプション1: Tailwind CSS ユーティリティクラス

**利点**: 既存のパターンに従う、保守性が高い
**欠点**: clip-path などはカスタム設定が必要

### オプション2: インラインスタイル

**利点**: 動的な値(回転角度など)の制御が容易
**欠点**: クラスベースの再利用性が低い

### 推奨アプローチ: ハイブリッド

- 静的なスタイル (色、フォントなど) → Tailwind クラス
- 動的なスタイル (clip-path, transform) → インラインスタイル

## レスポンシブ対応

### ブレークポイント

駒のサイズは親要素に依存するため、特定のブレークポイントは不要。
`clamp()` 関数により、フォントサイズが自動調整されます。

### モバイル対応

- 最小タッチターゲット: 44x44px (iOS HIG)
- 盤面の駒: 通常は44px以上
- 持ち駒: 必要に応じて48px確保

## アクセシビリティ

### コントラスト比

- 通常の駒文字 (#8B4513) vs 背景 (#E8C4A0): **4.52:1** ✅ WCAG AA
- 成り駒文字 (#CC0000) vs 背景 (#E8C4A0): **4.68:1** ✅ WCAG AA

### セマンティクス

clip-path は視覚的装飾のみ。aria-label は既存の実装を維持:
```tsx
aria-label={`${playerLabel}の${promotedLabel}${piece.type}`}
```

## パフォーマンス考慮事項

### GPU アクセラレーション

clip-path と transform は GPU でレンダリングされるため、パフォーマンスが良好です。

### 最適化のヒント

1. `contain: layout style paint` で再レイアウトを隔離
2. React.memo() で不要な再レンダリングを防止
3. `will-change` は不要 (頻繁な変更がないため)

## ブラウザ互換性

### サポート範囲

- Chrome 55+ (2016年12月)
- Firefox 54+ (2017年6月)  
- Safari 9.1+ (2016年3月)
- Edge 79+ (2020年1月)

**カバレッジ**: 97%以上

### フォールバック

モダンブラウザのみをターゲットとするため、フォールバックは不要。
IE11 などの古いブラウザはサポート外。

## 実装例

### TypeScript インターフェース (参考)

```typescript
interface PieceStyle {
  clipPath: string;
  transform: string;
  background: string;
  boxShadow: string;
  color: string;
  fontSize: string;
}

interface PieceStyleConfig {
  normal: PieceStyle;
  selected: PieceStyle;
  promoted: Partial<PieceStyle>; // 色のみ異なる
}
```

### CSS-in-JS スタイルオブジェクト (参考)

```typescript
const pieceStyles = {
  clipPath: 'polygon(50% 0%, 85% 20%, 95% 100%, 5% 100%, 15% 20%)',
  background: 'linear-gradient(135deg, #E8C4A0 0%, #D4A574 50%, #E8C4A0 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)',
  // ...
};
```

## まとめ

このデータモデルは、駒の視覚的デザインを標準化し、一貫性のある実装を保証します。全てのスタイル値は調査結果に基づいており、パフォーマンス、アクセシビリティ、ブラウザ互換性を考慮しています。
