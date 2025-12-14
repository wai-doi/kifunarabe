# Implementation Plan: 駒クリック時の選択ハイライト表示

**Branch**: `013-piece-click-highlight` | **Date**: 2025年12月14日 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-piece-click-highlight/spec.md`

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

盤上の駒をクリックしたときに、その駒が現在の手番で動かせる駒の場合のみ、マス目にオレンジ系または茶色系の枠を表示する機能を実装します。空マスや相手の駒をクリックした場合は何も表示しません。これにより、ユーザーは現在選択中の駒と、動かせる駒を直感的に理解できるようになります。

既存のReact + TypeScriptのコンポーネント構造を拡張し、選択状態の視覚的フィードバックを改善します。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16
**Storage**: N/A（クライアント側のステート管理のみ）
**Testing**: Vitest 3.2.4, @testing-library/react 16.3.0
**Target Platform**: Web ブラウザ（モダンブラウザ対応）
**Project Type**: フロントエンド単一プロジェクト（SPAアプリケーション）
**Performance Goals**: クリックから枠表示まで100ミリ秒以内のレスポンス
**Constraints**: 既存の駒移動・手番管理機能との統合、色覚特性への配慮（WCAGコントラスト基準）
**Scale/Scope**: 単一画面の視覚的フィードバック改善、約50-100行のコード変更

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されているか
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在するか
- [x] **テスト駆動**: テスト戦略が明確で、実装前のテスト作成が計画されているか（Phase 1で詳細化）
- [x] **ドキュメント優先**: 実装前に作成すべきドキュメント (data-model.md, contracts/) が特定されているか
- [x] **シンプルさ**: 複雑性の導入は Complexity Tracking セクションで正当化されているか（新規複雑性なし）

## Project Structure

### Documentation (this feature)

```text
specs/013-piece-click-highlight/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Board.tsx              # 盤面表示（選択枠のスタイル更新）
│   ├── Square.tsx             # マス目コンポーネント（選択状態の視覚表現）
│   └── ShogiBoard.tsx         # メインコンポーネント（選択ロジック更新）
├── logic/
│   └── selectionLogic.ts      # 新規：選択可否判定ロジック
├── types/
│   ├── selection.ts           # 選択状態の型定義（必要に応じて拡張）
│   ├── piece.ts               # 駒の型定義（既存）
│   └── turn.ts                # 手番の型定義（既存）
└── styles/                    # または Tailwind classes
    └── selection.css          # 選択枠のスタイル（必要な場合）

tests/
├── components/
│   ├── Board.test.tsx         # 選択枠表示のテスト
│   └── Square.test.tsx        # マス目の視覚状態テスト
└── logic/
    └── selectionLogic.test.ts # 選択可否判定のテスト
```

**Structure Decision**: フロントエンド単一プロジェクト構造。既存のコンポーネント（Board.tsx, Square.tsx, ShogiBoard.tsx）を拡張し、新規に選択ロジックモジュール（selectionLogic.ts）を追加します。視覚的な変更が主であるため、UIコンポーネント層への変更が中心となります。

## Complexity Tracking

複雑性の導入はありません。既存の選択状態管理を活用し、視覚的フィードバックの条件を追加するのみです。

## Phase 0: Research（完了）

**成果物**: [research.md](./research.md)

**調査内容**:
- 既存の選択状態管理の仕組み
- 手番と駒の所有者の判定方法
- Tailwind CSSでの枠色の実装方法
- 既存のSquare.tsxコンポーネントの構造
- パフォーマンス最適化の検討
- テスト戦略

**主要な決定事項**:
- 選択可否判定関数: `canSelectPiece(piece, currentTurn)`
- 選択枠のスタイル: `border-4 border-orange-600` (Tailwindクラス)
- 既存の状態管理を活用（新規状態追加なし）
- TDD方式での実装（単体テスト → 統合テスト）

## Phase 1: Design & Contracts（完了）

**成果物**:
- [data-model.md](./data-model.md)
- [contracts/api-contracts.md](./contracts/api-contracts.md)
- [quickstart.md](./quickstart.md)

**データモデル**:
- 既存のエンティティ（Piece, Player, Turn, Selection）を活用
- 新規エンティティなし
- 選択状態の遷移図を定義

**API契約**:
- `canSelectPiece` 関数のシグネチャと動作仕様
- Square.tsxのプロップス変更（スタイルのみ）
- ShogiBoard.tsxの統合ポイント

**開発ガイド**:
- TDDに基づく8ステップの実装手順
- テストケースの具体例
- トラブルシューティングガイド

## Constitution Check（Phase 1後の再評価）

Phase 1完了後の憲法原則への準拠状況:

- [x] **日本語優先**: すべてのドキュメント（research.md, data-model.md, contracts/, quickstart.md）が日本語で記述された
- [x] **Speckit準拠**: 仕様書を基にしたプロセスに従い、各フェーズのドキュメントを作成した
- [x] **テスト駆動**: quickstart.mdにTDD方式の実装手順を詳細に記載した
- [x] **ドキュメント優先**: 実装前にすべての設計ドキュメントが完成した
- [x] **シンプルさ**: 新規複雑性なし、既存構造を最大限活用

**評価**: すべての憲法原則に準拠しています。実装準備が整いました。

## Phase 2: Task Breakdown

Phase 2は `/speckit.tasks` コマンドで実行します。このコマンドは以下を生成します:

- `tasks.md`: 実装タスクの詳細な分解
- チェックリスト: 各タスクの完了基準

**注意**: `/speckit.plan` コマンドはPhase 1までで終了します。

## 実装準備状況

### 完了した準備

✅ 仕様書の作成と承認 (spec.md)
✅ 技術調査の完了 (research.md)
✅ データモデルの設計 (data-model.md)
✅ API契約の定義 (contracts/)
✅ 開発ガイドの作成 (quickstart.md)
✅ エージェントコンテキストの更新 (.github/copilot-instructions.md)

### 次のステップ

1. **タスク分解**: `/speckit.tasks` コマンドを実行して tasks.md を生成
2. **実装開始**: quickstart.md に従ってTDD方式で実装
3. **テスト実行**: `npm test` で全テストを確認
4. **品質チェック**: `npm run check` でLint/Format確認
5. **プルリクエスト**: レビュー依頼

## リスク管理

| リスク | 確率 | 影響 | 緩和策 |
|--------|------|------|--------|
| 既存の選択ロジックとの競合 | 低 | 中 | 単体テストで事前検証 + コードレビュー |
| パフォーマンス劣化 | 低 | 低 | 単純な条件分岐のみ、最適化済み |
| アクセシビリティ問題 | 低 | 中 | WCAGコントラスト基準を検証済み |
| 手番切り替え時のバグ | 低 | 中 | 統合テストでシナリオ検証 |

## 見積もり

**開発時間**: 2-3時間

内訳:
- ロジック実装（selectionLogic.ts）: 30分
- コンポーネント更新（Square.tsx, ShogiBoard.tsx）: 1時間
- テスト作成と実行: 1時間
- 手動テストと調整: 30分

**難易度**: 低（既存構造への小規模な追加）

## 参考資料

- [Tailwind CSS Documentation - Border Color](https://tailwindcss.com/docs/border-color)
- [React Testing Library - User Interactions](https://testing-library.com/docs/user-event/intro/)
- [Vitest - Getting Started](https://vitest.dev/guide/)
- プロジェクト憲法: `.specify/memory/constitution.md`

## 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|----------|
| 2025-12-14 | 1.0 | 初版作成（Phase 0-1完了） |
