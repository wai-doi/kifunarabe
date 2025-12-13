# Quickstart: 持ち駒の数字表示位置変更

**Feature**: 012-piece-count-position  
**Date**: 2025-12-13  
**Target**: 開発者

## 概要

このガイドでは、持ち駒の数字表示位置を変更する実装方法を説明します。数字を駒の文字と同じ行ではなく、駒の右下に小さく配置します。

## 前提条件

- Node.js 20以上
- npm 10以上
- TypeScript 5.9.3
- React 19.1.1
- Tailwind CSS 4.1.16

## クイックスタート

### 1. 開発環境のセットアップ

```bash
# リポジトリのクローン（既にクローン済みの場合はスキップ）
cd /path/to/kifunarabe

# ブランチのチェックアウト
git checkout 012-piece-count-position

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 2. 変更対象のファイル

主な変更対象は以下の1つのファイルです:

```
src/components/CapturedPieces.tsx  # 持ち駒コンポーネント
```

関連ファイル（影響確認）:

```
src/components/pieceStyle.ts       # スタイル定数（必要に応じて追加）
```

### 3. 実装の概要

#### Before（現在の実装）

```tsx
{count !== undefined && count > 1 && (
  <span className="text-sm font-medium text-amber-700">×{count}</span>
)}
```

駒の文字と数字が同じ行に表示されます:

```
┌────────────────┐
│   歩  ×3       │ ← 文字と数字が横並び
└────────────────┘
```

#### After（変更後の実装）

```tsx
{count !== undefined && count > 1 && (
  <span 
    className="absolute right-0.5 bottom-0.5 z-10 font-semibold leading-none pointer-events-none"
    style={{ 
      fontSize: `${CAPTURED_FONT_SIZE * 0.6}px`,
      color: '#5C4033'
    }}
  >
    {count}
  </span>
)}
```

数字が駒の右下に配置されます:

```
┌────────────────┐
│      歩        │ ← 文字は中央
│            3   │ ← 数字は右下
└────────────────┘
```

### 4. 実装手順

#### Step 1: 駒のコンテナに `position: relative` を追加

CapturedPieces.tsx の駒のボタン要素に `relative` クラスを追加（既に存在する可能性あり）:

```tsx
<button
  className="relative ..." // 'relative' を追加
  // ...
>
```

#### Step 2: 数字の表示ロジックを変更

現在の実装:

```tsx
<span className="text-sm font-medium text-amber-700">×{count}</span>
```

変更後:

```tsx
<span 
  className="absolute right-0.5 bottom-0.5 z-10 font-semibold leading-none pointer-events-none"
  style={{ 
    fontSize: `${CAPTURED_FONT_SIZE * 0.6}px`,
    color: '#5C4033'
  }}
>
  {count}
</span>
```

変更点:
- `×` 記号を削除
- `absolute` クラスで絶対配置
- `right-0.5 bottom-0.5` で右下に配置
- `z-10` でハイライトより前面に表示
- フォントサイズを駒の文字の60%に設定
- 色を濃い茶色 (#5C4033) に変更

#### Step 3: 選択状態のスタイルを調整（オプション）

選択時に数字の色を変更する場合:

```tsx
style={{ 
  fontSize: `${CAPTURED_FONT_SIZE * 0.6}px`,
  color: isSelected ? '#3E2723' : '#5C4033' // 選択時は濃い色
}}
```

### 5. テストの実行

```bash
# ユニットテストの実行
npm test

# 特定のテストファイルのみ実行
npm test CapturedPieces

# カバレッジ付きでテスト実行
npm run test:coverage
```

### 6. 視覚的な確認

開発サーバーを起動して、ブラウザで確認:

```bash
npm run dev
```

http://localhost:5173 にアクセスして、以下を確認:

- [ ] 持ち駒が2枚以上の場合、数字が駒の右下に表示される
- [ ] 持ち駒が1枚の場合、数字が表示されない
- [ ] 数字のサイズが駒の文字よりも小さい
- [ ] 数字の色が木目調の背景に対してコントラストがある
- [ ] 選択状態でも数字が見える
- [ ] 2桁の数字（10枚以上）も適切に表示される

## 開発のヒント

### スタイル定数の管理

pieceStyle.ts に数字のスタイル定数を追加すると、再利用しやすくなります:

```typescript
// pieceStyle.ts
export const COUNT_FONT_SIZE_RATIO = 0.6;
export const COUNT_COLOR = '#5C4033';
export const COUNT_COLOR_SELECTED = '#3E2723';
```

CapturedPieces.tsx で使用:

```tsx
import { COUNT_FONT_SIZE_RATIO, COUNT_COLOR, COUNT_COLOR_SELECTED } from './pieceStyle';

// ...
style={{ 
  fontSize: `${CAPTURED_FONT_SIZE * COUNT_FONT_SIZE_RATIO}px`,
  color: isSelected ? COUNT_COLOR_SELECTED : COUNT_COLOR
}}
```

### レスポンシブ対応

モバイルデバイスで数字が小さすぎる場合、メディアクエリで調整:

```tsx
<span 
  className="absolute right-0.5 bottom-0.5 z-10 font-semibold leading-none pointer-events-none
             sm:text-[0.6em] text-[0.65em]" // モバイルでは65%
  style={{ color: '#5C4033' }}
>
  {count}
</span>
```

### デバッグ

数字の配置を視覚的に確認する際は、一時的に背景色を追加:

```tsx
<span 
  className="absolute right-0.5 bottom-0.5 z-10 bg-red-200" // デバッグ用
  style={{ fontSize: `${CAPTURED_FONT_SIZE * 0.6}px` }}
>
  {count}
</span>
```

## トラブルシューティング

### 数字が表示されない

- `position: relative` が駒のコンテナに設定されているか確認
- `count > 1` の条件が正しいか確認
- `z-index` が十分に高いか確認

### 数字が駒の外に表示される

- `right` と `bottom` の値を調整（例: `right-1 bottom-1`）
- 五角形の clip-path が数字を隠していないか確認

### 数字が読みにくい

- 色のコントラスト比を確認（最低 4.5:1）
- フォントサイズを調整（60% → 65%）
- font-weight を増やす（600 → 700）

### 選択状態で数字が見えない

- `z-index` を高くする（10 → 20）
- 選択時の色を調整（#3E2723 → #000000）

## コードレビューのチェックリスト

実装後、以下を確認してください:

- [ ] 憲法の「日本語優先」原則に準拠（コメントは日本語）
- [ ] 憲法の「シンプルさ」原則に準拠（過度な抽象化なし）
- [ ] テストが追加・更新されている
- [ ] data-model.md、contracts/、quickstart.md と整合性がある
- [ ] ESLint エラーがない（`npm run lint`）
- [ ] Prettier でフォーマット済み（`npm run format`）
- [ ] 既存のテストがすべてパスする（`npm test`）

## 次のステップ

実装が完了したら:

1. **テストの追加**: CapturedPieces.test.tsx に新しいテストケースを追加
2. **ビジュアル確認**: 各ブラウザで表示を確認
3. **コードレビュー**: PR を作成してレビューを依頼
4. **ドキュメント更新**: 必要に応じて README.md を更新

## 参考資料

- [spec.md](./spec.md) - 機能仕様書
- [plan.md](./plan.md) - 実装計画
- [research.md](./research.md) - 技術調査結果
- [data-model.md](./data-model.md) - レイアウト仕様
- [contracts/layout-spec.md](./contracts/layout-spec.md) - 契約仕様

## サポート

質問や問題がある場合は、以下を確認してください:

1. このquickstart.mdの「トラブルシューティング」セクション
2. research.md の技術決定の理由
3. contracts/layout-spec.md の詳細な仕様

それでも解決しない場合は、プロジェクトのIssueを作成してください。
