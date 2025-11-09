# Implementation Plan: 駒の捕獲機能

**Branch**: `005-piece-capture` | **Date**: 2025-11-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-piece-capture/spec.md`

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

将棋の基本ルールである駒の捕獲機能を実装する。プレイヤーが自分の駒を相手の駒が配置されているマス目に移動させたとき、その相手の駒を盤面から取り除き、取ったプレイヤーの持ち駒として記録する。持ち駒は盤面外の専用エリア(先手は盤面下部、後手は盤面上部)に駒の種類と数量を表示する。駒の捕獲後もターン制御は正しく機能し、手番が適切に交代する。既存の駒移動ロジック(003-piece-movement)とターン制御ロジック(004-turn-based-movement)に駒の捕獲処理を統合し、React Hooksで持ち駒の状態を管理する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1 (Hooks: useState), Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A (クライアント側の状態管理のみ、ページリロード時は初期状態にリセット)
**Testing**: Vitest (React Testing Library使用)
**Target Platform**: モダンブラウザ(Chrome、Firefox、Safari、Edge最新版)
**Project Type**: Webアプリケーション(フロントエンドのみ)
**Performance Goals**:
  - 駒の捕獲処理時間: 0.5秒以内
  - 持ち駒表示の更新: 即座に(100ms以内)
  - 視覚的フィードバック表示: 即座に(100ms以内)
**Constraints**:
  - 駒の捕獲処理の正確性: 100%(SC-002 - 取られた駒は100%の確率で取ったプレイヤーの持ち駒として記録される)
  - ターン制御の維持: 100%(SC-004 - 駒の捕獲後もターン制御が正しく機能し、手番が適切に交代する)
  - 持ち駒表示の正確性: 100%(SC-003 - 持ち駒は盤面上で視覚的に確認でき、種類と数量が正確に表示される)
**Scale/Scope**:
  - 持ち駒状態管理(先手/後手それぞれの持ち駒コレクション)
  - 持ち駒表示コンポーネント(盤面上部・下部配置)
  - 駒移動時の捕獲処理ロジック
  - 盤面状態更新処理(駒の削除と持ち駒への追加)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述される
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、品質チェックリスト完了済み
- [x] **テスト駆動**: テスト戦略が明確 - Vitestで駒の捕獲処理、持ち駒管理、持ち駒表示をテスト
- [x] **ドキュメント優先**: data-model.md(持ち駒エンティティ・ゲーム状態拡張), contracts/(コンポーネントインターフェース), quickstart.md(開発環境)を作成予定
- [x] **シンプルさ**: React Hooksの基本機能のみ使用、外部状態管理ライブラリ不使用、複雑性なし

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   ├── Board.tsx                   # (既存) 盤面コンポーネント - 駒の捕獲処理を統合
│   ├── Piece.tsx                   # (既存) 駒コンポーネント
│   ├── Square.tsx                  # (既存) マスコンポーネント
│   ├── ShogiBoard.tsx              # (既存) 将棋盤コンポーネント - 持ち駒状態を追加
│   ├── TurnDisplay.tsx             # (既存) ターン表示コンポーネント
│   └── CapturedPieces.tsx          # (新規) 持ち駒表示コンポーネント
├── logic/
│   ├── boardState.ts               # (既存) 盤面状態管理 - 駒の捕獲処理を追加
│   ├── moveRules.ts                # (既存) 駒の移動ルール
│   ├── turnControl.ts              # (既存) ターン制御ロジック
│   └── captureLogic.ts             # (新規) 駒の捕獲処理ロジック
├── types/
│   ├── board.ts                    # (既存) 盤面関連の型定義 - 持ち駒を追加
│   ├── piece.ts                    # (既存) 駒関連の型定義
│   ├── position.ts                 # (既存) 位置関連の型定義
│   ├── turn.ts                     # (既存) ターン関連の型定義
│   └── capturedPieces.ts           # (新規) 持ち駒関連の型定義
└── data/
    └── initialPosition.ts          # (既存) 初期配置データ

tests/
├── components/
│   ├── Board.test.tsx              # (既存) - 駒の捕獲テストを追加
│   ├── ShogiBoard.test.tsx         # (既存) - 持ち駒状態テストを追加
│   └── CapturedPieces.test.tsx     # (新規) 持ち駒表示コンポーネントのテスト
└── logic/
    ├── boardState.test.ts          # (既存) - 駒の捕獲処理テストを追加
    └── captureLogic.test.ts        # (新規) 駒の捕獲ロジックのテスト
```

**Structure Decision**: 既存のWebアプリケーション構造を維持し、駒の捕獲機能を統合する。新規ファイルは最小限(CapturedPieces.tsx、captureLogic.ts、capturedPieces.ts)とし、既存のファイルに機能を追加する形で実装する。これにより、既存の駒移動ロジック(003-piece-movement)とターン制御ロジック(004-turn-based-movement)との統合が容易になり、コードの一貫性が保たれる。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

複雑性の導入なし - React Hooksの基本機能のみを使用し、既存のアーキテクチャに統合する。

---

## Phase 0: Research

**ステータス**: ✅ 完了

**成果物**:
- `research.md` - 技術的決定事項を記録
  - 持ち駒の状態管理: React Hooks (useState)
  - 持ち駒のデータ構造: Map構造 `{ [PieceType]: number }`
  - 駒の捕獲処理のタイミング: 駒の移動処理中に統合
  - 持ち駒の表示配置: 先手は盤面下部、後手は盤面上部
  - 持ち駒の表示形式: 駒のアイコン + 数量(2個以上の場合)
  - 駒移動と捕獲の判定ロジック: captureLogic.ts に専用関数
  - テスト戦略: ユニット、コンポーネント、統合テスト
  - パフォーマンス最適化: 初期実装では最適化せず、必要に応じて対応

**未解決の懸念事項**: なし

---

## Phase 1: Design & Contracts

**ステータス**: ✅ 完了

**成果物**:
- `data-model.md` - エンティティとデータフロー定義
  - CapturedPiecesMap、CapturedPieces、GameState拡張、CapturedPiecesProps定義
  - 状態管理フロー、バリデーションルール、状態遷移記述
- `contracts/README.md` - コンポーネントとロジックの契約
  - CapturedPieces、ShogiBoard、Board のインターフェース
  - captureLogic.ts、boardState.ts の公開API
  - テスト契約、パフォーマンス契約、エラー処理契約
- `quickstart.md` - 開発環境セットアップガイド
  - セットアップ手順、TDDサイクル(Red-Green-Refactor)
  - 実装順序、デバッグ方法、よくある問題の解決策

**エージェントコンテキスト更新**: ✅ 完了
- GitHub Copilot context file を更新
- 技術スタック情報を追加

**憲法チェック(Phase 1後)**: ✅ 再確認完了
- [x] **日本語優先**: 全ドキュメントが日本語で記述済み
- [x] **Speckit準拠**: 仕様書承認済み、計画ドキュメント作成済み
- [x] **テスト駆動**: contracts/ でテスト契約を明確化、quickstart.md でTDDサイクル記述
- [x] **ドキュメント優先**: data-model.md、contracts/、quickstart.md を実装前に作成完了
- [x] **シンプルさ**: 複雑性なし、React Hooksの基本機能のみ使用

---

## Phase 2: Task Breakdown

**ステータス**: ⏳ 未着手

このフェーズは `/speckit.tasks` コマンドで実行されます。このコマンドは `/speckit.plan` の完了後に別途実行してください。
