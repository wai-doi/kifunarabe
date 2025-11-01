# Tasks: 駒の移動機能

**Input**: Design documents from `/specs/003-piece-movement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

<!-- 注意: タスクリストは憲法に従い日本語で記述してください -->

**Tests**: このプロジェクトはTDD(テスト駆動開発)を採用しています。各実装の前にテストを作成します。

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーを独立して実装・テスト可能にしています。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能(異なるファイル、依存関係なし)
- **[Story]**: タスクが属するユーザーストーリー(例: US1, US2, US3)
- 説明文に正確なファイルパスを含む

## Path Conventions

単一プロジェクト構成:
- `src/` - ソースコード
- `tests/` - テストコード

---

## Phase 1: Setup (共通インフラストラクチャ)

**目的**: プロジェクト初期化と基本構造の確立

- [ ] T001 プロジェクト構造の確認 - 既存のディレクトリ構造が実装計画と一致していることを確認
- [ ] T002 [P] 新規ディレクトリの作成 - `src/logic/` ディレクトリを作成
- [ ] T003 [P] 新規テストディレクトリの作成 - `tests/logic/` ディレクトリを作成

---

## Phase 2: Foundational (必須の前提条件)

**目的**: 全ユーザーストーリーが依存するコアインフラストラクチャ

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

- [ ] T004 [P] 移動パターン型定義の作成 - `src/types/movePattern.ts` にMovePattern型とVector型を定義
- [ ] T005 [P] 移動ルール定数の定義 - `src/logic/moveRules.ts` に各駒種のMOVE_PATTERNSを定義
- [ ] T006 座標バリデーション関数の実装 - `src/logic/boardState.ts` にisValidPosition関数を実装

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並列で開始可能

---

## Phase 3: User Story 1 - 駒の選択と移動 (Priority: P1) 🎯 MVP

**Goal**: ユーザーが盤面上の駒をクリックして選択し、移動先をクリックして駒を移動できる

**Independent Test**: 盤面を表示し、任意の駒をクリックして選択状態にし、移動可能なマス(ルールは未検証)をクリックして駒が移動することを確認

### Tests for User Story 1

> **NOTE: これらのテストを最初に作成し、実装前に失敗することを確認してください**

- [ ] T007 [P] [US1] Pieceコンポーネントの選択状態テスト - `tests/components/Piece.test.tsx` にisSelectedプロパティのテストを追加
- [ ] T008 [P] [US1] Squareコンポーネントのクリックテスト - `tests/components/Square.test.tsx` にonClickハンドラーのテストを追加
- [ ] T009 [US1] ShogiBoardコンポーネントの選択状態管理テスト - `tests/components/ShogiBoard.test.tsx` に駒の選択・選択解除のテストを追加

### Implementation for User Story 1

- [ ] T010 [P] [US1] Pieceコンポーネントの拡張 - `src/components/Piece.tsx` にisSelectedプロパティを追加し、選択状態のスタイリング(bg-yellow-200 ring-4 ring-yellow-500)を実装
- [ ] T011 [P] [US1] Squareコンポーネントの拡張 - `src/components/Square.tsx` にisSelectedとonClickプロパティを追加し、Pieceへ選択状態を伝達
- [ ] T012 [US1] ShogiBoardコンポーネントの状態管理実装 - `src/components/ShogiBoard.tsx` にuseState<Position | null>で選択状態を追加
- [ ] T013 [US1] ShogiBoardのクリックハンドラー実装 - `src/components/ShogiBoard.tsx` にhandleSquareClick関数を実装(駒の選択と選択解除)
- [ ] T014 [US1] Boardコンポーネントの拡張 - `src/components/Board.tsx` にselectedとonSquareClickプロパティを追加し、Squareへ伝達
- [ ] T015 [US1] 基本的な移動機能の実装 - `src/components/ShogiBoard.tsx` で選択中の駒を別のマスに移動する基本機能を実装(ルール検証なし)

**Checkpoint**: この時点で、User Story 1は完全に機能し、独立してテスト可能です(駒を選択して空のマスに移動できる)

---

## Phase 4: User Story 2 - 移動ルールの制約 (Priority: P1)

**Goal**: 各駒の動きに応じて移動可能なマスを制限し、将棋のルールに反する移動を禁止する

**Independent Test**: 各種類の駒を選択し、その駒が移動できないマス(ルール違反となるマス)をクリックしても移動しないことを確認

**Note**: User Story 1と密接に関連しているため、P1として同時期に実装します

### Tests for User Story 2

- [ ] T016 [P] [US2] calculateValidMoves関数のテスト - `tests/logic/moveRules.test.ts` を作成し、各駒種の移動可能マス計算のテストを実装(歩、香、桂、銀、金、飛、角、王)
- [ ] T017 [P] [US2] isValidMove関数のテスト - `tests/logic/moveRules.test.ts` に移動可能性判定のテストを追加
- [ ] T018 [P] [US2] getAdjustedVectors関数のテスト - `tests/logic/moveRules.test.ts` に先手/後手のベクトル調整のテストを追加

### Implementation for User Story 2

- [ ] T019 [P] [US2] getAdjustedVectors関数の実装 - `src/logic/moveRules.ts` に先手/後手に応じたベクトル調整関数を実装
- [ ] T020 [US2] calculateValidMoves関数の実装 - `src/logic/moveRules.ts` に駒の移動可能マスを計算する関数を実装
- [ ] T021 [US2] isValidMove関数の実装 - `src/logic/moveRules.ts` に移動の妥当性を判定する関数を実装
- [ ] T022 [US2] ShogiBoardへの移動ルール統合 - `src/components/ShogiBoard.tsx` のhandleSquareClick関数にisValidMoveチェックを追加
- [ ] T023 [US2] 移動ルールのエッジケーステスト - 盤面の端、各駒種の特殊な動きをテストで検証

**Checkpoint**: この時点で、User Story 1と2が完全に機能し、駒は正しいルールに従って移動します

---

## Phase 5: User Story 3 - 駒がある位置への移動制限 (Priority: P2)

**Goal**: 既に駒が存在するマスへの移動を禁止する(駒の取り合いは未実装)

**Independent Test**: 駒を動かして、他の駒が既に存在するマスに移動しようとしても移動できないことを確認

### Tests for User Story 3

- [ ] T024 [P] [US3] isPathClear関数のテスト - `tests/logic/moveRules.test.ts` に経路上の障害物チェックのテストを追加(飛車、角、香の長距離移動)
- [ ] T025 [P] [US3] 駒の衝突判定のテスト - `tests/logic/moveRules.test.ts` に移動先に駒がある場合のテストを追加

### Implementation for User Story 3

- [ ] T026 [P] [US3] isPathClear関数の実装 - `src/logic/moveRules.ts` に移動経路上の障害物チェック関数を実装(桂馬は経路チェック不要)
- [ ] T027 [US3] 移動先の駒チェック追加 - `src/logic/moveRules.ts` のcalculateValidMovesとisValidMoveに移動先の駒の有無チェックを追加
- [ ] T028 [US3] 長距離移動駒の経路チェック統合 - 飛車、角、香の移動時にisPathClearを呼び出すよう実装

**Checkpoint**: 全てのユーザーストーリーが独立して機能し、駒の移動機能が完成

---

## Phase 6: Polish & Cross-Cutting Concerns

**目的**: 複数のユーザーストーリーに影響する改善

- [ ] T029 [P] イミュータブル更新のリファクタリング - `src/logic/boardState.ts` にupdateBoardAfterMove関数を実装し、ShogiBoardから状態更新ロジックを分離
- [ ] T030 [P] boardState関数のユニットテスト - `tests/logic/boardState.test.ts` を作成し、イミュータブル更新のテストを実装
- [ ] T031 [P] アクセシビリティの向上 - 選択状態の視覚表示にARIAラベルやフォーカス管理を追加
- [ ] T032 コードレビューとリファクタリング - 全体のコード品質を確認し、重複を削減
- [ ] T033 パフォーマンステスト - SC-001(0.1秒以内の選択表示)とSC-002(0.2秒以内の移動完了)の要件を検証
- [ ] T034 quickstart.mdの検証 - 開発環境のセットアップと実装手順が正確であることを確認

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存関係なし - 即座に開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - 全ユーザーストーリーをブロック
- **User Stories (Phase 3-5)**: 全てFoundationalフェーズの完了に依存
  - ユーザーストーリーは並列で進行可能(スタッフがいる場合)
  - または優先順位順に順次実行(P1 → P2)
- **Polish (Phase 6)**: 全ての必要なユーザーストーリーの完了に依存

### User Story Dependencies

- **User Story 1 (P1)**: Foundational (Phase 2)の後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P1)**: Foundational (Phase 2)の後に開始可能 - US1と密接に統合されるが、独立してテスト可能
- **User Story 3 (P2)**: Foundational (Phase 2)の後に開始可能 - US1/US2と統合されるが、独立してテスト可能

### 各ユーザーストーリー内

- テストを最初に作成し、実装前に失敗することを確認
- コンポーネントの前に型定義
- ロジック関数の前にテスト
- 統合の前にコア実装
- 次の優先度に移る前にストーリーを完了

### Parallel Opportunities

- Setup内の[P]マークのタスクは並列実行可能
- Foundational内の[P]マークのタスクは並列実行可能(Phase 2内)
- Foundationalフェーズ完了後、全ユーザーストーリーを並列開始可能(チーム能力が許せば)
- ストーリー内で[P]マークのテストは並列実行可能
- ストーリー内で[P]マークのコンポーネントは並列実行可能
- 異なるユーザーストーリーは異なるチームメンバーが並列で作業可能

---

## Parallel Example: User Story 1

```bash
# User Story 1の全テストを同時に起動:
Task: "Pieceコンポーネントの選択状態テスト in tests/components/Piece.test.tsx"
Task: "Squareコンポーネントのクリックテスト in tests/components/Square.test.tsx"
Task: "ShogiBoardコンポーネントの選択状態管理テスト in tests/components/ShogiBoard.test.tsx"

# User Story 1の並列可能なコンポーネント実装を同時に起動:
Task: "Pieceコンポーネントの拡張 in src/components/Piece.tsx"
Task: "Squareコンポーネントの拡張 in src/components/Square.tsx"
```

---

## Parallel Example: User Story 2

```bash
# User Story 2の全テストを同時に起動:
Task: "calculateValidMoves関数のテスト in tests/logic/moveRules.test.ts"
Task: "isValidMove関数のテスト in tests/logic/moveRules.test.ts"
Task: "getAdjustedVectors関数のテスト in tests/logic/moveRules.test.ts"

# User Story 2の並列可能なロジック関数実装を同時に起動:
Task: "getAdjustedVectors関数の実装 in src/logic/moveRules.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2のみ)

1. Phase 1を完了: Setup
2. Phase 2を完了: Foundational (重要 - 全ストーリーをブロック)
3. Phase 3を完了: User Story 1 (駒の選択と基本移動)
4. Phase 4を完了: User Story 2 (移動ルールの制約)
5. **停止して検証**: User Story 1と2を独立してテスト
6. 準備できていればデプロイ/デモ

### Incremental Delivery

1. Setup + Foundational完了 → 基盤準備完了
2. User Story 1追加 → 独立してテスト → デプロイ/デモ(基本MVP!)
3. User Story 2追加 → 独立してテスト → デプロイ/デモ(ルール完備MVP!)
4. User Story 3追加 → 独立してテスト → デプロイ/デモ(完全版!)
5. 各ストーリーは前のストーリーを壊すことなく価値を追加

### Parallel Team Strategy

複数の開発者がいる場合:

1. チーム全体でSetup + Foundationalを完了
2. Foundational完了後:
   - Developer A: User Story 1(T007-T015)
   - Developer B: User Story 2(T016-T023)
   - Developer C: User Story 3(T024-T028)
3. ストーリーは独立して完了し、統合

---

## Task Summary

- **Total Tasks**: 34
- **Setup Tasks**: 3
- **Foundational Tasks**: 3
- **User Story 1 Tasks**: 9 (3 tests + 6 implementation)
- **User Story 2 Tasks**: 8 (3 tests + 5 implementation)
- **User Story 3 Tasks**: 5 (2 tests + 3 implementation)
- **Polish Tasks**: 6
- **Parallel Opportunities**: 18 tasks marked [P]

### Tasks per User Story

- **US1 (駒の選択と移動)**: 9 tasks
- **US2 (移動ルールの制約)**: 8 tasks
- **US3 (駒がある位置への移動制限)**: 5 tasks

### Suggested MVP Scope

**Minimum MVP**: Phase 1 + Phase 2 + Phase 3 (User Story 1のみ)
- 駒を選択して空のマスに移動できる基本機能

**Recommended MVP**: Phase 1 + Phase 2 + Phase 3 + Phase 4 (User Story 1 + 2)
- 駒の移動ルールに従った正確な移動機能
- 将棋として成立する最小限の機能

**Full Feature**: 全Phase完了
- 駒の衝突判定を含む完全な移動機能

---

## Notes

- [P] タスク = 異なるファイル、依存関係なし
- [Story] ラベルはタスクを特定のユーザーストーリーにマッピング(追跡可能性)
- 各ユーザーストーリーは独立して完了・テスト可能
- 実装前にテストが失敗することを確認
- 各タスクまたは論理的なグループの後にコミット
- 任意のCheckpointで停止し、ストーリーを独立して検証可能
- 避けるべき: 曖昧なタスク、同じファイルの競合、ストーリーの独立性を壊す相互依存
