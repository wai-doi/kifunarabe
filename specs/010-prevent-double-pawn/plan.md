# Implementation Plan: 二歩禁止ルール

**Branch**: `010-prevent-double-pawn` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-prevent-double-pawn/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

二歩禁止ルールを実装し、プレイヤーが同じ筋に2つ目の歩を打つことを防ぐ。既存の`dropLogic.ts`の`canDropPiece`関数を拡張し、歩を打つ際に同じ筋に未成の歩が存在するかを検証する。検証に失敗した場合はエラーメッセージを表示し、打つ操作を拒否する。また、歩を選択した際に打てる候補マスを視覚的にハイライト表示する機能も含む。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Vite 7.1.7
**Storage**: N/A（クライアント側の状態管理のみ）
**Testing**: Vitest 3.2.4 + @testing-library/react 16.3.0
**Target Platform**: モダンブラウザ（Chrome, Firefox, Safari最新版）
**Project Type**: Web application (フロントエンドのみのSPA)
**Performance Goals**: 二歩検証は50ミリ秒以内、UIのレスポンス遅延なし
**Constraints**: 既存の駒打ちロジックとの互換性維持、履歴ナビゲーション機能との統合
**Scale/Scope**: 単一フィーチャー、既存コードベースへの小規模な追加（100-200行程度）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されているか
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在するか
- [x] **テスト駆動**: テスト戦略が明確で、実装前のテスト作成が計画されているか
- [x] **ドキュメント優先**: 実装前に作成すべきドキュメント (data-model.md, contracts/) が特定されているか
- [x] **シンプルさ**: 複雑性の導入は Complexity Tracking セクションで正当化されているか

## Project Structure

### Documentation (this feature)

```text
specs/010-prevent-double-pawn/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── doublePawnValidation.ts  # 二歩検証の関数シグネチャ
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Board.tsx              # 既存: ボードコンポーネント（打てる候補表示ロジック追加）
│   ├── CapturedPieces.tsx     # 既存: 持ち駒表示（変更なし）
│   └── Square.tsx             # 既存: マス目コンポーネント（ハイライト表示）
├── logic/
│   ├── dropLogic.ts           # 拡張: canDropPiece関数に二歩検証追加
│   ├── doublePawnValidation.ts # 新規: 二歩判定ロジック
│   └── boardState.ts          # 既存: 盤面状態管理（参照のみ）
├── types/
│   └── validation.ts          # 新規: 検証結果の型定義
└── App.tsx                    # 既存: メインアプリ（エラーメッセージ表示追加）

tests/
├── logic/
│   ├── dropLogic.test.ts      # 拡張: 二歩関連のテスト追加
│   └── doublePawnValidation.test.ts # 新規: 二歩判定ロジックのユニットテスト
└── components/
    └── Board.test.tsx         # 拡張: 視覚的表示のテスト追加
```

**Structure Decision**: 既存のWeb applicationの構造を維持。`src/logic/`に新しい検証ロジックを追加し、既存の`dropLogic.ts`を拡張する。UIコンポーネントは最小限の変更で対応。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

該当なし（全ての憲法チェック項目に合格）

## Constitution Check (Phase 1後の再評価)

*Phase 1 (データモデル・契約仕様作成) 完了後の最終確認*

以下の憲法原則への準拠を再確認:

- [x] **日本語優先**: 
  - ✅ research.md、data-model.md、quickstart.md、contracts/ 全て日本語で記述
  - ✅ 契約仕様のJSDocコメントも日本語
  - ✅ エラーメッセージも日本語（「二歩は反則です」）

- [x] **Speckit準拠**: 
  - ✅ spec.md が存在し、承認済み
  - ✅ plan.md（このファイル）が作成され、Technical Contextが明確
  - ✅ Phase 1の全ドキュメントが完成（research.md、data-model.md、contracts/、quickstart.md）

- [x] **テスト駆動**: 
  - ✅ quickstart.mdでTDDアプローチを明記
  - ✅ テスト作成が実装前に計画されている
  - ✅ ユニットテスト、統合テスト、手動テストの戦略が定義されている
  - ✅ 目標カバレッジ（90%以上）を設定

- [x] **ドキュメント優先**: 
  - ✅ data-model.md: 全てのエンティティと関係性を定義
  - ✅ contracts/: 関数シグネチャと契約を実装前に確定
  - ✅ quickstart.md: 開発者向けガイドを提供
  - ✅ research.md: 技術的意思決定の背景を記録

- [x] **シンプルさ**: 
  - ✅ 既存コードの最小限の変更で実装可能
  - ✅ 複雑なキャッシュ機構を導入せず、線形スキャンで性能要件を満たす
  - ✅ オプショナルパラメータで後方互換性を維持
  - ✅ 新規ファイルは2つのみ（validation.ts、doublePawnValidation.ts）

**結論**: 全ての憲法原則に準拠しており、実装フェーズに進む準備が整っています。

## 次のステップ

1. `/speckit.tasks`コマンドを実行してタスク分解（tasks.md）を生成
2. 生成されたタスクに従ってTDD方式で実装を開始
3. 各タスク完了後にテストを実行し、品質を確認
4. 全タスク完了後にPRを作成し、レビューを依頼

## Phase Summary

- **Phase 0 (Research)**: ✅ 完了 - research.md生成、全ての技術的不明点を解決
- **Phase 1 (Design)**: ✅ 完了 - data-model.md、contracts/、quickstart.md生成
- **Phase 2 (Tasks)**: ⏳ 未実施 - `/speckit.tasks`コマンドで実行
