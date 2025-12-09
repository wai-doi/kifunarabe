# Tasks: 状態の自動保存

**Input**: Design documents from `/specs/009-auto-save-state/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/persistenceManager.md

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

**Feature**: ブラウザを閉じて再度開いたときに、ゲーム状態（盤面、持ち駒、手番、履歴）を自動的に復元する機能

**Tests**: この機能はテスト駆動開発（TDD）でテストを先に作成してから実装します。

**Organization**: タスクはユーザーストーリー（US1、US2、US3）ごとにグループ化されています。各ストーリーは独立してテスト・実装可能です。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並行実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（US1、US2、US3）
- タスク説明には正確なファイルパスを含む

## 実装戦略

**MVP**: User Story 1（ゲーム再開時の状態復元）のみで基本機能として完成
**漸進的デリバリー**: US1 → US2 → US3 の順に実装することで、各段階で動作する機能を提供

---

## Phase 1: Setup（共通インフラ）

**目的**: 型定義とテストセットアップ

- [ ] T001 [P] 永続化データの型定義を作成 `src/types/persistence.ts`
- [ ] T002 [P] テストヘルパー関数を作成 `tests/helpers/persistenceHelpers.ts`

---

## Phase 2: Foundational（必須の前提条件）

**目的**: すべてのユーザーストーリーが依存するpersistenceManager実装

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

### Tests for persistenceManager (TDD - 実装前にテスト作成)

- [ ] T003 [P] [FOUNDATION] persistenceManager のユニットテスト骨格を作成 `tests/logic/persistenceManager.test.ts`
- [ ] T004 [P] [FOUNDATION] saveGameState のテストケースを作成（正常系、容量超過、localStorage無効）
- [ ] T005 [P] [FOUNDATION] loadGameState のテストケースを作成（正常系、データなし、パースエラー、バリデーション失敗）
- [ ] T006 [P] [FOUNDATION] validatePersistedGameState のテストケースを作成（有効なデータ、必須フィールド欠如、型不一致、範囲外の値）
- [ ] T007 [P] [FOUNDATION] clearGameState のテストケースを作成

**Checkpoint**: すべてのテストが失敗することを確認（Red）

### Implementation for persistenceManager

- [ ] T008 [FOUNDATION] persistenceManager の基本構造を作成 `src/logic/persistenceManager.ts`
- [ ] T009 [FOUNDATION] validatePersistedGameState 関数を実装（T006のテストが通るまで）
- [ ] T010 [FOUNDATION] saveGameState 関数を実装（T004のテストが通るまで）
- [ ] T011 [FOUNDATION] loadGameState 関数を実装（T005のテストが通るまで）
- [ ] T012 [FOUNDATION] clearGameState 関数を実装（T007のテストが通るまで）
- [ ] T013 [FOUNDATION] エラーハンドリングとロギングを追加

**Checkpoint**: すべてのテストが成功することを確認（Green） - ユーザーストーリーの実装を開始可能

---

## Phase 3: User Story 1 - ゲーム再開時の状態復元 (Priority: P1) 🎯 MVP

**Goal**: ブラウザを閉じて再度開いたときに、閉じる前の盤面、持ち駒、手番が復元される

**Independent Test**: 駒を動かし、ブラウザを閉じて再度開く。同じ盤面が表示されれば成功

**Acceptance Scenarios**:
1. 駒を動かして盤面を変更 → 状態が変更される
2. ブラウザタブを閉じて再度開く → 閉じる前の状態が復元される
3. ブラウザを完全に終了して再起動 → 状態が正確に復元される

### Tests for User Story 1 (TDD - 実装前にテスト作成)

- [ ] T014 [US1] ShogiBoard の統合テスト骨格を作成 `tests/components/ShogiBoard.test.tsx`
- [ ] T015 [US1] 初回マウント時に loadGameState が呼ばれるテストを作成
- [ ] T016 [US1] 保存データがない場合は初期配置を表示するテストを作成
- [ ] T017 [US1] 保存データがある場合は復元されるテストを作成
- [ ] T018 [US1] 駒移動後に saveGameState が呼ばれるテストを作成
- [ ] T019 [US1] アンマウント→再マウントで状態が復元されるテストを作成

**Checkpoint**: すべてのテストが失敗することを確認（Red）

### Implementation for User Story 1

- [ ] T020 [US1] ShogiBoard に persistenceManager をインポート `src/components/ShogiBoard.tsx`
- [ ] T021 [US1] マウント時に状態を復元する useEffect を追加（T015-T017が通るまで）
- [ ] T022 [US1] 状態変更時に自動保存する useEffect を追加（T018-T019が通るまで）
- [ ] T023 [US1] 初回マウント時の保存スキップロジックを追加
- [ ] T024 [US1] エラー時のフォールバック処理を追加

**Checkpoint**: User Story 1 が完全に機能し、独立してテスト可能

**🎯 この時点でMVPが完成 - 基本的な状態保存・復元機能が動作**

---

## Phase 4: User Story 2 - 自動保存の透明性 (Priority: P2)

**Goal**: ユーザーが保存操作を意識せず、駒を動かすたびに自動的に状態が保存される

**Independent Test**: 駒を動かした直後に開発者ツールでlocalStorageを確認。データが保存されていれば成功

**Acceptance Scenarios**:
1. 盤面上で駒を動かす → 即座に自動保存
2. 持ち駒を配置 → 新しい盤面状態が自動保存
3. 手番が切り替わる → 手番情報も含めて自動保存

**Note**: User Story 1の実装で自動保存機能は既に実装済み。このフェーズでは検証と最適化を行う

### Tests for User Story 2 (検証テスト)

- [ ] T025 [P] [US2] 自動保存のタイミング検証テストを作成 `tests/components/ShogiBoard.test.tsx`
- [ ] T026 [P] [US2] 持ち駒配置後の自動保存テストを作成
- [ ] T027 [P] [US2] 手番切り替え後の自動保存テストを作成
- [ ] T028 [P] [US2] 保存失敗時も通常動作を継続するテストを作成

**Checkpoint**: すべてのテストが失敗または未実装部分を特定（Red）

### Implementation for User Story 2

- [ ] T029 [US2] 自動保存の依存配列を検証・調整 `src/components/ShogiBoard.tsx`
- [ ] T030 [US2] 保存失敗時のエラーハンドリングを確認（T028が通るまで）
- [ ] T031 [US2] パフォーマンス検証（100ms以内の保存完了）
- [ ] T032 [US2] 必要に応じてデバウンスを追加（パフォーマンス問題がある場合のみ）

**Checkpoint**: User Story 2 が完全に機能し、自動保存の透明性が確保される

---

## Phase 5: User Story 3 - 履歴ナビゲーション後の状態保存 (Priority: P2)

**Goal**: 履歴ナビゲーションで過去の局面に戻った状態も保存・復元される

**Independent Test**: 複数手進め、履歴ナビゲーションで戻り、ブラウザを閉じて再度開く。戻した局面が表示されれば成功

**Acceptance Scenarios**:
1. 10手進んだ局面から5手前に戻る → 5手前が表示される
2. 過去の局面を表示中にブラウザを閉じて再度開く → 過去の局面が復元される
3. 復元後にナビゲーションボタンで手を進める → 履歴に従って次の局面が表示される
4. 履歴の途中から新しい手を指す → 新しい分岐が作成され保存される

### Tests for User Story 3 (TDD - 実装前にテスト作成)

- [ ] T033 [P] [US3] 履歴ナビゲーション後の保存テストを作成 `tests/components/ShogiBoard.test.tsx`
- [ ] T034 [P] [US3] 履歴情報（history配列とcurrentIndex）の保存テストを作成
- [ ] T035 [P] [US3] 履歴ナビゲーション後の復元テストを作成
- [ ] T036 [P] [US3] 復元後にナビゲーションボタンで手を進めるテストを作成
- [ ] T037 [P] [US3] 履歴の途中から新しい手を指した場合のテストを作成

**Checkpoint**: すべてのテストが失敗することを確認（Red）

### Implementation for User Story 3

- [ ] T038 [US3] history と currentIndex を保存対象に追加（既にUS1で実装済みか確認） `src/components/ShogiBoard.tsx`
- [ ] T039 [US3] loadGameState 時に history と currentIndex も復元（既にUS1で実装済みか確認）
- [ ] T040 [US3] 履歴ナビゲーション操作後の自動保存を確認（T033-T035が通るまで）
- [ ] T041 [US3] 履歴の途中から新しい手を指した場合の保存処理を確認（T037が通るまで）
- [ ] T042 [US3] エッジケース（履歴の最初・最後）のテストと実装

**Checkpoint**: User Story 3 が完全に機能し、履歴ナビゲーションと統合される

---

## Phase 6: Polish & Cross-Cutting Concerns（仕上げと横断的関心事）

**目的**: 品質向上、エラーケースの網羅、ドキュメント

- [ ] T043 [P] エッジケースのテストを追加（初回訪問、データ破損、容量超過、複数タブ、リロード） `tests/logic/persistenceManager.test.ts`
- [ ] T044 [P] パフォーマンステストを追加（100ms以内の保存、大きな履歴データ）
- [ ] T045 [P] コードコメントを日本語で追加 `src/logic/persistenceManager.ts`
- [ ] T046 [P] コードコメントを日本語で追加 `src/components/ShogiBoard.tsx`
- [ ] T047 エラーロギングの詳細度を確認・調整
- [ ] T048 テストカバレッジを確認（persistenceManager: 100%目標）
- [ ] T049 統合テストの実行と結果確認
- [ ] T050 ブラウザでの手動テスト（仕様書の受け入れシナリオをすべて実行）

**Final Checkpoint**: すべての機能が動作し、すべてのテストが成功し、ドキュメントが完成

---

## 依存関係グラフ（ユーザーストーリー完了順序）

```
Phase 1 (Setup) → Phase 2 (Foundation)
                        ↓
                  Phase 3 (US1) 🎯 MVP
                        ↓
                  Phase 4 (US2)
                        ↓
                  Phase 5 (US3)
                        ↓
                  Phase 6 (Polish)
```

**並行実行の機会**:
- Phase 1: T001とT002は並行実行可能
- Phase 2 Tests: T003-T007は並行実行可能
- Phase 3 Tests: T014-T019は並行実行可能（テスト作成）
- Phase 4 Tests: T025-T028は並行実行可能
- Phase 5 Tests: T033-T037は並行実行可能
- Phase 6: T043-T046は並行実行可能

**独立したテスト基準**:
- **US1**: 駒を動かし、ブラウザを閉じて再度開く → 状態が復元される
- **US2**: 開発者ツールでlocalStorageを確認 → データが自動保存されている
- **US3**: 履歴ナビゲーションで戻り、ブラウザを閉じて再度開く → 戻した局面が復元され、ナビゲーション可能

---

## タスクサマリー

- **Total tasks**: 50
- **Phase 1 (Setup)**: 2 tasks
- **Phase 2 (Foundation)**: 11 tasks (6 tests + 5 implementation)
- **Phase 3 (US1 - MVP)**: 11 tasks (6 tests + 5 implementation) 🎯
- **Phase 4 (US2)**: 8 tasks (4 tests + 4 implementation)
- **Phase 5 (US3)**: 10 tasks (5 tests + 5 implementation)
- **Phase 6 (Polish)**: 8 tasks

**並行実行可能タスク**: 24 tasks（[P]マーク付き）

**MVP推奨スコープ**: Phase 1 + Phase 2 + Phase 3 (US1) = 24 tasks
- これにより基本的な状態保存・復元機能が完成し、独立してテスト・デリバリー可能

**推定工数**:
- MVP（US1まで）: 1日
- US2追加: +0.5日
- US3追加: +0.5日
- Polish: +0.5日
- **合計**: 約2.5日

---

## 実装の進め方

### TDD（テスト駆動開発）サイクル

各フェーズで以下のサイクルを繰り返します：

1. **Red**: テストを書いて失敗させる（T003-T007, T014-T019など）
2. **Green**: テストが通る最小限の実装（T008-T013, T020-T024など）
3. **Refactor**: コードを改善（必要に応じて）
4. 次のフェーズへ

### チェックポイント

各フェーズの**Checkpoint**で以下を確認：
- すべてのテストが成功しているか
- ユーザーストーリーの受け入れ基準を満たしているか
- 独立してテスト可能か

### 完了の定義

各タスクは以下を満たした時点で完了：
- [ ] コードが実装されている
- [ ] 対応するテストがすべて成功している
- [ ] コードレビュー（憲法準拠確認）が完了している
- [ ] コメントが日本語で記述されている
