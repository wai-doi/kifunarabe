# Tasks: 手順の巻き戻し・再生機能

**Input**: Design documents from `/specs/008-move-history-navigation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- All paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: プロジェクトの基本構造確認と必要な依存関係の確認

- [ ] T001 既存のプロジェクト構造を確認（src/, tests/ の配置）
- [ ] T002 TypeScript, React, Vitest の設定が正しいことを確認
- [ ] T003 [P] 既存のテストが正常に動作することを確認（npm test）

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべてのユーザーストーリーに必要な基盤コンポーネント

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの実装は開始できません

- [ ] T004 [P] 型定義ファイル `src/types/history.ts` を作成（HistoryEntry, GameHistory, NavigationState）
- [ ] T005 [P] 履歴管理ロジックのテストファイル `tests/logic/historyManager.test.ts` を作成（TDD: 最初は空のテスト）
- [ ] T006 履歴管理ロジック `src/logic/historyManager.ts` の基本構造を作成（空の関数エクスポート）

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの並行実装が可能

---

## Phase 3: User Story 1 - 一手戻る操作 (Priority: P1) 🎯 MVP

**Goal**: ユーザーが「一手戻る」ボタンで直前の手を取り消し、一手前の盤面・持ち駒・手番に戻れる

**Independent Test**: 3手進んだ後「一手戻る」をクリックすると2手目の状態に戻り、持ち駒や成り駒も正しく復元される

### Tests for User Story 1 (TDD - RED phase)

- [ ] T007 [P] [US1] `historyManager.test.ts` に `goToPrevious` 関数のテストを追加（境界値: 0手目で戻れない）
- [ ] T008 [P] [US1] `historyManager.test.ts` に履歴追加後に戻るテストを追加
- [ ] T009 [P] [US1] `historyManager.test.ts` に `canGoBack` 状態判定のテストを追加
- [ ] T010 [US1] テストを実行して RED（失敗）を確認

### Implementation for User Story 1 (TDD - GREEN phase)

- [ ] T011 [P] [US1] `src/logic/historyManager.ts` に `goToPrevious` 関数を実装
- [ ] T012 [P] [US1] `src/logic/historyManager.ts` に `getCurrentEntry` 関数を実装
- [ ] T013 [P] [US1] `src/logic/historyManager.ts` に `getNavigationState` 関数を実装（canGoBack のみ）
- [ ] T014 [US1] テストを実行して GREEN（成功）を確認
- [ ] T015 [P] [US1] NavigationControls コンポーネントのテストファイル `tests/components/NavigationControls.test.tsx` を作成
- [ ] T016 [P] [US1] `tests/components/NavigationControls.test.tsx` に「一手戻る」ボタンのレンダリングテストを追加
- [ ] T017 [P] [US1] `tests/components/NavigationControls.test.tsx` にボタン無効化状態のテストを追加
- [ ] T018 [US1] NavigationControls コンポーネントテストを実行して RED を確認
- [ ] T019 [US1] `src/components/NavigationControls.tsx` を作成（「一手戻る」ボタンのみ実装）
- [ ] T020 [US1] `src/components/ShogiBoard.tsx` に履歴状態（useState<GameHistory>）を追加
- [ ] T021 [US1] `src/components/ShogiBoard.tsx` に初期配置を履歴の最初のエントリとして記録
- [ ] T022 [US1] `src/components/ShogiBoard.tsx` の手を指すハンドラーに履歴記録処理を追加（addMove）
- [ ] T023 [US1] `src/components/ShogiBoard.tsx` に「一手戻る」ハンドラーを実装
- [ ] T024 [US1] `src/components/ShogiBoard.tsx` に盤面復元ロジック（restoreFromHistory）を実装
- [ ] T025 [US1] `src/components/ShogiBoard.tsx` から NavigationControls をレンダリング（「一手戻る」のみ表示）
- [ ] T026 [US1] すべてのテストが GREEN になることを確認
- [ ] T027 [US1] 手動テスト: 駒を3手動かして「一手戻る」で2手目に戻ることを確認
- [ ] T028 [US1] 手動テスト: 駒を取った後に戻ると盤面と持ち駒が正しく復元されることを確認
- [ ] T029 [US1] 手動テスト: 駒を成った後に戻ると成る前の状態に戻ることを確認

**Checkpoint**: User Story 1 が独立して動作可能 - MVP として出荷可能

---

## Phase 4: User Story 2 - 一手進む操作 (Priority: P1)

**Goal**: ユーザーが「一手進む」ボタンで戻った手順を一手ずつ再生できる

**Independent Test**: 5手目から3手目に戻った後「一手進む」で4手目に進み、最終手まで到達すると進めなくなる

### Tests for User Story 2 (TDD - RED phase)

- [ ] T030 [P] [US2] `historyManager.test.ts` に `goToNext` 関数のテストを追加（境界値: 最終手で進めない）
- [ ] T031 [P] [US2] `historyManager.test.ts` に戻った後に進むテストを追加
- [ ] T032 [P] [US2] `historyManager.test.ts` に `canGoForward` 状態判定のテストを追加
- [ ] T033 [US2] テストを実行して RED を確認

### Implementation for User Story 2 (TDD - GREEN phase)

- [ ] T034 [P] [US2] `src/logic/historyManager.ts` に `goToNext` 関数を実装
- [ ] T035 [P] [US2] `src/logic/historyManager.ts` の `getNavigationState` に `canGoForward` を追加
- [ ] T036 [US2] historyManager のテストが GREEN になることを確認
- [ ] T037 [P] [US2] `tests/components/NavigationControls.test.tsx` に「一手進む」ボタンのテストを追加
- [ ] T038 [US2] NavigationControls のテストを実行して RED を確認
- [ ] T039 [US2] `src/components/NavigationControls.tsx` に「一手進む」ボタンを追加
- [ ] T040 [US2] `src/components/ShogiBoard.tsx` に「一手進む」ハンドラーを実装
- [ ] T041 [US2] すべてのテストが GREEN になることを確認
- [ ] T042 [US2] 手動テスト: 5手進んで3手目に戻り、「一手進む」で4手目に進むことを確認
- [ ] T043 [US2] 手動テスト: 最終手で「一手進む」ボタンが無効化されることを確認

**Checkpoint**: User Stories 1 と 2 が両方動作 - 基本的な戻る/進む機能が完成

---

## Phase 5: User Story 3 - 初手に戻る操作 (Priority: P2)

**Goal**: ユーザーが「初手に戻る」ボタンで一度に初期配置に戻れる

**Independent Test**: 10手目から「初手に戻る」で即座に0手目（初期配置）に戻り、持ち駒が空になる

### Tests for User Story 3 (TDD - RED phase)

- [ ] T044 [P] [US3] `historyManager.test.ts` に `goToFirst` 関数のテストを追加
- [ ] T045 [P] [US3] `historyManager.test.ts` に初期配置で「初手に戻る」しても変わらないテストを追加
- [ ] T046 [US3] テストを実行して RED を確認

### Implementation for User Story 3 (TDD - GREEN phase)

- [ ] T047 [P] [US3] `src/logic/historyManager.ts` に `goToFirst` 関数を実装
- [ ] T048 [US3] historyManager のテストが GREEN になることを確認
- [ ] T049 [P] [US3] `tests/components/NavigationControls.test.tsx` に「初手に戻る」ボタンのテストを追加
- [ ] T050 [US3] NavigationControls のテストを実行して RED を確認
- [ ] T051 [US3] `src/components/NavigationControls.tsx` に「初手に戻る」ボタンを追加
- [ ] T052 [US3] `src/components/ShogiBoard.tsx` に「初手に戻る」ハンドラーを実装
- [ ] T053 [US3] すべてのテストが GREEN になることを確認
- [ ] T054 [US3] 手動テスト: 10手進んだ後「初手に戻る」で即座に初期配置に戻ることを確認
- [ ] T055 [US3] 手動テスト: 持ち駒がある状態から戻ると持ち駒が空になることを確認

**Checkpoint**: User Stories 1-3 が動作 - 戻る系の操作が完成

---

## Phase 6: User Story 4 - 最終手に進む操作 (Priority: P2)

**Goal**: ユーザーが「最終手に進む」ボタンで一度に最終手まで進める

**Independent Test**: 3手目から「最終手に進む」で即座に5手目（最終手）に進む

### Tests for User Story 4 (TDD - RED phase)

- [ ] T056 [P] [US4] `historyManager.test.ts` に `goToLast` 関数のテストを追加
- [ ] T057 [P] [US4] `historyManager.test.ts` に最終手で「最終手に進む」しても変わらないテストを追加
- [ ] T058 [US4] テストを実行して RED を確認

### Implementation for User Story 4 (TDD - GREEN phase)

- [ ] T059 [P] [US4] `src/logic/historyManager.ts` に `goToLast` 関数を実装
- [ ] T060 [US4] historyManager のテストが GREEN になることを確認
- [ ] T061 [P] [US4] `tests/components/NavigationControls.test.tsx` に「最終手に進む」ボタンのテストを追加
- [ ] T062 [US4] NavigationControls のテストを実行して RED を確認
- [ ] T063 [US4] `src/components/NavigationControls.tsx` に「最終手に進む」ボタンを追加
- [ ] T064 [US4] `src/components/NavigationControls.tsx` に現在手数の表示（"X手目 / Y手"）を追加
- [ ] T065 [US4] `src/components/ShogiBoard.tsx` に「最終手に進む」ハンドラーを実装
- [ ] T066 [US4] すべてのテストが GREEN になることを確認
- [ ] T067 [US4] 手動テスト: 3手目から「最終手に進む」で5手目に進むことを確認
- [ ] T068 [US4] 手動テスト: 初期配置から「最終手に進む」で最終手まで進むことを確認

**Checkpoint**: 全ユーザーストーリーが完成 - 4つのナビゲーションボタンがすべて動作

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 全体的な品質向上、エッジケースの処理、スタイリング

- [ ] T069 [P] 履歴の途中から新手を指した場合のテストを追加（`historyManager.test.ts`）
- [ ] T070 [P] `src/logic/historyManager.ts` に `addMove` 関数を実装（現在位置以降の履歴削除）
- [ ] T071 addMove のテストが GREEN になることを確認
- [ ] T072 [P] NavigationControls のスタイリングを改善（Tailwind CSS）
- [ ] T073 [P] ボタンのアクセシビリティ属性（aria-label）を追加・確認
- [ ] T074 [P] ボタンの無効化状態のスタイルを調整（disabled:bg-gray-300）
- [ ] T075 手動テスト: 3手目まで戻って新手を指すと4手目以降が削除されることを確認
- [ ] T076 [P] パフォーマンステスト: 100手以上の履歴で操作が1秒以内に完了することを確認
- [ ] T077 [P] 既存のすべてのテストが引き続き動作することを確認（リグレッションテスト）
- [ ] T078 [P] コード品質チェックを実行（`npm run check` で lint と format check）
- [ ] T079 コードレビュー: 日本語コメントの確認、型安全性の確認
- [ ] T080 最終統合テスト: すべてのナビゲーション操作を連続して実行
- [ ] T081 ドキュメント更新: README.md に機能説明を追加（任意）

---

## Dependencies & Parallel Execution

### User Story Completion Order

```
Phase 2 (Foundational)
    ↓
Phase 3 (US1: 一手戻る) ← MVP ここまでで出荷可能
    ↓
Phase 4 (US2: 一手進む) ← US1 と密接だが独立実装可能
    ↓
Phase 5 (US3: 初手に戻る) ← US1 に依存（goToPrevious の一般化）
    ↓
Phase 6 (US4: 最終手に進む) ← US2 に依存（goToNext の一般化）
    ↓
Phase 7 (Polish)
```

### Parallel Opportunities Per Phase

**Phase 2 (Foundational)**:
- T004, T005, T006 はすべて並行実行可能（異なるファイル）

**Phase 3 (User Story 1)**:
- Tests: T007, T008, T009 並行可能
- Implementation: T011, T012, T013 並行可能（同一ファイルの異なる関数）
- Component tests: T015, T016, T017 並行可能

**Phase 4 (User Story 2)**:
- Tests: T030, T031, T032 並行可能
- Implementation: T034, T035 並行可能
- Component tests: T037 単独

**Phase 5 (User Story 3)**:
- Tests: T044, T045 並行可能
- Implementation: T047 単独
- Component tests: T049 単独

**Phase 6 (User Story 4)**:
- Tests: T056, T057 並行可能
- Implementation: T059 単独
- Component tests: T061 単独

**Phase 7 (Polish)**:
- T069, T070, T072, T073, T074, T076, T077 すべて並行可能

## Implementation Strategy

### MVP (Minimum Viable Product)

**Scope**: Phase 3 (User Story 1) のみ
- 「一手戻る」機能だけで棋譜の確認という価値を提供
- 最小限のコード変更でリスク低減
- ユーザーフィードバックを早期に収集可能

**Delivery**: Phase 3 完了後、即座にレビュー・マージ可能

### Incremental Delivery

1. **Sprint 1**: Phase 2-3 (Foundational + US1) → MVP リリース
2. **Sprint 2**: Phase 4 (US2) → 戻る/進むの基本セット完成
3. **Sprint 3**: Phase 5-6 (US3-4) → ジャンプ機能追加
4. **Sprint 4**: Phase 7 (Polish) → 品質向上・最適化

### Testing Strategy

- **TDD サイクル**: 各タスクで Red → Green → Refactor
- **単体テスト**: `historyManager.ts` のロジック
- **コンポーネントテスト**: `NavigationControls.tsx` の UI
- **統合テスト**: `ShogiBoard.tsx` での全体動作
- **手動テスト**: 各ユーザーストーリーの Acceptance Scenarios

## Summary

- **Total Tasks**: 81
- **Task Count by User Story**:
  - Setup: 3 tasks
  - Foundational: 3 tasks
  - US1 (一手戻る): 23 tasks
  - US2 (一手進む): 14 tasks
  - US3 (初手に戻る): 12 tasks
  - US4 (最終手に進む): 13 tasks
  - Polish: 13 tasks

- **Parallel Opportunities**: 各フェーズで複数のタスクが並行実行可能
  - テストファイル作成は常に並行可能
  - 異なるファイルへの実装は並行可能
  - 同一ファイルでも異なる関数なら並行可能

- **Independent Test Criteria**:
  - US1: 3手進んで「一手戻る」で2手目に戻る
  - US2: 戻った後「一手進む」で次の手に進む
  - US3: 10手目から「初手に戻る」で0手目に戻る
  - US4: 3手目から「最終手に進む」で最終手に進む

- **MVP Scope**: User Story 1 のみ（Phase 3 完了時点で出荷可能）

- **Format Validation**: ✅ すべてのタスクがチェックリスト形式（`- [ ] [ID] [P?] [Story?] Description with file path`）に準拠
