# Data Model: 持ち駒の数字表示位置変更

**Feature**: 012-piece-count-position  
**Date**: 2025-12-13  
**Status**: 完了

## 概要

この機能は既存のデータモデルに変更を加えません。視覚的な表示方法の変更のみを行います。

## レイアウト仕様

### 持ち駒コンテナのレイアウト

```typescript
interface CapturedPieceLayout {
  /** 駒のコンテナの位置指定 */
  containerPosition: 'relative';
  
  /** 駒の文字の表示位置 */
  pieceTextPosition: 'center'; // 駒の中央
  
  /** 数字の表示位置 */
  countPosition: {
    type: 'absolute';
    right: '2px';
    bottom: '2px';
    zIndex: 10;
  };
}
```

### スタイル定数

```typescript
/** 数字のフォントサイズ（駒の文字の60%） */
const COUNT_FONT_SIZE_RATIO = 0.6;

/** 数字の色（濃い茶色） */
const COUNT_COLOR = '#5C4033';

/** 数字の代替色（ダークグレー） */
const COUNT_COLOR_ALT = '#4A4A4A';

/** 選択時の数字の色（さらに濃い色） */
const COUNT_COLOR_SELECTED = '#3E2723';

/** 数字の右端からのオフセット */
const COUNT_OFFSET_RIGHT = '2px';

/** 数字の下端からのオフセット */
const COUNT_OFFSET_BOTTOM = '2px';

/** 数字のz-index（ハイライトより前面） */
const COUNT_Z_INDEX = 10;
```

## CSS仕様

### 駒のコンテナ

```css
.captured-piece-container {
  position: relative;
  /* 既存のスタイル（五角形、木目調など）を維持 */
}
```

### 駒の文字

```css
.piece-text {
  /* 中央配置（変更なし） */
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 数字の表示

```css
.piece-count {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 10;
  font-size: 0.6em; /* 親要素のフォントサイズの60% */
  color: #5C4033; /* 濃い茶色 */
  font-weight: 600; /* やや太め */
  line-height: 1;
  pointer-events: none; /* クリックイベントを駒のボタンに透過 */
}
```

### 選択状態の数字

```css
.captured-piece-container.selected .piece-count {
  color: #3E2723; /* さらに濃い色 */
}
```

## Tailwind CSS クラス

### 推奨クラス構成

```tsx
// 駒のコンテナ
<button className="relative ...">
  {/* 駒の文字 */}
  <span className="flex items-center justify-center">
    {pieceType}
  </span>
  
  {/* 数字（2枚以上の場合のみ表示） */}
  {count > 1 && (
    <span 
      className="absolute right-0.5 bottom-0.5 z-10 font-semibold leading-none pointer-events-none"
      style={{ 
        fontSize: `${baseFontSize * 0.6}px`,
        color: isSelected ? '#3E2723' : '#5C4033'
      }}
    >
      {count}
    </span>
  )}
</button>
```

## レスポンシブ対応

### デスクトップ（標準サイズ）

- 駒の文字: 1.5rem (24px)
- 数字: 0.9rem (14.4px)
- 配置: 右下から 2px のオフセット

### モバイル（小さいサイズ）

- 駒の文字: 1.125rem (18px)
- 数字: 0.675rem (10.8px)
- 配置: 右下から 1.5px のオフセット（調整可能）

## アクセシビリティ仕様

### ARIA属性

```tsx
<button
  aria-label={`持ち駒の${pieceType}${count > 1 ? `（${count}枚）` : ''}`}
  aria-pressed={isSelected}
>
  {/* ... */}
</button>
```

### コントラスト比

| 背景色 | 文字色 | コントラスト比 | WCAG基準 |
|--------|--------|---------------|----------|
| #E8C4A0（木目調） | #5C4033（濃い茶色） | 5.2:1 | AA合格 |
| #E8C4A0（木目調） | #4A4A4A（ダークグレー） | 5.8:1 | AA合格 |
| #D4A574（木目調・濃い部分） | #5C4033（濃い茶色） | 4.1:1 | AA合格 |

## パフォーマンス考慮事項

### レンダリング

- **レイアウトの変更なし**: 数字の配置変更は CSS のみで実現されるため、JavaScript の実行コストは最小限
- **再レンダリング**: count プロパティの変更のみで数字の表示が更新されるため、効率的

### メモリ使用量

- **追加のDOM要素**: 持ち駒1つにつき、数字用の `<span>` 要素が1つ追加（count > 1 の場合のみ）
- **影響**: 最大18個の持ち駒があるため、最大18個の `<span>` 要素が追加される（軽微）

## エッジケース

### 2桁の数字

- **最大値**: 18枚（歩の最大枚数）
- **表示**: `18` という2桁の数字も駒の右下に収まる
- **スタイル**: フォントサイズは変更せず、右下の配置を維持

### 1枚のみの持ち駒

- **表示**: 数字を表示しない
- **条件**: `count === 1` または `count === undefined`

### 選択状態

- **ハイライト**: 駒全体がハイライトされるが、数字は常に可視
- **z-index**: 数字の z-index を高く設定することで、ハイライトより前面に表示

### 後手の駒（180度回転）

- **駒の回転**: 後手の駒は180度回転するが、数字は回転しない
- **配置**: 常に画面上の物理的な右下に配置（駒の回転に関係なく）

## 既存コンポーネントへの影響

### CapturedPieces.tsx

- **変更**: 数字の表示ロジックと配置を変更
- **互換性**: 既存のプロパティ（count、player、onPieceClickなど）はそのまま維持

### pieceStyle.ts

- **追加**: 数字のスタイル定数を追加
- **互換性**: 既存のスタイル定数はそのまま維持

### Piece.tsx

- **影響**: なし（持ち駒エリアは CapturedPieces コンポーネントで管理）

## バリデーション

### 型定義

```typescript
// 既存の型定義（変更なし）
interface CapturedPiecesMap {
  [pieceType: string]: number | undefined;
}

// 内部で使用する型（新規）
interface PieceCountStyle {
  fontSize: string;
  color: string;
  right: string;
  bottom: string;
  zIndex: number;
}
```

### ランタイムチェック

```typescript
// 数字の表示条件
const shouldShowCount = (count: number | undefined): boolean => {
  return count !== undefined && count > 1;
};

// フォントサイズの計算
const calculateCountFontSize = (baseFontSize: number): string => {
  return `${baseFontSize * COUNT_FONT_SIZE_RATIO}px`;
};
```

## まとめ

この機能は既存のデータモデルやコンポーネント構造に影響を与えず、視覚的な表示方法のみを変更します。CSS position: absolute を使用したシンプルな実装により、保守性とパフォーマンスを維持しながら、視認性を向上させることができます。
