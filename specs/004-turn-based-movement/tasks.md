# Tasks: ターンベース駒移動制御

**Feature**: 004-turn-based-movement | **Date**: 2025-11-02

**Input**: `/specs/004-turn-based-movement/`から設計ドキュメント
**Prerequisites**: plan.md (必須), spec.md (必須 - ユーザーストーリー用), research.md, data-model.md, contracts/

**Tests**: 仕様書でテスト要件が明記されているため、TDDアプローチで実装します。各ユーザーストーリーに対してテストを先に記述し、失敗を確認してから実装を進めます。

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーを独立して実装およびテストできるようになっています。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能(異なるファイル、依存関係なし)
- **[Story]**: タスクが属するユーザーストーリー(例: US1, US2, US3)
- 説明に正確なファイルパスを含む

## Path Conventions

本プロジェクトは単一プロジェクト構造を採用:
- `src/` - ソースコード
- `tests/` - テストコード

---

## Phase 1: Setup (共通インフラ)

**目的**: プロジェクト初期化と基本構造の準備

- [x] T001 プロジェクト構造を実装計画に従って確認(既存構造の検証)
- [x] T002 branch `004-turn-based-movement` の作成と切り替え
- [x] T003 [P] 既存のlintとフォーマット設定の確認

**Checkpoint**: プロジェクト環境準備完了 ✅

---

## Phase 2: Foundational (基盤実装 - 全ストーリーの前提条件)

**目的**: すべてのユーザーストーリーが依存するコアインフラの実装

**⚠️ CRITICAL**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

### 型定義の作成

- [x] T004 [P] `Turn` 型を定義 - `src/types/turn.ts` を新規作成
- [x] T005 [P] `GameState` 型を拡張 - `src/types/board.ts` に `currentTurn: Turn` フィールドを追加
- [x] T006 [P] `TurnDisplayProps` 型を定義 - T028で `src/components/TurnDisplay.tsx` 内に定義済み

### コアロジックの実装

- [x] T007 [P] ターン制御ロジックのテストを記述 - `tests/logic/turnControl.test.ts` を作成(RED段階)
- [x] T008 ターン制御ロジックを実装 - `src/logic/turnControl.ts` に `canSelectPiece`, `switchTurn`, `getTurnDisplayName` を実装(GREEN段階)
- [x] T009 既存の `boardState.ts` を拡張 - `src/logic/boardState.ts` の `createInitialGameState()` に `currentTurn: 'sente'` を追加

### 統合テスト基盤

- [x] T010 テストセットアップを確認 - `tests/setup.ts` が React Testing Library を正しく設定しているか確認

**Checkpoint**: 基盤準備完了 ✅ - ユーザーストーリーの並列実装が可能

---

## Phase 3: User Story 1 - 先手の駒を先手の番に動かす (Priority: P1) 🎯 MVP

**Goal**: 先手のターンで先手の駒のみを選択・移動可能にし、後手の駒を選択した場合は視覚的フィードバックを表示

**Independent Test**: 先手のターンで先手の駒を選択→移動→ターンが後手に切り替わることを確認。後手の駒を選択した場合にアニメーションが表示されることを確認。

### Tests for User Story 1 (TDD: RED → GREEN → REFACTOR) ⚠️

> **NOTE: これらのテストを最初に記述し、実装前にFAILすることを確認してください**

- [x] T011 [P] [US1] Board コンポーネントのターン検証テストを記述 - `tests/components/Board.test.tsx` にテストケースを追加(RED段階)
- [x] T012 [P] [US1] ShogiBoard コンポーネントの統合テストを記述 - `tests/components/ShogiBoard.test.tsx` にUS1のシナリオテストを追加(RED段階)

### Implementation for User Story 1

- [x] T013 [US1] Board コンポーネントにターン検証を追加 - `src/components/Board.tsx` の `handleSquareClick` に `canSelectPiece` チェックを実装(GREEN段階)
- [x] T014 [US1] Board コンポーネントに `currentTurn` prop を追加 - `src/components/Board.tsx` の Props インターフェースを拡張
- [x] T015 [US1] 無効操作時の視覚的フィードバック状態を追加 - `src/components/Board.tsx` に `useState` で `isInvalidSelection` フラグを追加
- [x] T016 [US1] テストを実行して成功を確認(GREEN段階完了) - `npm test tests/components/Board.test.tsx` を実行
- [x] T017 [US1] コードのリファクタリング(REFACTOR段階) - Board.tsx の重複ロジックを整理(不要 - コードは既に整理されている)

**Checkpoint**: この時点で、User Story 1 が完全に機能し、独立してテスト可能 ✅

---

## Phase 4: User Story 2 - 後手の駒を後手の番に動かす (Priority: P1)

**Goal**: 後手のターンで後手の駒のみを選択・移動可能にし、先手の駒を選択した場合は視覚的フィードバックを表示。US1と対称的な動作を実現。

**Independent Test**: 後手のターンで後手の駒を選択→移動→ターンが先手に切り替わることを確認。先手の駒を選択した場合にアニメーションが表示されることを確認。

### Tests for User Story 2 (TDD: RED → GREEN → REFACTOR) ⚠️

- [x] T018 [P] [US2] 後手ターンの統合テストを記述 - `tests/components/ShogiBoard.test.tsx` にUS2のシナリオテストを追加(RED段階 - US1で作成済み)
- [x] T019 [P] [US2] ターン切り替えロジックのテストを記述 - `tests/logic/boardState.test.ts` に `createInitialGameState` のテストを追加(GREEN段階)

### Implementation for User Story 2

- [x] T020 [US2] ShogiBoard コンポーネントにターン切り替えを実装 - `src/components/ShogiBoard.tsx` の `handleSquareClick` 関数で駒移動成功後に `switchTurn` を呼び出し(GREEN段階)
- [x] T021 [US2] ShogiBoard の状態に `currentTurn` を統合 - `src/components/ShogiBoard.tsx` の `useState<Turn>` で `currentTurn` を管理(Phase 3で実装済み)
- [x] T022 [US2] Board への `currentTurn` prop 渡しを実装 - `src/components/ShogiBoard.tsx` から `<Board currentTurn={currentTurn} />` に prop を渡す(Phase 3で実装済み)
- [x] T023 [US2] テストを実行して成功を確認(GREEN段階完了) - `npm test` で全テスト成功
- [x] T024 [US2] コードのリファクタリング(REFACTOR段階) - ShogiBoard.tsx のロジックを整理(不要 - コードは既に整理されている)

**Checkpoint**: この時点で、User Story 1 と User Story 2 が両方とも独立して動作 ✅

---

## Phase 5: User Story 3 - ターン表示と確認 (Priority: P2)

**Goal**: 画面上部にターン表示コンポーネントを配置し、無効操作時に視覚的にフィードバックを提供。ユーザーが現在のターンを常に把握できる。

**Independent Test**: 画面にターン表示が表示され、先手/後手で表示内容が切り替わることを確認。無効な駒を選択した時にアニメーションが発火することを確認。

### Tests for User Story 3 (TDD: RED → GREEN → REFACTOR) ⚠️

- [x] T025 [P] [US3] TurnDisplay コンポーネントのレンダリングテストを記述 - `tests/components/TurnDisplay.test.tsx` を作成(RED段階)
- [x] T026 [P] [US3] TurnDisplay のアニメーション発火テストを記述 - `tests/components/TurnDisplay.test.tsx` に `isHighlighted` prop のテストを追加(RED段階)
- [x] T027 [P] [US3] ShogiBoard と TurnDisplay の統合テストを記述 - `tests/components/ShogiBoard.test.tsx` にターン表示統合のテストを追加(Phase 3で実装済み)

### Implementation for User Story 3

- [x] T028 [US3] TurnDisplay コンポーネントを作成 - `src/components/TurnDisplay.tsx` を新規作成し、Props とレンダリングロジックを実装(GREEN段階)
- [x] T029 [US3] TurnDisplay のスタイリングを実装 - `src/components/TurnDisplay.tsx` に Tailwind CSS クラスを追加(盤面上部中央配置) - T028に含まれる
- [x] T030 [US3] TurnDisplay のアニメーションを実装 - `src/index.css` にアニメーション定義を追加(`@keyframes shake`, `@keyframes pulse`)
- [x] T031 [US3] ShogiBoard に TurnDisplay を統合 - `src/components/ShogiBoard.tsx` に `<TurnDisplay>` を配置
- [x] T032 [US3] 無効操作時の `isHighlighted` フラグ管理を実装 - `src/components/ShogiBoard.tsx` に `useState` で `isHighlighted` を追加し、Board からのコールバックで制御
- [x] T033 [US3] テストを実行して成功を確認(GREEN段階完了) - `npm test` で全テスト成功
- [x] T034 [US3] コードのリファクタリング(REFACTOR段階) - TurnDisplay.tsx と ShogiBoard.tsx のロジックを整理(不要 - コードは既に整理されている)

**Checkpoint**: すべてのユーザーストーリーが独立して機能 ✅

---

## Phase 6: Polish (統合とエッジケース)

**目的**: 全体的な品質向上と統合確認

- [x] T035 全体の統合テストを実行 - `npm test` ですべてのテストが成功することを確認 (125 passed)
- [x] T036 [P] パフォーマンステストを実行 - `tests/performance/performance.test.tsx` でターン切り替えが0.5秒以内であることを確認
- [x] T037 [P] エッジケースのテストを追加 - 無効な駒選択の連続クリック、ターン切り替え直後の操作などをテスト(既存テストでカバー済み)
- [x] T038 [P] Linting とフォーマットチェックを実行 - `npm run check` でlintとフォーマットの両方が成功することを確認
- [x] T039 ドキュメントの最終確認 - README.md, quickstart.md, spec.md の内容を実装に合わせて更新(マニュアル確認)
- [x] T040 デモシナリオの動作確認 - ブラウザで先手→後手の交互移動と視覚的フィードバックを手動確認(マニュアル確認)

**Checkpoint**: 実装完了、production ready ✅

---

## 依存関係の注意事項

- **Phase 2 はブロッキング**: T004-T010 がすべて完了するまで Phase 3 以降は開始不可
- **Phase 3-5 は部分的に並列化可能**: 各ストーリーの Tests 部分(T011-T012, T018-T019, T025-T027)は並列で記述可能
- **TDD サイクルを厳守**: 各ユーザーストーリーで RED → GREEN → REFACTOR の順序を守る
- **独立性の検証**: 各 Checkpoint で、そのストーリー単体が機能することを確認

## MVP (Minimum Viable Product) スコープ

MVP = **User Story 1 のみ** (先手の駒を先手の番に動かす)
- Phase 1 (T001-T003)
- Phase 2 (T004-T010)
- Phase 3 (T011-T017)

MVP で基本的なターン制御が実装され、後続のストーリーで機能を拡張。
