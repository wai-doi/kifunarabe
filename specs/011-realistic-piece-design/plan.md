# Implementation Plan: リアルな将棋駒デザイン

**Branch**: `011-realistic-piece-design` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-realistic-piece-design/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

駒の表示を本物の将棋駒のような五角形の形状に変更し、木目調の質感と立体感を追加します。既存のPiece.tsxコンポーネントを拡張し、CSS clip-pathまたはSVGを使用して五角形の形状を実現します。先手・後手の向きの違い、成り駒の赤色表示、選択状態のハイライト、持ち駒エリアでの表示など、既存の全ての機能と互換性を維持しながら、視覚的なデザインを向上させます。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16
**Storage**: N/A (フロントエンドのみの視覚的変更)
**Testing**: Vitest 3.2.4 + React Testing Library 16.3.0
**Target Platform**: モダンブラウザ (Chrome, Firefox, Safari, Edge 最新版)
**Project Type**: Web (単一プロジェクト - フロントエンドのみ)
**Performance Goals**: 40個の駒を60fpsで描画、再レンダリング時の遅延なし
**Constraints**: CSS clip-pathまたはSVGでブラウザ互換性を維持、モバイルデバイスでも視認可能
**Scale/Scope**: 駒コンポーネント1つと関連スタイルの変更、約40個の駒インスタンス表示

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されている ✅
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在する ✅
- [x] **テスト駆動**: Vitestを使用したビジュアルリグレッションテスト戦略を計画。実装前にテストケースを作成 ✅
- [x] **ドキュメント優先**: data-model.md (スタイル定義)、contracts/style-guide.md、quickstart.md を実装前に作成完了 ✅
- [x] **シンプルさ**: CSS clip-pathを優先、複雑なSVGは使用しない。複雑性は最小限 ✅

**Phase 1 完了後の再確認**: 全ての原則に準拠しています。

## Project Structure

### Documentation (this feature)

```text
specs/011-realistic-piece-design/
├── spec.md              # 機能仕様書 (作成済み)
├── plan.md              # このファイル (実装計画)
├── research.md          # Phase 0 - 技術調査結果
├── data-model.md        # Phase 1 - スタイル仕様とCSSパターン
├── quickstart.md        # Phase 1 - 開発者ガイド
├── contracts/           # Phase 1 - スタイルガイド・デザイントークン
│   └── style-guide.md   # 駒のビジュアル仕様
└── tasks.md             # Phase 2 - タスク分解 (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Piece.tsx            # 駒コンポーネント (変更対象)
│   ├── Square.tsx           # マスコンポーネント (影響確認)
│   ├── CapturedPieces.tsx   # 持ち駒コンポーネント (影響確認)
│   └── ShogiBoard.tsx       # 盤面コンポーネント (影響確認)
├── types/
│   └── piece.ts             # 駒の型定義 (影響なし)
└── index.css                # グローバルスタイル (必要に応じて追加)

tests/
├── components/
│   └── Piece.test.tsx       # 駒コンポーネントのテスト (追加・更新)
└── helpers/
    └── testUtils.tsx        # テストユーティリティ (必要に応じて)
```

**Structure Decision**: 既存の単一プロジェクト構造を維持。Piece.tsxを中心に変更し、他のコンポーネントへの影響を最小化。CSSモジュールやインラインスタイルで五角形の形状を実装。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*該当なし* - 全ての憲法原則に準拠しています。

## Implementation Approach

### Phase 0: Research (完了)

**成果物**: [research.md](./research.md)

技術調査を完了し、以下の決定を行いました:

1. **五角形の形状**: CSS clip-path を使用
   - 理由: シンプル、パフォーマンス良好、ブラウザ互換性97%+
   - 座標: `polygon(50% 0%, 85% 20%, 95% 100%, 5% 100%, 15% 20%)`

2. **木目調の質感**: CSS グラデーション
   - ベースカラー: `#E8C4A0` (ツゲ材)
   - `linear-gradient` で自然な陰影

3. **立体感**: box-shadow + inset shadow
   - 外側の影で浮き上がり効果
   - 内側の光沢で質感

4. **パフォーマンス**: 40個の駒で ~0.5ms (再描画)

### Phase 1: Design & Contracts (完了)

**成果物**:
- [data-model.md](./data-model.md) - スタイル仕様
- [contracts/style-guide.md](./contracts/style-guide.md) - ビジュアルガイド
- [quickstart.md](./quickstart.md) - 開発者ガイド

以下を定義しました:

1. **デザイントークン**: 色、形状、サイズの標準化
2. **視覚的状態**: 通常、選択、成り駒のスタイル
3. **レスポンシブ対応**: clamp() による自動調整
4. **アクセシビリティ**: WCAG AA準拠のコントラスト比

### Phase 2: Implementation (次のステップ)

**実装順序** (quickstart.mdに詳述):

1. **五角形の形状**
   - Piece.tsx に clip-path 適用
   - 先手・後手の transform 制御
   - テストケース作成・実行

2. **木目調の質感**
   - background グラデーション追加
   - 既存の bg クラスを削除
   - ビジュアル確認

3. **立体感**
   - box-shadow 実装
   - 選択状態のハイライト
   - テスト実行

4. **文字色**
   - 通常の駒: 茶色
   - 成り駒: 赤色
   - 最終確認

### 実装の原則

1. **テスト駆動**: 各フェーズでテストを先に書く (Red → Green → Refactor)
2. **インクリメンタル**: 小さな変更を積み重ねる
3. **後方互換性**: 既存の機能 (選択、移動、成り) を破壊しない
4. **シンプルさ**: インラインスタイルで実装、追加ライブラリ不要

### 影響を受けるコンポーネント

| コンポーネント | 変更の種類 | 影響度 |
|--------------|----------|-------|
| Piece.tsx | 直接変更 | 高 |
| Square.tsx | 確認のみ | 低 |
| CapturedPieces.tsx | 確認のみ | 低 |
| ShogiBoard.tsx | 確認のみ | 低 |

### テスト戦略

**ユニットテスト** (Vitest + React Testing Library):
- 五角形の形状が適用されているか
- 先手・後手の向きが正しいか
- 木目調の背景が表示されているか
- 選択状態のスタイルが適用されているか
- 成り駒の色が正しいか

**ビジュアルテスト** (手動):
- ブラウザでの表示確認
- モバイルデバイスでの確認
- 既存機能の動作確認

**パフォーマンステスト**:
- 40個の駒の描画時間
- メモリ使用量

### リスクと軽減策

| リスク | 影響 | 軽減策 |
|--------|------|--------|
| clip-path のブラウザ互換性 | 中 | モダンブラウザのみサポート (97%+) |
| パフォーマンス低下 | 低 | GPU アクセラレーション、最小限の再レンダリング |
| 既存機能の破壊 | 中 | 全テスト実行、手動確認 |
| レスポンシブ対応の問題 | 低 | clamp() でフォントサイズ調整 |

## Next Steps

1. **/speckit.tasks コマンドを実行**
   - 詳細なタスクに分解
   - 各タスクに優先順位を付与

2. **実装開始**
   - quickstart.md のガイドに従う
   - 各フェーズでテストを実行

3. **レビュー**
   - コード品質チェック (npm run check)
   - 全テスト実行 (npm test)
   - ブラウザでの最終確認

4. **プルリクエスト作成**
   - スクリーンショット添付
   - 仕様書へのリンク

## References

- [spec.md](./spec.md) - 機能仕様書
- [research.md](./research.md) - 技術調査結果
- [data-model.md](./data-model.md) - スタイル仕様
- [contracts/style-guide.md](./contracts/style-guide.md) - ビジュアルガイド
- [quickstart.md](./quickstart.md) - 開発者ガイド
