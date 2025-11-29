# Tasks: 持ち駒を打つ機能

**Input**: Design documents from `/specs/006-piece-drop/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: タスクが属するユーザーストーリー（例: US1, US2, US3）
- ファイルパスは src/ および tests/ からの相対パス

---

## Phase 1: Setup（型定義とインフラ）

**Purpose**: 新機能に必要な型定義と基盤コードの準備

- [x] T001 Selection型を定義する（`src/types/selection.ts`）
- [x] T002 [P] dropLogic.ts の空ファイルを作成し、関数シグネチャを定義する（`src/logic/dropLogic.ts`）

---

## Phase 2: Foundational（基盤ロジック）

**Purpose**: ユーザーストーリー実装前に必要なロジックの実装

**⚠️ CRITICAL**: 全ユーザーストーリーがこのフェーズの完了に依存

### テスト（Red フェーズ）

- [x] T003 [P] canDropPiece のユニットテストを作成する（`tests/logic/dropLogic.test.ts`）
- [x] T004 [P] dropPiece のユニットテストを作成する（`tests/logic/dropLogic.test.ts`）
- [x] T005 [P] removeFromCapturedPieces のユニットテストを作成する（`tests/logic/captureLogic.test.ts`）

### 実装（Green フェーズ）

- [x] T006 canDropPiece 関数を実装する（`src/logic/dropLogic.ts`）
- [x] T007 dropPiece 関数を実装する（`src/logic/dropLogic.ts`）
- [x] T008 removeFromCapturedPieces 関数を実装する（`src/logic/captureLogic.ts`）

**Checkpoint**: 全テストがパスすることを確認 ✅ 28/28 passed

---

## Phase 3: User Story 1 & 2 - 持ち駒を打つ基本機能 (Priority: P1) 🎯 MVP

**Goal**: プレイヤーが持ち駒を選択して空きマスに打てるようにする

**Independent Test**: 持ち駒を持っている状態で、持ち駒エリアから駒を選択し、空いているマス目に配置できることを検証

> **Note**: User Story 1と2は密接に関連するため、1つのフェーズとして実装

### テスト（Red フェーズ）

- [x] T009 [P] [US1] CapturedPieces クリックハンドラのテストを作成する（`tests/components/CapturedPieces.test.tsx`）
- [x] T010 [P] [US2] CapturedPieces 選択ハイライトのテストを作成する（`tests/components/CapturedPieces.test.tsx`）
- [x] T011 [P] [US1] ShogiBoard 持ち駒打ち統合テストを作成する（`tests/components/ShogiBoard.test.tsx`）

### 実装（Green フェーズ）

- [x] T012 [US2] CapturedPieces に onPieceClick プロパティを追加する（`src/components/CapturedPieces.tsx`）
- [x] T013 [US2] CapturedPieces に selectedPieceType プロパティを追加し、ハイライト表示する（`src/components/CapturedPieces.tsx`）
- [x] T014 [US1] ShogiBoard の selected 状態を Selection 型に変更する（`src/components/ShogiBoard.tsx`）
- [x] T015 [US1] ShogiBoard に handleCapturedPieceClick ハンドラを追加する（`src/components/ShogiBoard.tsx`）
- [x] T016 [US1] handleSquareClick を拡張し、持ち駒選択時の打つ処理を追加する（`src/components/ShogiBoard.tsx`）
- [x] T017 [US2] 持ち駒選択中に盤面の自分の駒をクリックした場合の切り替え処理を実装する（`src/components/ShogiBoard.tsx`）
- [x] T018 [US2] 持ち駒選択中に別の持ち駒をクリックした場合の切り替え処理を実装する（`src/components/ShogiBoard.tsx`）

**Checkpoint**: 持ち駒の選択・配置が正常に動作することを確認 ✅ 170/170 passed

---

## Phase 4: User Story 3 - 手番との連携 (Priority: P2)

**Goal**: 自分の手番でのみ持ち駒を打てるようにする

**Independent Test**: 先手の手番では後手の持ち駒を選択できず、後手の手番では先手の持ち駒を選択できないことを検証

### テスト（Red フェーズ）

- [x] T019 [P] [US3] 相手の手番で持ち駒を選択できないテストを作成する（`tests/components/ShogiBoard.test.tsx`）
- [x] T020 [P] [US3] 持ち駒打ち後の手番切り替えテストを作成する（`tests/components/ShogiBoard.test.tsx`）

### 実装（Green フェーズ）

- [x] T021 [US3] CapturedPieces に isSelectable プロパティを追加する（`src/components/CapturedPieces.tsx`）
- [x] T022 [US3] ShogiBoard で currentTurn に基づいて CapturedPieces の isSelectable を制御する（`src/components/ShogiBoard.tsx`）
- [x] T023 [US3] 持ち駒を打った後に手番を切り替える処理を追加する（`src/components/ShogiBoard.tsx`）

**Checkpoint**: 手番制御が正常に動作することを確認 ✅ 19/19 passed

---

## Phase 5: Polish & Edge Cases

**Purpose**: エッジケース対応とコード品質向上

- [x] T024 [P] 持ち駒選択のキャンセル処理を実装する（同じ駒を再クリック）（`src/components/ShogiBoard.tsx`）
- [x] T025 [P] 持ち駒が0個の駒種をクリックしても選択されないことを確認するテストを追加する（`tests/components/CapturedPieces.test.tsx`）
- [x] T026 既存の盤面駒移動テストが引き続きパスすることを確認する
- [x] T027 全テストを実行し、カバレッジを確認する（`npm run test:coverage`）
- [x] T028 ESLint と Prettier のチェックを実行する（`npm run check`）
- [ ] T029 quickstart.md の動作確認手順に沿って手動テストを実施する

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) - ロジックのテストと実装
    ↓
Phase 3 (US1 & US2) - 持ち駒を打つ基本機能
    ↓
Phase 4 (US3) - 手番制御との連携
    ↓
Phase 5 (Polish) - エッジケースと品質確認
```

### ユーザーストーリー依存関係

- **US1 & US2 (P1)**: Phase 2 完了後に開始可能。相互に密結合のため同一フェーズで実装
- **US3 (P2)**: Phase 3 完了後に開始。US1/US2 の機能を前提とする

### 並列実行可能なタスク

**Phase 1**:
- T001, T002 は並列実行可能

**Phase 2 テスト**:
- T003, T004, T005 は並列実行可能

**Phase 2 実装**:
- T006, T007 は並列実行可能（T008 は単独）

**Phase 3 テスト**:
- T009, T010, T011 は並列実行可能

**Phase 4 テスト**:
- T019, T020 は並列実行可能

---

## Parallel Example: Phase 2 テスト

```bash
# 全てのロジックテストを並列で起動:
Task: "canDropPiece のユニットテストを作成する（tests/logic/dropLogic.test.ts）"
Task: "dropPiece のユニットテストを作成する（tests/logic/dropLogic.test.ts）"
Task: "removeFromCapturedPieces のユニットテストを作成する（tests/logic/captureLogic.test.ts）"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Phase 1: Setup を完了
2. Phase 2: Foundational を完了（ロジックのテストと実装）
3. Phase 3: User Story 1 & 2 を完了
4. **STOP and VALIDATE**: 持ち駒を打つ基本操作をテスト
5. MVP として動作確認

### Incremental Delivery

1. Setup + Foundational → 基盤準備完了
2. User Story 1 & 2 → 持ち駒を打つ基本機能（MVP）
3. User Story 3 → 手番制御との連携
4. Polish → エッジケースと品質

---

## Notes

- 憲法に従い、テスト駆動開発（Red-Green-Refactor）を適用
- 各 Checkpoint でテストがパスすることを確認してから次へ進む
- コミットは各タスク完了後、または論理的なグループ単位で実施
- User Story 1 と 2 は密結合のため、同一フェーズで実装する設計判断
