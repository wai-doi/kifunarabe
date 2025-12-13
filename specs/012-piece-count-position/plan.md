# Implementation Plan: 持ち駒の数字表示位置変更

**Branch**: `012-piece-count-position` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-piece-count-position/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

同じ種類の持ち駒を複数持っている場合、その枚数を示す数字を駒の文字と同じ行ではなく、駒の右下に小さく配置して表示します。CapturedPieces.tsxコンポーネントを変更し、CSS position: absolute を使用して数字を駒の右下に配置します。数字のサイズは駒の文字の50-70%とし、色は木目調の背景に対してコントラストの高い濃い茶色やダークグレーを使用します。先手・後手に関係なく、常に画面上の物理的な右下に配置することで、視覚的な統一感を維持します。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16
**Storage**: N/A (フロントエンドのみの視覚的変更)
**Testing**: Vitest 3.2.4 + React Testing Library 16.3.0
**Target Platform**: モダンブラウザ (Chrome, Firefox, Safari, Edge 最新版)
**Project Type**: Web (単一プロジェクト - フロントエンドのみ)
**Performance Goals**: 数字の表示更新は50ms以内、再レンダリング時の遅延なし
**Constraints**: 五角形の駒の形状内に数字を配置、モバイルデバイスでも判読可能
**Scale/Scope**: CapturedPiecesコンポーネント1つの変更、約10-18個の持ち駒表示

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されている ✅
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在する ✅
- [x] **テスト駆動**: Vitestを使用した視覚的テストとスナップショットテスト戦略を計画。実装前にテストケースを作成 ✅
- [x] **ドキュメント優先**: data-model.md (レイアウト仕様)、contracts/layout-spec.md、quickstart.md を実装前に作成完了 ✅
- [x] **シンプルさ**: CSS position: absolute を使用したシンプルな実装。複雑性は最小限 ✅

**Phase 1 完了後の再確認**: 全ての原則に準拠しています。

## Project Structure

### Documentation (this feature)

```text
specs/012-piece-count-position/
├── spec.md              # 機能仕様書 (作成済み)
├── plan.md              # このファイル (実装計画)
├── research.md          # Phase 0 - 技術調査結果
├── data-model.md        # Phase 1 - レイアウト仕様とCSSパターン
├── quickstart.md        # Phase 1 - 開発者ガイド
├── contracts/           # Phase 1 - スタイルガイド
│   └── layout-spec.md   # 数字の配置仕様
└── tasks.md             # Phase 2 - タスク分解 (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── CapturedPieces.tsx   # 持ち駒コンポーネント (変更対象)
│   ├── Piece.tsx            # 駒コンポーネント (影響確認)
│   └── pieceStyle.ts        # 駒のスタイル定義 (影響確認)
└── types/
    └── capturedPieces.ts    # 持ち駒の型定義 (影響なし)

tests/
└── components/
    └── CapturedPieces.test.tsx  # 持ち駒コンポーネントのテスト (追加・更新)
```

**Structure Decision**: 既存の単一プロジェクト構造を維持。CapturedPieces.tsxを中心に変更し、他のコンポーネントへの影響を最小化。CSS position: absolute で数字の配置を実装。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*該当なし* - 全ての憲法原則に準拠しています。

## Implementation Approach

### Phase 0: Research (完了)

**成果物**: [research.md](./research.md)

技術調査を完了し、以下の決定を行いました:

1. **数字の配置方法**: CSS position: absolute を使用
   - 理由: シンプル、パフォーマンス良好、既存の五角形の駒と干渉しない
   - 実装: 駒のコンテナに `position: relative`、数字に `position: absolute`

2. **数字のフォントサイズ**: 駒の文字の60%
   - 理由: 視覚的な階層が明確、モバイルでも判読可能
   - 計算: `CAPTURED_FONT_SIZE * 0.6`

3. **数字の色**: `#5C4033` (濃い茶色)
   - 理由: 木目調の背景に対してコントラスト比 5.2:1 (WCAG AA合格)
   - 代替色: `#4A4A4A` (ダークグレー、コントラスト比 5.8:1)

4. **先手・後手の配置**: 常に画面上の物理的な右下
   - 理由: 視覚的な統一感、実装がシンプル
   - 駒の回転に影響されない

### Phase 1: Design & Contracts (完了)

**成果物**: 
- [data-model.md](./data-model.md) - レイアウト仕様とCSS定義
- [contracts/layout-spec.md](./contracts/layout-spec.md) - 契約仕様と数値定数
- [quickstart.md](./quickstart.md) - 開発者向けガイド

**データモデル**:
- 既存のデータモデル（CapturedPiecesMap）に変更なし
- レイアウト仕様のみを定義（CSS、配置、サイズ、色）

**契約**:
- CSS契約: 必須クラスとプロパティを定義
- 数値定数: フォントサイズ比、色、オフセット値
- レスポンシブ: デスクトップ、タブレット、モバイルの仕様
- アクセシビリティ: ARIA属性とコントラスト比

**エージェントコンテキスト更新**:
- `.github/copilot-instructions.md` に技術スタックを追加
- TypeScript 5.9.3 + React 19.1.1, Tailwind CSS 4.1.16 を記録

### Phase 2: Tasks (未実施 - /speckit.tasks コマンドで作成)

タスク分解は `/speckit.tasks` コマンドで実施します。このコマンドは Phase 1 完了後に実行してください。

## Next Steps

1. **タスク分解**: `/speckit.tasks` コマンドを実行して tasks.md を生成
2. **テスト作成**: CapturedPieces.test.tsx に新しいテストケースを追加
3. **実装**: quickstart.md の手順に従って実装
4. **レビュー**: コードレビューと憲法準拠の確認
5. **マージ**: PR を作成してメインブランチにマージ

## References

- [仕様書 (spec.md)](./spec.md)
- [技術調査 (research.md)](./research.md)
- [データモデル (data-model.md)](./data-model.md)
- [契約仕様 (contracts/layout-spec.md)](./contracts/layout-spec.md)
- [開発者ガイド (quickstart.md)](./quickstart.md)
- [憲法 (.specify/memory/constitution.md)](../../.specify/memory/constitution.md)
