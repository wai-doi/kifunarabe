# Implementation Plan: ターンベース駒移動制御

**Branch**: `004-turn-based-movement` | **Date**: 2025-11-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-turn-based-movement/spec.md`

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

将棋の基本ルールである先手と後手の交互着手を実装する。先手のターンには先手の駒のみ、後手のターンには後手の駒のみを動かせるよう制御し、現在のターンを盤面上部中央に視覚的に表示する。無効な操作(相手のターンに自分の駒を動かそうとする)には視覚的フィードバック(カーソル変化、選択不可表示等)とターン表示のアニメーション効果(軽い揺れや点滅)で応答する。駒の移動が成功すると自動的にターンが切り替わる。ページリロード時は初期状態(先手のターン、初期配置)にリセットされる。React Hooksでターン状態を管理し、既存の駒移動ロジック(003-piece-movement)に統合する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1 (Hooks: useState), Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A (クライアント側の状態管理のみ、ページリロード時は初期状態にリセット)
**Testing**: Vitest (React Testing Library使用)
**Target Platform**: モダンブラウザ(Chrome、Firefox、Safari、Edge最新版)
**Project Type**: Webアプリケーション(フロントエンドのみ)
**Performance Goals**:
  - ターン切り替え時間: 0.5秒以内(SC-002)
  - 視覚的フィードバック表示: 即座に(100ms以内)
  - アニメーション効果の実行: 即座に(100ms以内)
**Constraints**:
  - ターン制御の正確性: 100%(SC-001 - 相手のターンまたは相手の駒を動かそうとした場合、100%の確率で操作が拒否される)
  - 視覚的フィードバックの提供: 100%(SC-004)
  - ターン表示の視認性: ユーザーが自分のターンかどうかを即座に判断可能
**Scale/Scope**:
  - ターン状態管理(先手/後手の2状態)
  - ターン表示コンポーネント(盤面上部中央配置)
  - 駒選択時のターン検証ロジック
  - 無効操作時の視覚的フィードバック(カーソル変化、選択不可表示)
  - ターン表示のアニメーション効果(揺れ、点滅)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述される
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、明確化セッション完了済み
- [x] **テスト駆動**: テスト戦略が明確 - Vitestでターン状態管理、ターン検証ロジック、視覚的フィードバックをテスト
- [x] **ドキュメント優先**: data-model.md(ターン状態・ゲーム状態), contracts/(コンポーネントインターフェース), quickstart.md(開発環境)を作成予定
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
│   ├── Board.tsx              # (既存) 盤面コンポーネント - ターン検証を統合
│   ├── Piece.tsx              # (既存) 駒コンポーネント
│   ├── Square.tsx             # (既存) マスコンポーネント
│   ├── ShogiBoard.tsx         # (既存) 将棋盤コンポーネント - ターン状態を追加
│   └── TurnDisplay.tsx        # (新規) ターン表示コンポーネント
├── logic/
│   ├── boardState.ts          # (既存) 盤面状態管理 - ターン状態を統合
│   ├── moveRules.ts           # (既存) 駒の移動ルール
│   └── turnControl.ts         # (新規) ターン制御ロジック
├── types/
│   ├── board.ts               # (既存) 盤面関連の型定義
│   ├── piece.ts               # (既存) 駒関連の型定義 - Player型を追加
│   ├── position.ts            # (既存) 位置関連の型定義
│   └── turn.ts                # (新規) ターン関連の型定義
└── data/
    └── initialPosition.ts     # (既存) 初期配置データ

tests/
├── components/
│   ├── Board.test.tsx         # (既存) - ターン検証テストを追加
│   ├── ShogiBoard.test.tsx    # (既存) - ターン状態テストを追加
│   └── TurnDisplay.test.tsx   # (新規) ターン表示コンポーネントのテスト
└── logic/
    ├── boardState.test.ts     # (既存) - ターン状態管理テストを追加
    └── turnControl.test.ts    # (新規) ターン制御ロジックのテスト
```

**Structure Decision**: 既存のWebアプリケーション構造を維持し、ターン制御機能を統合する。新規ファイルは最小限(TurnDisplay.tsx、turnControl.ts、turn.ts)とし、既存のファイルに機能を追加する形で実装する。これにより、既存の駒移動ロジック(003-piece-movement)との統合が容易になり、コードの一貫性が保たれる。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

複雑性の導入なし - React Hooksの基本機能のみを使用し、既存のアーキテクチャに統合する。

---

## Phase 0: Research (完了)

**ステータス**: ✅ 完了

**成果物**:
- `research.md` - 技術的決定事項を記録
  - ターン状態管理: React Hooks (useState)
  - 視覚的フィードバック: Tailwind CSS + CSS アニメーション
  - ターン検証タイミング: 駒選択時(onClick)
  - ターン表示配置: 独立コンポーネント、盤面上部中央
  - アニメーション実装: CSS keyframes (shake, pulse)

**未解決の懸念事項**: なし

---

## Phase 1: Design & Contracts (完了)

**ステータス**: ✅ 完了

**成果物**:
- `data-model.md` - エンティティとデータフロー定義
  - Turn型、Player型、GameState拡張、TurnDisplayProps定義
  - 状態管理フロー、バリデーションルール記述
- `contracts/README.md` - コンポーネントとロジックの契約
  - TurnDisplay、Board、ShogiBoard のインターフェース
  - turnControl.ts、boardState.ts の公開API
  - テスト契約、パフォーマンス契約
- `quickstart.md` - 開発環境セットアップガイド
  - セットアップ手順、開発フロー、TDDサイクル
  - デバッグ方法、よくある問題の解決策

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

**次のステップ**: `/speckit.tasks` コマンドを実行してタスク分解を行う

このコマンドは以下を生成します:
- `tasks.md` - 実装タスクの詳細なチェックリスト
- 優先順位付けされたタスク
- 各タスクの受け入れ基準
- テスト駆動開発のガイド

---

## 実装準備完了

すべての計画ドキュメントが作成され、実装の準備が整いました。

**完了した成果物**:
1. ✅ `spec.md` - フェーチャー仕様書(明確化セッション完了)
2. ✅ `plan.md` - 実装計画(本ドキュメント)
3. ✅ `research.md` - 技術調査結果
4. ✅ `data-model.md` - データモデル定義
5. ✅ `contracts/README.md` - コンポーネント契約
6. ✅ `quickstart.md` - 開発環境ガイド
7. ✅ `.github/copilot-instructions.md` - エージェントコンテキスト更新

**次のアクション**:
```bash
# タスク分解を実行
/speckit.tasks

# または手動でタスクを開始する場合
npm test  # 既存のテストを確認
# TDD サイクルでタスクを実装開始
```
