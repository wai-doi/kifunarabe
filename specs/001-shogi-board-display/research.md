# Research: 将棋盤と駒の初期配置表示

**Date**: 2025-11-01
**Feature**: 001-shogi-board-display

## 調査項目

### 1. CSS GridとFlexboxの比較 - 将棋盤レイアウトに最適な選択

**Decision**: CSS Gridを使用

**Rationale**: 
- 9×9の均等なグリッドレイアウトを作成するにはCSS Gridが最適
- `display: grid; grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(9, 1fr);` で簡潔に表現可能
- マス目の配置を座標で指定しやすい(`grid-column`, `grid-row`)
- レスポンシブ対応が容易(`minmax()`関数で最小サイズを保証)
- Flexboxは1次元レイアウトに適しているが、2次元グリッドにはGridが適している

**Alternatives considered**:
- **Flexbox**: 1次元レイアウトのため、9行×9列の構造を作るには複雑なネスト構造が必要
- **HTML Table**: セマンティック的に不適切(データテーブルではない)、スタイリングが複雑
- **絶対配置**: レスポンシブ対応が困難、保守性が低い

### 2. 将棋駒のテキストレンダリング - フォントとサイズ調整

**Decision**: CSS `font-size: 70%; line-height: 1;` をマス目のコンテナに相対的に設定

**Rationale**:
- マス目のサイズに対して相対的に駒のサイズを調整できる
- `font-size: 70%` はマス目の高さの70%を意味するように、親要素に対する相対値として設定
- `line-height: 1` で行の高さを文字サイズと同じにし、中央配置を容易にする
- `display: flex; align-items: center; justify-content: center;` でマス目内に中央配置
- システムフォント(sans-serif)を使用し、追加のフォントファイルは不要

**Alternatives considered**:
- **固定ピクセルサイズ**: レスポンシブ対応が困難
- **vw/vh単位**: ビューポートサイズに依存し、将棋盤のサイズと連動しない
- **カスタムフォント**: 追加の読み込み時間、憲法のシンプルさ原則に反する

### 3. 駒の向き(先手・後手)の表現

**Decision**: CSS `transform: rotate(180deg)` で後手の駒を回転

**Rationale**:
- テキスト文字を使用するため、回転は最もシンプルな解決策
- `transform` はGPU加速され、パフォーマンスが良い
- 追加のDOM要素やアセットが不要
- アクセシビリティ: スクリーンリーダーはtransformを無視し、テキストをそのまま読み上げる

**Alternatives considered**:
- **異なるUnicode文字**: 先手・後手で別の文字を使用するのは複雑で保守性が低い
- **別コンポーネント**: コードの重複、保守性が低下
- **SVGアイコン**: 憲法のシンプルさ原則に反する、テキストの利点を失う

### 4. レスポンシブデザイン - 最小サイズの実装

**Decision**: `min-width: 300px; min-height: 300px; max-width: 90vmin; max-height: 90vmin;` を将棋盤コンテナに設定

**Rationale**:
- `vmin` (viewport minimum) を使用することで、縦横どちらが小さくても対応可能
- `90vmin` で画面の90%を使用し、余白を確保
- `min-width/height: 300px` で最小サイズを保証
- コンテナが最小サイズより小さい場合、自動的にスクロールバーが表示される
- メディアクエリ不要でシンプル

**Alternatives considered**:
- **メディアクエリ**: 複数のブレークポイントで異なるサイズを指定すると複雑になる
- **JavaScript**: 憲法のシンプルさ原則に反する、不要な複雑性
- **固定サイズ**: レスポンシブ対応不可

### 5. Tailwind CSS vs カスタムCSS

**Decision**: Tailwind CSSをメインとし、グリッドレイアウトなど特殊な部分のみカスタムCSS

**Rationale**:
- プロジェクトに既に導入済み(package.json確認済み)
- ユーティリティファーストで迅速な開発が可能
- 配色(`#D4A574`, `#8B4513`, `#C8B560`)はTailwindの`arbitrary values`で指定可能
- CSS Gridの複雑な設定(`repeat(9, 1fr)`)はカスタムクラスで定義
- 保守性とパフォーマンスのバランスが良い

**Alternatives considered**:
- **完全カスタムCSS**: Tailwindが既に導入済みなので、使わない理由がない
- **CSS Modules**: 小規模な機能には過剰、Tailwindで十分
- **Styled Components**: 追加の依存関係、憲法のシンプルさ原則に反する

### 6. 初期配置データの管理

**Decision**: TypeScriptの定数配列として `src/data/initialPosition.ts` に定義

**Rationale**:
- JSONファイルよりも型安全性が高い
- インポート時に型チェックが働く
- バンドルサイズへの影響が最小(静的データとしてインライン化)
- 40枚の駒の配置を配列として定義し、型定義で安全性を確保

**Alternatives considered**:
- **JSONファイル**: 型安全性がない、ランタイムでの解析が必要
- **APIから取得**: この機能ではサーバーサイドが不要、過剰な複雑性
- **ハードコード**: データと表示ロジックの分離ができない

### 7. テスト戦略 - Vitestの導入

**Decision**: Vitest + React Testing Libraryを使用

**Rationale**:
- ViteプロジェクトにネイティブにサポートされているVitestが最適
- React Testing Libraryでコンポーネントのレンダリングをテスト
- Jest互換のAPIで学習コストが低い
- 高速で、HMR(Hot Module Replacement)をサポート
- TypeScriptネイティブサポート

**Test Cases**:
1. Board: 81個のマス目が正しくレンダリングされるか
2. Square: 正しい背景色とボーダーが適用されているか
3. Piece: 駒の文字と色が正しく表示されるか、後手の駒が回転しているか
4. ShogiBoard: 40枚の駒が正しい位置に配置されているか
5. initialPosition: 初期配置データが40要素を持ち、重複がないか

**Alternatives considered**:
- **Jest**: Viteとの統合が複雑、追加の設定が必要
- **Cypress**: E2Eテストには適しているが、コンポーネントテストには過剰
- **テストなし**: 憲法のテスト駆動開発原則に違反

### 8. アクセシビリティ考慮事項

**Decision**: セマンティックHTML + ARIA属性で最小限の対応

**Rationale**:
- 将棋盤: `<div role="grid">` でグリッド構造を示す
- マス目: `<div role="gridcell">` で個別のセルを示す
- 駒: `aria-label="先手の王"`のような説明を追加
- テキストベースなのでスクリーンリーダーが自然に読み上げ可能
- 色のコントラスト比を確保(WCAG AA準拠)

**Alternatives considered**:
- **完全なWCAG AAA対応**: この段階では過剰、将来のフェーズで拡張可能
- **アクセシビリティ無視**: ベストプラクティスに反する

## 技術的決定のまとめ

| 項目 | 選択 | 理由 |
|------|------|------|
| レイアウト | CSS Grid | 2次元グリッドに最適 |
| 駒の表示 | テキスト + font-size: 70% | シンプルでレスポンシブ |
| 駒の向き | transform: rotate(180deg) | GPU加速、追加要素不要 |
| レスポンシブ | vmin + min-width/height | メディアクエリ不要 |
| スタイリング | Tailwind CSS + カスタムCSS | 既存構成を活用 |
| データ管理 | TypeScript定数 | 型安全性 |
| テスト | Vitest + RTL | Viteネイティブサポート |
| A11y | 最小限のARIA | 段階的な実装 |

## 未解決の技術的課題

なし - すべての技術的決定が完了した。
