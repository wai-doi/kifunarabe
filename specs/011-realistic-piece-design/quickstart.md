# Quick Start: リアルな将棋駒デザイン実装ガイド

**Date**: 2025-12-10
**Feature**: 011-realistic-piece-design

## 概要

このガイドでは、駒を本物のような五角形の形状で表示する機能を実装する手順を説明します。既存のPiece.tsxコンポーネントを更新し、CSS clip-pathとグラデーションを使用して、木目調の質感と立体感を追加します。

## 前提条件

- プロジェクトが正常にビルド・実行できる状態であること
- 既存のテストが全てパスしていること
- 以下のドキュメントを読んでいること:
  - [spec.md](./spec.md) - 機能仕様
  - [research.md](./research.md) - 技術調査結果
  - [data-model.md](./data-model.md) - スタイル仕様
  - [contracts/style-guide.md](./contracts/style-guide.md) - スタイルガイド

## 開発環境のセットアップ

### 1. ブランチの確認

```bash
git branch
# 現在のブランチが 011-realistic-piece-design であることを確認
```

### 2. 依存関係の確認

```bash
npm install
# 既存の依存関係はそのまま使用 (新規パッケージ不要)
```

### 3. 開発サーバーの起動

```bash
npm run dev
# ブラウザで http://localhost:5173 を開く
```

### 4. テストの実行

```bash
npm test
# 既存のテストが全てパスすることを確認
```

## 実装手順

### Phase 1: 五角形の形状実装

#### ステップ 1.1: Piece.tsx の基本構造を更新

**ファイル**: `src/components/Piece.tsx`

**目標**: 駒に五角形の形状を適用する

**変更内容**:
1. インラインスタイルで clip-path を追加
2. 先手・後手で transform を制御

**実装例**:
```tsx
const Piece = ({ piece, isSelected = false }: PieceProps) => {
  const displayText = getPieceDisplayText(piece);
  
  // 五角形の形状
  const clipPath = 'polygon(50% 0%, 85% 20%, 95% 100%, 5% 100%, 15% 20%)';
  
  // 先手・後手の向き
  const rotation = piece.player === 'gote' ? 'rotate(180deg)' : 'rotate(0deg)';
  
  return (
    <div
      style={{
        clipPath,
        transform: rotation,
        // ... その他のスタイル
      }}
    >
      {displayText}
    </div>
  );
};
```

#### ステップ 1.2: テストケースの作成

**ファイル**: `tests/components/Piece.test.tsx`

**追加するテスト**:
```tsx
describe('Piece - 五角形の形状', () => {
  it('clip-pathが適用されている', () => {
    const { container } = render(
      <Piece piece={{ type: '王', player: 'sente', promoted: false }} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.clipPath).toContain('polygon');
  });

  it('先手の駒は回転していない', () => {
    const { container } = render(
      <Piece piece={{ type: '王', player: 'sente', promoted: false }} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('rotate(0deg)');
  });

  it('後手の駒は180度回転している', () => {
    const { container } = render(
      <Piece piece={{ type: '王', player: 'gote', promoted: false }} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('rotate(180deg)');
  });
});
```

#### ステップ 1.3: テストの実行と確認

```bash
npm test -- Piece.test.tsx
# 新しいテストが失敗することを確認 (Red)
```

#### ステップ 1.4: 実装

Piece.tsxを更新し、テストをパスさせる。

```bash
npm test -- Piece.test.tsx
# テストがパスすることを確認 (Green)
```

#### ステップ 1.5: ブラウザで確認

開発サーバーで表示を確認:
- 全ての駒が五角形の形状で表示されているか
- 先手の駒は下向き、後手の駒は上向きか

### Phase 2: 木目調の質感実装

#### ステップ 2.1: 背景グラデーションの追加

**変更内容**:
1. background プロパティにグラデーションを追加
2. 既存の bg-amber-100 クラスを削除 (競合を避けるため)

**実装例**:
```tsx
const backgroundStyle = 'linear-gradient(135deg, #E8C4A0 0%, #D4A574 50%, #E8C4A0 100%)';

<div
  style={{
    clipPath,
    transform: rotation,
    background: backgroundStyle,
    // ...
  }}
>
```

#### ステップ 2.2: テストケースの追加

```tsx
it('木目調の背景が適用されている', () => {
  const { container } = render(
    <Piece piece={{ type: '王', player: 'sente', promoted: false }} />
  );
  const element = container.firstChild as HTMLElement;
  expect(element.style.background).toContain('linear-gradient');
  expect(element.style.background).toContain('#E8C4A0');
});
```

#### ステップ 2.3: 実装と確認

```bash
npm test -- Piece.test.tsx
# テストがパスすることを確認
```

### Phase 3: 立体感の追加

#### ステップ 3.1: box-shadow の実装

**変更内容**:
1. 通常状態の陰影を追加
2. 選択状態で追加の陰影を適用

**実装例**:
```tsx
const normalShadow = `
  inset 0 1px 0 rgba(255, 255, 255, 0.3),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1),
  0 2px 4px rgba(0, 0, 0, 0.2)
`;

const selectedShadow = `
  0 0 0 3px rgba(234, 179, 8, 0.5),
  inset 0 1px 0 rgba(255, 255, 255, 0.3),
  inset 0 -1px 0 rgba(0, 0, 0, 0.1),
  0 2px 8px rgba(0, 0, 0, 0.3)
`;

const boxShadow = isSelected ? selectedShadow : normalShadow;

<div
  style={{
    clipPath,
    transform: rotation,
    background: backgroundStyle,
    boxShadow,
    // ...
  }}
>
```

#### ステップ 3.2: テストケースの追加

```tsx
it('立体感の陰影が適用されている', () => {
  const { container } = render(
    <Piece piece={{ type: '王', player: 'sente', promoted: false }} />
  );
  const element = container.firstChild as HTMLElement;
  expect(element.style.boxShadow).toContain('inset');
});

it('選択状態で追加の陰影が適用されている', () => {
  const { container } = render(
    <Piece piece={{ type: '王', player: 'sente', promoted: false }} isSelected={true} />
  );
  const element = container.firstChild as HTMLElement;
  expect(element.style.boxShadow).toContain('rgba(234, 179, 8, 0.5)');
});
```

### Phase 4: 文字色と成り駒の対応

#### ステップ 4.1: 文字色の更新

**変更内容**:
1. 通常の駒: `#8B4513` (茶色)
2. 成り駒: `#CC0000` (赤色)

**実装例**:
```tsx
const textColor = piece.promoted ? '#CC0000' : '#8B4513';

<div
  style={{
    clipPath,
    transform: rotation,
    background: backgroundStyle,
    boxShadow,
    color: textColor,
    // ...
  }}
>
```

#### ステップ 4.2: テストケースの追加

```tsx
it('通常の駒は茶色で表示される', () => {
  const { container } = render(
    <Piece piece={{ type: '王', player: 'sente', promoted: false }} />
  );
  const element = container.firstChild as HTMLElement;
  expect(element.style.color).toBe('rgb(139, 69, 19)'); // #8B4513
});

it('成り駒は赤色で表示される', () => {
  const { container } = render(
    <Piece piece={{ type: '竜', player: 'sente', promoted: true }} />
  );
  const element = container.firstChild as HTMLElement;
  expect(element.style.color).toBe('rgb(204, 0, 0)'); // #CC0000
});
```

### Phase 5: 最終調整と検証

#### ステップ 5.1: 全体のテスト実行

```bash
npm test
# 全てのテストがパスすることを確認
```

#### ステップ 5.2: リント・フォーマット確認

```bash
npm run check
# ESLintとPrettierのチェックが通ることを確認
```

#### ステップ 5.3: ブラウザでの総合確認

以下の項目を確認:
- [ ] 全ての駒が五角形の形状で表示されている
- [ ] 先手の駒は下向き、後手の駒は上向き
- [ ] 木目調の背景が表示されている
- [ ] 立体感を示す陰影が適用されている
- [ ] 文字が中央に配置され、読みやすい
- [ ] 通常の駒は茶色、成り駒は赤色
- [ ] 選択状態で黄色のハイライトが表示される
- [ ] 持ち駒エリアでも同じスタイルが適用されている
- [ ] 駒の選択、移動、成りなど既存の機能が動作する
- [ ] モバイル表示でも問題なく表示される

#### ステップ 5.4: パフォーマンス確認

ブラウザの開発者ツールで確認:
- 描画時間が1フレーム (16.67ms) 以内であるか
- メモリ使用量が適切か

## トラブルシューティング

### 問題: clip-path が適用されない

**原因**: ブラウザのバージョンが古い可能性

**解決策**:
1. ブラウザを最新版にアップデート
2. Chrome DevTools でスタイルが適用されているか確認

### 問題: 文字がclip-pathで切れる

**原因**: padding や font-size の調整が必要

**解決策**:
1. font-size を clamp() で調整
2. padding を追加して文字の領域を確保

### 問題: 選択状態のハイライトが見えない

**原因**: box-shadow の順序が間違っている

**解決策**:
1. 選択状態の影を最初に配置
2. `0 0 0 3px rgba(234, 179, 8, 0.5)` が最初に来るように

### 問題: パフォーマンスが悪い

**原因**: 不要な再レンダリング

**解決策**:
1. React.memo() でコンポーネントをメモ化
2. インラインスタイルを useMemo() でメモ化

## 次のステップ

実装が完了したら:

1. コミット
   ```bash
   git add .
   git commit -m "feat: 駒を五角形の形状で表示、木目調の質感を追加"
   ```

2. テストカバレッジの確認
   ```bash
   npm run test:coverage
   ```

3. `/speckit.tasks` コマンドでタスク分解を実行
   - より詳細な実装タスクに分解
   - 各タスクを個別にコミット

4. プルリクエストの作成
   - 仕様書とこのガイドへのリンクを含める
   - スクリーンショットを添付

## 参考資料

- [spec.md](./spec.md) - 機能仕様
- [research.md](./research.md) - 技術調査
- [data-model.md](./data-model.md) - スタイル仕様
- [contracts/style-guide.md](./contracts/style-guide.md) - スタイルガイド
- [MDN: clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
- [MDN: linear-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient)
- [MDN: box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)

## まとめ

このガイドに従うことで、駒を本物のような五角形の形状で表示し、木目調の質感と立体感を追加できます。テスト駆動開発のアプローチに従い、各フェーズでテストを書いてから実装を進めてください。
