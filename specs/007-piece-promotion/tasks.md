````markdown
# Tasks: 駒の成り機能

**Input**: Design documents from `/specs/007-piece-promotion/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: タスクが属するユーザーストーリー（例：US1, US2, US3）
- ファイルパスは正確に記載

---

## Phase 1: Setup（共有インフラ）

**Purpose**: 型定義の拡張と基盤整備

- [ ] T001 [P] `src/types/piece.ts` に `promoted: boolean` フラグを追加し、`PromotablePieceType` と `NonPromotablePieceType` 型を定義する
- [ ] T002 [P] `src/types/piece.ts` に `PROMOTED_PIECE_DISPLAY` 定数（成り駒の表示文字マッピング）を追加する
- [ ] T003 `src/data/initialPosition.ts` の全ての駒データに `promoted: false` を追加する（T001に依存）

---

## Phase 2: Foundational（ブロッキング前提条件）

**Purpose**: 全ユーザーストーリーに必要なコアロジックの実装

**⚠️ CRITICAL**: このフェーズが完了するまでユーザーストーリーの実装は開始できない

- [ ] T004 `src/logic/promotionLogic.ts` を新規作成し、敵陣判定関数 `isInEnemyTerritory(rank: number, player: Player): boolean` を実装する
- [ ] T005 `src/logic/promotionLogic.ts` に成れる駒種判定関数 `isPromotablePieceType(type: PieceType): boolean` を実装する
- [ ] T006 `src/logic/promotionLogic.ts` に成り条件判定関数 `canPromoteMove(piece: Piece, from: Position, to: Position): boolean` を実装する
- [ ] T007 `src/logic/promotionLogic.ts` に強制成り判定関数 `mustPromote(piece: Piece, toRank: number): boolean` を実装する
- [ ] T008 `tests/logic/promotionLogic.test.ts` を新規作成し、T004-T007の関数をテストする

**Checkpoint**: 成り判定ロジック完成 - ユーザーストーリーの実装を開始可能

---

## Phase 3: User Story 1 - 敵陣に入った駒を成る (Priority: P1) 🎯 MVP

**Goal**: 駒が敵陣に入った時に「成る/成らない」を選択できる

**Independent Test**: 駒を敵陣に移動させた際に成りの選択ダイアログが表示され、選択に応じて駒が変化することを検証

### 実装

- [ ] T009 `src/types/selection.ts` に `PromotionChoice` と `PromotionState` 型を定義する
- [ ] T010 `src/components/PromotionDialog.tsx` を新規作成し、成る/成らないボタンを持つポップアップUIを実装する
- [ ] T011 `tests/components/PromotionDialog.test.tsx` を新規作成し、PromotionDialogのレンダリングとクリックイベントをテストする
- [ ] T012 `src/components/ShogiBoard.tsx` に `promotionState` ステートを追加し、成り選択フローを統合する
- [ ] T013 `src/components/ShogiBoard.tsx` の移動処理を修正し、敵陣への移動時に成り選択を表示するロジックを追加する

**Checkpoint**: 敵陣に入る移動で成り選択が動作する

---

## Phase 4: User Story 2 - 敵陣から出た駒を成る (Priority: P1)

**Goal**: 敵陣内の駒が敵陣外へ移動した時に「成る/成らない」を選択できる

**Independent Test**: 敵陣内にある駒を敵陣外へ移動させた際に成りの選択ダイアログが表示されることを検証

### 実装

- [ ] T014 `src/components/ShogiBoard.tsx` の移動処理を拡張し、敵陣から出る移動時にも成り選択を表示するロジックを追加する

**Checkpoint**: 敵陣から出る移動でも成り選択が動作する

---

## Phase 5: User Story 3 - 成り駒の動きの変化 (Priority: P1)

**Goal**: 成った駒が新しい移動パターンで動けるようになる

**Independent Test**: 各成り駒種を成らせた後、正しい移動パターンで移動できることを検証

### 実装

- [ ] T015 `src/logic/moveRules.ts` に `PROMOTED_MOVE_PATTERNS` 定数を追加する（と金/杏/圭/全→金の動き、竜→飛車+斜め1マス、馬→角+縦横1マス）
- [ ] T016 `src/logic/moveRules.ts` の `calculateValidMoves` 関数を修正し、`promoted` フラグに応じて適切な移動パターンを使用するようにする
- [ ] T017 `tests/logic/moveRules.test.ts` に成り駒の移動パターンテストを追加する（各成り駒種のテストケース）

**Checkpoint**: 成り駒が正しい移動パターンで動作する

---

## Phase 6: User Story 4 - 成れない駒と強制成り (Priority: P2)

**Goal**: 金将/王将は成れず、行き場所がなくなる移動では強制的に成る

**Independent Test**: 金将/王将を敵陣に移動させた際に成りの選択が表示されないこと、強制成り条件で自動的に成ることを検証

### 実装

- [ ] T018 `src/components/ShogiBoard.tsx` の成り選択ロジックを修正し、金・王・玉の場合は成り選択をスキップする
- [ ] T019 `src/components/ShogiBoard.tsx` の成り選択ロジックを修正し、強制成り条件（歩/香が最奥段、桂が最奥2段）の場合は自動的に成りを適用する
- [ ] T020 `tests/logic/promotionLogic.test.ts` に強制成りのエッジケーステストを追加する

**Checkpoint**: 成れない駒と強制成りが正しく動作する

---

## Phase 7: User Story 5 - 成り駒の表示 (Priority: P2)

**Goal**: 成り駒が視覚的に区別できる表記で表示される

**Independent Test**: 成り駒が正しい表記（と、杏、圭、全、竜、馬）で表示されることを検証

### 実装

- [ ] T021 `src/components/Piece.tsx` を修正し、`promoted` フラグに応じて `PROMOTED_PIECE_DISPLAY` の文字を表示するようにする
- [ ] T022 `tests/components/Piece.test.tsx` に成り駒表示のテストを追加する

**Checkpoint**: 成り駒が正しい表記で表示される

---

## Phase 8: エッジケースと統合

**Purpose**: 残りのエッジケース対応と全体統合

- [ ] T023 `src/components/ShogiBoard.tsx` を修正し、すでに成っている駒には成り選択を表示しないようにする
- [ ] T024 `src/components/ShogiBoard.tsx` を修正し、敵陣内での移動（敵陣から敵陣）でも成り選択を表示するようにする
- [ ] T025 `src/logic/captureLogic.ts` を修正し、成り駒が取られた際に `promoted: false` にリセットして持ち駒に追加する
- [ ] T026 `tests/logic/captureLogic.test.ts` に成り駒が取られた際のテストを追加する
- [ ] T027 `src/components/ShogiBoard.tsx` を確認し、持ち駒を打った際には成り選択が発生しないことを保証する

**Checkpoint**: 全てのエッジケースが正しく動作する

---

## Phase 9: Polish & クロスカッティング

**Purpose**: ドキュメント更新、クリーンアップ、最終検証

- [ ] T028 全テストを実行して合格を確認する（`npm test`）
- [ ] T029 リンターとフォーマットチェックを実行してエラーがないことを確認する（`npm run check` = `npm run lint && npm run format:check`）
- [ ] T030 `specs/007-piece-promotion/quickstart.md` の動作確認手順に従って手動テストを実施する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし - 即座に開始可能
- **Phase 2 (Foundational)**: Phase 1 の完了に依存 - 全ユーザーストーリーをブロック
- **Phase 3-7 (User Stories)**: Phase 2 の完了に依存
  - US1 (Phase 3) → US2 (Phase 4) は順序実行（同じファイルを編集）
  - US3 (Phase 5) は US1完了後に並列実行可能（異なるファイル）
  - US4, US5 (Phase 6, 7) は P2 優先度のため US1-3 完了後に実行
- **Phase 8 (Edge Cases)**: Phase 3-7 の完了に依存
- **Phase 9 (Polish)**: Phase 8 の完了に依存

### 並列実行可能なタスク

```bash
# Phase 1: 型定義は並列実行可能
T001 と T002 は並列実行可能

# Phase 2: テスト作成はロジック実装後
T004-T007 → T008

# Phase 3 と Phase 5: 異なるファイルなので一部並列可能
T009 (types) と T015 (moveRules) は並列実行可能
```

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始 - 他ストーリーへの依存なし、MVPの中心
- **US2 (P1)**: US1 完了後に開始 - ShogiBoard.tsx の同じ箇所を編集するため
- **US3 (P1)**: Phase 2 完了後に開始 - moveRules.ts のみ編集、US1/2 と並列可能
- **US4 (P2)**: US1-3 完了後に開始
- **US5 (P2)**: Phase 1 完了後に開始可能（Piece.tsx のみ編集）、ただし統合テストは US1-3 後

---

## 実装戦略

### MVP First（US1-3 のみ）

1. Phase 1: Setup 完了
2. Phase 2: Foundational 完了（CRITICAL）
3. Phase 3: US1 完了 → テスト
4. Phase 5: US3 完了（US1 と並列可能）→ テスト
5. Phase 4: US2 完了 → テスト
6. **STOP and VALIDATE**: 基本的な成り機能が動作することを確認
7. デモ/レビュー可能

### 完全実装

1. MVP 完了
2. Phase 6: US4 完了（成れない駒、強制成り）
3. Phase 7: US5 完了（成り駒表示）
4. Phase 8: エッジケース対応
5. Phase 9: 最終検証

---

## Notes

- [P] タスク = 異なるファイル、依存関係なし
- [Story] ラベルはタスクを特定のユーザーストーリーにマッピング
- 各ユーザーストーリーは独立して完了・テスト可能
- タスク完了後または論理グループ完了後にコミット
- チェックポイントで停止して独立してストーリーを検証可能

````
