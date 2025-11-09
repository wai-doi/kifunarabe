# Tasks: 駒の捕獲機能

**Input**: Design documents from `/specs/005-piece-capture/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

**Tests**: TDD戦略に従い、全てのタスクでテストファーストアプローチを採用

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーを独立して実装・テスト可能

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能(異なるファイル、依存関係なし)
- **[Story]**: このタスクが属するユーザーストーリー(例: US1, US2)
- 説明には正確なファイルパスを含める

## Path Conventions

本プロジェクトは単一プロジェクト構造:
- ソースコード: `src/` (コンポーネント、ロジック、型定義)
- テストコード: `tests/` (コンポーネント、ロジック)

---

## Phase 1: Setup (共有インフラストラクチャ)

**目的**: 型定義の作成と既存の型の拡張

- [x] T001 持ち駒関連の型定義を作成 in `src/types/capturedPieces.ts`
- [x] T002 GameState型を拡張して持ち駒プロパティを追加 in `src/types/board.ts`

---

## Phase 2: Foundational (ブロッキング前提条件)

**目的**: 全てのユーザーストーリーの実装前に完了すべきコアロジック

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業を開始できない

- [x] T003 駒の捕獲ロジックのテストを作成 in `tests/logic/captureLogic.test.ts` (Red: getTargetPiece)
- [x] T004 [P] getTargetPiece関数を実装 in `src/logic/captureLogic.ts` (Green)
- [x] T005 駒の捕獲ロジックのテストを追加 in `tests/logic/captureLogic.test.ts` (Red: addToCapturedPieces)
- [x] T006 [P] addToCapturedPieces関数を実装 in `src/logic/captureLogic.ts` (Green)
- [x] T007 駒の捕獲ロジックのテストを追加 in `tests/logic/captureLogic.test.ts` (Red: removePieceFromBoard)
- [x] T008 [P] removePieceFromBoard関数を実装 in `src/logic/captureLogic.ts` (Green)
- [x] T009 boardState拡張のテストを作成 in `tests/logic/boardState.test.ts` (Red: updateBoardAfterMove拡張)
- [x] T010 updateBoardAfterMove関数を拡張して駒の捕獲を統合 in `src/logic/boardState.ts` (Green)
- [x] T011 boardState拡張のテストを追加 in `tests/logic/boardState.test.ts` (Red: createInitialGameState拡張)
- [x] T012 createInitialGameState関数を拡張して持ち駒の初期化を追加 in `src/logic/boardState.ts` (Green)

**チェックポイント**: 基礎ロジックが完成 - ユーザーストーリーの実装を並列で開始可能

---

## Phase 3: User Story 1 - 駒の捕獲 (Priority: P1) 🎯 MVP

**Goal**: プレイヤーが相手の駒を取って持ち駒として記録できる

**Independent Test**: 先手と後手の駒を配置し、一方の駒をもう一方の駒のマス目に移動させて、駒の捕獲と持ち駒への追加を検証

### Tests for User Story 1 ⚠️

> **注意: これらのテストを最初に書き、実装前に失敗することを確認する**

- [x] T013 [P] [US1] Boardコンポーネントの駒捕獲テストを作成 in `tests/components/Board.test.tsx` (Red: 相手の駒を取る)
- [x] T014 [P] [US1] Boardコンポーネントの駒捕獲テストを追加 in `tests/components/Board.test.tsx` (Red: 持ち駒への追加)
- [x] T015 [P] [US1] ShogiBoardコンポーネントの持ち駒状態テストを作成 in `tests/components/ShogiBoard.test.tsx` (Red: 初期状態)
- [x] T016 [P] [US1] ShogiBoardコンポーネントの持ち駒状態テストを追加 in `tests/components/ShogiBoard.test.tsx` (Red: 捕獲後の更新)

### Implementation for User Story 1

- [x] T017 [US1] ShogiBoardコンポーネントを拡張して持ち駒状態を追加 in `src/components/ShogiBoard.tsx` (Green: T015)
- [x] T018 [US1] Boardコンポーネントを拡張して駒の捕獲処理を統合 in `src/components/Board.tsx` (Green: T013, T014)
- [x] T019 [US1] ShogiBoardコンポーネントで持ち駒の状態更新を実装 in `src/components/ShogiBoard.tsx` (Green: T016)
- [x] T020 [US1] 駒の捕獲後のターン制御をテスト in `tests/components/ShogiBoard.test.tsx` (追加テスト)
- [x] T021 [US1] コードのリファクタリングとクリーンアップ (Refactor)

**チェックポイント**: この時点で、ユーザーストーリー1が完全に機能し、独立してテスト可能

---

## Phase 4: User Story 2 - 持ち駒の表示 (Priority: P2)

**Goal**: プレイヤーが取った駒を視覚的に確認できる

**Independent Test**: 駒を捕獲した後、持ち駒表示エリアに正しい駒の種類と数が表示されることを確認

### Tests for User Story 2 ⚠️

> **注意: これらのテストを最初に書き、実装前に失敗することを確認する**

- [x] T022 [P] [US2] CapturedPiecesコンポーネントのテストを作成 in `tests/components/CapturedPieces.test.tsx` (Red: 空の持ち駒表示)
- [x] T023 [P] [US2] CapturedPiecesコンポーネントのテストを追加 in `tests/components/CapturedPieces.test.tsx` (Red: 1個の駒表示)
- [x] T024 [P] [US2] CapturedPiecesコンポーネントのテストを追加 in `tests/components/CapturedPieces.test.tsx` (Red: 複数個の駒表示)
- [x] T025 [P] [US2] CapturedPiecesコンポーネントのテストを追加 in `tests/components/CapturedPieces.test.tsx` (Red: 複数種類の駒表示)
- [x] T026 [P] [US2] CapturedPiecesコンポーネントのテストを追加 in `tests/components/CapturedPieces.test.tsx` (Red: プレイヤーごとの配置)

### Implementation for User Story 2

- [x] T027 [US2] CapturedPiecesコンポーネントを作成 in `src/components/CapturedPieces.tsx` (Green: T022)
- [x] T028 [US2] CapturedPiecesコンポーネントで駒の表示を実装 in `src/components/CapturedPieces.tsx` (Green: T023)
- [x] T029 [US2] CapturedPiecesコンポーネントで数量表示を実装 in `src/components/CapturedPieces.tsx` (Green: T024)
- [x] T030 [US2] CapturedPiecesコンポーネントで複数種類の表示を実装 in `src/components/CapturedPieces.tsx` (Green: T025)
- [x] T031 [US2] CapturedPiecesコンポーネントでプレイヤーごとの配置を実装 in `src/components/CapturedPieces.tsx` (Green: T026)
- [x] T032 [US2] ShogiBoardコンポーネントにCapturedPiecesコンポーネントを統合 in `src/components/ShogiBoard.tsx`
- [x] T033 [US2] Tailwind CSSでスタイリングを追加 in `src/components/CapturedPieces.tsx`
- [x] T034 [US2] コードのリファクタリングとクリーンアップ (Refactor)

**チェックポイント**: この時点で、ユーザーストーリー2が完全に機能し、独立してテスト可能

---

## Phase 5: Polish & Cross-Cutting Concerns (仕上げと横断的関心事)

**目的**: 全体の統合、エッジケース処理、パフォーマンス最適化

- [x] T035 [P] エッジケースのテストを追加 in `tests/logic/captureLogic.test.ts` (同じ種類の駒を複数回取る)
- [x] T036 [P] エッジケースのテストを追加 in `tests/components/Board.test.tsx` (空の盤面での捕獲)
- [x] T037 全てのテストを実行して合格を確認 `npm run test`
- [x] T038 カバレッジレポートを生成して確認 `npm run test:coverage`
- [x] T039 Lintとフォーマットチェックを実行 `npm run check`
- [x] T040 開発サーバーで動作確認 `npm run dev`
- [x] T041 ブラウザで全てのAcceptance Scenariosを手動確認
- [x] T042 パフォーマンス計測(駒の捕獲処理時間、持ち駒表示更新時間)
- [x] T043 必要に応じてReact.memoでCapturedPiecesコンポーネントを最適化
- [x] T044 ドキュメントの最終更新(README、コメント等)

---

## Dependencies (依存関係グラフ)

### ユーザーストーリーの完了順序

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← 全てのユーザーストーリーのブロッキング前提条件
    ↓
    ├─→ Phase 3 (US1: 駒の捕獲) ← MVP、最優先
    │       ↓
    └─→ Phase 4 (US2: 持ち駒の表示) ← US1完了後に実装可能
            ↓
Phase 5 (Polish) ← 全てのユーザーストーリー完了後
```

### 依存関係の詳細

- **Phase 1 → Phase 2**: 型定義がロジックの実装に必要
- **Phase 2 → Phase 3**: 捕獲ロジックがUS1の実装に必要
- **Phase 3 → Phase 4**: 持ち駒の状態管理がUS2の表示に必要
- **Phase 4 → Phase 5**: 全機能が統合されてから最終調整

### 並列実行の機会

#### Phase 1での並列実行

- T001とT002は異なるファイルで並列実行可能

#### Phase 2での並列実行

- T003-T004 (getTargetPiece)
- T005-T006 (addToCapturedPieces) 
- T007-T008 (removePieceFromBoard)
- これらは独立した関数なので、グループごとに並列実行可能

#### Phase 3での並列実行

- T013, T014, T015, T016 (テスト作成)は全て並列実行可能
- 実装タスク(T017-T019)はテスト完了後に実行

#### Phase 4での並列実行

- T022-T026 (テスト作成)は全て並列実行可能
- 実装タスク(T027-T031)は段階的に実行

#### Phase 5での並列実行

- T035とT036は並列実行可能

---

## Parallel Execution Examples (並列実行の例)

### Example 1: Phase 2 Foundational Tasks

**並列グループ1**: 捕獲ロジックの3つの関数を同時に開発

```bash
# 開発者A: getTargetPiece
npm run test -- captureLogic.test.ts -t "getTargetPiece"

# 開発者B: addToCapturedPieces  
npm run test -- captureLogic.test.ts -t "addToCapturedPieces"

# 開発者C: removePieceFromBoard
npm run test -- captureLogic.test.ts -t "removePieceFromBoard"
```

**並列グループ2**: boardStateの拡張

```bash
# 開発者A: updateBoardAfterMove拡張
npm run test -- boardState.test.ts -t "updateBoardAfterMove"

# 開発者B: createInitialGameState拡張
npm run test -- boardState.test.ts -t "createInitialGameState"
```

### Example 2: Phase 3 User Story 1 Tests

**並列グループ**: 全てのテストを同時に作成

```bash
# 開発者A: Board駒捕獲テスト
npm run test -- Board.test.tsx -t "駒捕獲"

# 開発者B: ShogiBoard持ち駒状態テスト
npm run test -- ShogiBoard.test.tsx -t "持ち駒状態"
```

### Example 3: Phase 4 User Story 2 Tests

**並列グループ**: CapturedPiecesの全テストを同時に作成

```bash
# 開発者A: 空の持ち駒と1個の駒表示
npm run test -- CapturedPieces.test.tsx -t "空|1個"

# 開発者B: 複数個と複数種類の駒表示
npm run test -- CapturedPieces.test.tsx -t "複数"

# 開発者C: プレイヤーごとの配置
npm run test -- CapturedPieces.test.tsx -t "配置"
```

---

## Implementation Strategy (実装戦略)

### MVP First Approach

**MVPスコープ**: User Story 1 (駒の捕獲) のみ

**理由**:
- 駒の捕獲は将棋の基本ルールで最も重要
- US1が動作すれば、ゲームとして成立する
- US2(持ち駒の表示)はUI改善だが、なくても機能する

**MVP達成タイミング**: Phase 3完了時

### Incremental Delivery

1. **Phase 1-2完了**: 基礎ロジック確立、テスト可能
2. **Phase 3完了**: MVP達成、駒の捕獲が動作
3. **Phase 4完了**: フル機能、持ち駒の視覚表示
4. **Phase 5完了**: プロダクション品質、エッジケース対応

### Testing Strategy

**TDDサイクル** (Red-Green-Refactor):
1. **Red**: テストを書いて失敗を確認
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: コードを改善

**テスト優先順位**:
1. ユニットテスト: captureLogic, boardState
2. コンポーネントテスト: Board, ShogiBoard, CapturedPieces
3. 統合テスト: 全体のフロー確認

---

## Task Summary

**総タスク数**: 44タスク

**ユーザーストーリーごとのタスク数**:
- Setup (Phase 1): 2タスク
- Foundational (Phase 2): 10タスク
- User Story 1 (Phase 3): 9タスク
- User Story 2 (Phase 4): 13タスク
- Polish (Phase 5): 10タスク

**並列実行の機会**: 18タスクが並列実行可能 ([P]マーク付き)

**Independent Test Criteria**:
- **US1**: 駒を移動させて相手の駒を取り、持ち駒として記録されることを確認
- **US2**: 持ち駒表示エリアに正しい駒の種類と数量が表示されることを確認

**推奨MVPスコープ**: User Story 1 (Phase 1-3)

---

## Format Validation ✅

全てのタスクがチェックリスト形式に従っています:
- ✅ チェックボックス (`- [ ]`)
- ✅ タスクID (T001-T044)
- ✅ [P]マーカー (並列実行可能タスク)
- ✅ [Story]ラベル (US1, US2)
- ✅ 明確な説明とファイルパス

各タスクはLLMが追加のコンテキストなしで完了できるよう、十分に具体的です。
