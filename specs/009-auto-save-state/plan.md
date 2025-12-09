# Implementation Plan: 状態の自動保存

**Branch**: `009-auto-save-state` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-auto-save-state/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

ブラウザを閉じて再度開いたときに、閉じる前の盤面、持ち駒、手番、履歴が自動的に復元される機能を実装する。ユーザーは保存ボタンなどの操作を一切せずに、シームレスに対局を再開できる。ブラウザのlocalStorageを使用して状態を永続化し、React HooksのuseEffectで自動保存を実現する。

## Technical Context

**Language/Version**: TypeScript 5.9.3 + React 19.1.1
**Primary Dependencies**: React Hooks (useState, useEffect), ブラウザ標準API (localStorage)
**Storage**: localStorage (ブラウザ標準API)
**Testing**: Vitest + React Testing Library
**Target Platform**: モダンブラウザ (localStorage対応)
**Project Type**: Web (フロントエンドのみ、Vite + React SPA)
**Performance Goals**: 100ミリ秒以内の自動保存、ページ読み込み時の即座の状態復元
**Constraints**: localStorageの容量制限（通常5-10MB）、JSON直列化可能なデータ構造
**Scale/Scope**: 単一ユーザー、単一ブラウザタブの状態管理（タブ間同期は対象外）

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
specs/009-auto-save-state/
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
├── components/          # 既存のReactコンポーネント
│   └── ShogiBoard.tsx   # 状態保存・復元のフックを統合
├── logic/               # ビジネスロジック
│   ├── boardState.ts
│   ├── historyManager.ts
│   └── persistenceManager.ts  # 新規: 状態の保存・復元ロジック
├── types/               # TypeScript型定義
│   ├── board.ts
│   ├── history.ts
│   └── persistence.ts   # 新規: 永続化データの型定義
└── data/
    └── initialPosition.ts

tests/
├── components/
│   └── ShogiBoard.test.tsx  # 自動保存・復元の統合テスト
└── logic/
    └── persistenceManager.test.ts  # 永続化ロジックのユニットテスト
```

**Structure Decision**: 既存のWeb applicationの単一プロジェクト構造を継続。新規ファイルは最小限（persistenceManager.ts、persistence.ts）とし、既存のShogiBoard.tsxに統合する。

## Constitution Check (再評価)

*Phase 1設計完了後の再評価*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: すべてのドキュメント（research.md, data-model.md, contracts/, quickstart.md）が日本語で記述されている
- [x] **Speckit準拠**: 仕様書 (spec.md) → 実装計画 (plan.md) → 設計ドキュメントの順序で作成完了
- [x] **テスト駆動**: テスト戦略が明確（ユニットテスト + 統合テスト）、契約仕様にテストケースが定義されている
- [x] **ドキュメント優先**: 実装前のドキュメントがすべて作成完了（data-model.md, contracts/persistenceManager.md, quickstart.md）
- [x] **シンプルさ**: 
  - 新規ファイル2つのみ（persistenceManager.ts, persistence.ts）
  - 既存ファイル1つの変更のみ（ShogiBoard.tsx）
  - 新規依存関係なし（ブラウザ標準APIのみ使用）
  - 複雑性の導入なし → Complexity Trackingセクション不要

**結論**: すべての憲法原則に準拠しています。Phase 2（タスク分解）に進む準備ができています。

## Complexity Tracking

**該当なし**: この機能では憲法違反や過度な複雑性の導入はありません。

## 次のステップ

Phase 1（設計フェーズ）が完了しました。次は `/speckit.tasks` コマンドでPhase 2（タスク分解）に進みます。

### 作成されたドキュメント

- ✅ `plan.md`: 実装計画（このファイル）
- ✅ `research.md`: 技術調査結果
- ✅ `data-model.md`: データモデル定義
- ✅ `contracts/persistenceManager.md`: API契約仕様
- ✅ `quickstart.md`: 実装ガイド

### 更新されたファイル

- ✅ `.github/copilot-instructions.md`: エージェントコンテキスト更新

### 実装の準備状況

- **技術スタック**: 既存のTypeScript + React環境で実装可能
- **新規依存関係**: なし
- **リスク**: 低（シンプルな実装、既存機能への影響最小限）
- **テスト戦略**: 明確（ユニット + 統合）
- **推定工数**: 小（1-2日）
