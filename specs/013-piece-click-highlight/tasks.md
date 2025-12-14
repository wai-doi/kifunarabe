# Tasks: 駒クリック時の選択ハイライト表示

**Feature**: 013-piece-click-highlight
**Input**: Design documents from `/specs/013-piece-click-highlight/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: どのユーザーストーリーに属するか（例: US1, US2, US3, US4）
- 説明には正確なファイルパスを含める

## Path Conventions

このプロジェクトは単一フロントエンドプロジェクト構造：
- **src/**: ソースコード（`src/components/`, `src/logic/`, `src/types/`）
- **tests/**: テストコード（`tests/components/`, `tests/logic/`）

---

## Phase 1: Setup（共有インフラストラクチャ）

**目的**: プロジェクトの初期化と基本構造の確認

- [ ] T001 ブランチ 013-piece-click-highlight にチェックアウト
- [ ] T002 npm install で依存関係をインストール
- [ ] T003 npm run dev でデ開発サーバーが起動することを確認
- [ ] T004 npm test でテストフレームワークが動作することを確認

---

## Phase 2: Foundational（ブロッキング前提条件）

**目的**: すべてのユーザーストーリー実装前に完了すべきコア基盤

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

- [ ] T005 既存の選択状態管理（ShogiBoard.tsx の selection ステート）を理解
- [ ] T006 既存の handleSquareClick 関数の動作を理解
- [ ] T007 既存の Square.tsx コンポーネントのスタイル適用方法を理解
- [ ] T008 現在の手番（currentTurn）と駒の所有者（piece.player）の関係を確認

**チェックポイント**: 基盤準備完了 - ユーザーストーリーの実装を開始可能

---

## Phase 3: User Story 4 - 手番による駒選択制限 (Priority: P1) 🎯 MVP

**Goal**: 現在の手番のプレイヤーが所有する駒のみ選択可能にする。相手の駒や空マスをクリックしても何も起こらない。

**Independent Test**: 先手の番で後手の駒をクリックし、枠が表示されないことを確認。後手の番で先手の駒をクリックし、枠が表示されないことを確認。

### Tests for User Story 4 (TDD: Red Phase)

> **注意: これらのテストを最初に書き、失敗することを確認してから実装を開始**

- [ ] T009 [P] [US4] 選択可否判定ロジックのテストファイルを作成 tests/logic/selectionLogic.test.ts
- [ ] T010 [P] [US4] 空マス（null）の場合はfalseを返すテストを追加
- [ ] T011 [P] [US4] 先手の手番で先手の駒の場合はtrueを返すテストを追加
- [ ] T012 [P] [US4] 先手の手番で後手の駒の場合はfalseを返すテストを追加
- [ ] T013 [P] [US4] 後手の手番で後手の駒の場合はtrueを返すテストを追加
- [ ] T014 [P] [US4] 後手の手番で先手の駒の場合はfalseを返すテストを追加
- [ ] T015 [US4] npm test -- selectionLogic.test.ts を実行してテストが失敗することを確認（Red）

### Implementation for User Story 4 (TDD: Green Phase)

- [ ] T016 [US4] 選択可否判定ロジックファイルを作成 src/logic/selectionLogic.ts
- [ ] T017 [US4] canSelectPiece 関数を実装（piece === null の場合は false を返す）
- [ ] T018 [US4] canSelectPiece 関数に手番チェックを追加（piece.player === currentTurn）
- [ ] T019 [US4] 型定義のインポートを追加（Piece, Turn）
- [ ] T020 [US4] npm test -- selectionLogic.test.ts を実行してすべてのテストが通ることを確認（Green）

### Integration for User Story 4

- [ ] T021 [US4] ShogiBoard.tsx に canSelectPiece をインポート
- [ ] T022 [US4] handleSquareClick 関数の先頭で canSelectPiece を呼び出し
- [ ] T023 [US4] 選択不可能な場合は早期リターンを追加
- [ ] T024 [US4] npm run dev で動作確認（相手の駒をクリックしても枠が出ないことを確認）

**チェックポイント**: この時点で、User Story 4 が完全に機能し、独立してテスト可能

---

## Phase 4: User Story 1 - 駒選択時の視覚的フィードバック (Priority: P1)

**Goal**: 選択可能な駒をクリックしたときに、オレンジ色の枠が表示される。別の駒を選択すると枠が移動する。

**Independent Test**: 自分の駒をクリックし、オレンジ色の枠が表示されることを確認。別の駒をクリックし、枠が移動することを確認。

### Tests for User Story 1 (TDD: Red Phase)

- [ ] T025 [P] [US1] Square コンポーネントのテストファイルを確認/作成 tests/components/Square.test.tsx
- [ ] T026 [P] [US1] 選択状態のときオレンジの枠が表示されるテストを追加
- [ ] T027 [P] [US1] 非選択状態のときオレンジの枠が表示されないテストを追加
- [ ] T028 [US1] npm test -- Square.test.tsx を実行してテストが失敗することを確認（Red）

### Implementation for User Story 1 (TDD: Green Phase)

- [ ] T029 [US1] Square.tsx で選択時の枠スタイルを特定
- [ ] T030 [US1] 選択時の枠クラスを border-4 border-orange-600 に変更
- [ ] T031 [US1] 非選択時の枠クラスが border border-gray-400 であることを確認
- [ ] T032 [US1] npm test -- Square.test.tsx を実行してすべてのテストが通ることを確認（Green）
- [ ] T033 [US1] npm run dev で動作確認（駒選択時にオレンジ色の枠が表示されることを確認）

**チェックポイント**: User Story 1 と User Story 4 が両方とも独立して動作

---

## Phase 5: User Story 2 - 空マスクリック時の無反応 (Priority: P1)

**Goal**: 空マスをクリックしても何も起こらない。枠が表示されない。

**Independent Test**: 空のマス目をクリックし、何も起こらないことを確認。

### Tests for User Story 2

- [ ] T034 [P] [US2] ShogiBoard コンポーネントのテストファイルを確認 tests/components/ShogiBoard.test.tsx
- [ ] T035 [US2] 空マスをクリックしても選択されないテストを追加（すでに T010 で canSelectPiece がカバー）
- [ ] T036 [US2] 複数の空マスを連続クリックしても選択されないテストを追加
- [ ] T037 [US2] npm test を実行してテストが通ることを確認

### Validation for User Story 2

- [ ] T038 [US2] npm run dev で手動確認（空マスをクリックしても枠が出ないことを確認）
- [ ] T039 [US2] 複数の空マスを連続クリックして動作を確認

**チェックポイント**: User Stories 1, 2, 4 がすべて独立して動作

---

## Phase 6: User Story 3 - 視認性の高い枠色の使用 (Priority: P2)

**Goal**: 選択枠の色が #EA580C（オレンジ）または類似の茶色系であり、黒色でないことを確認。

**Independent Test**: 駒を選択し、枠の色を目視または開発者ツールで確認。

### Implementation for User Story 3

- [ ] T040 [US3] Square.tsx の選択枠クラスが border-orange-600 (#EA580C) であることを確認
- [ ] T041 [US3] ブラウザの開発者ツールで実際の色を確認
- [ ] T042 [US3] 盤面背景色（#C8B560）とのコントラストを目視確認
- [ ] T043 [US3] WCAGコントラスト基準を満たすことをオンラインツールで検証
- [ ] T044 [US3] 代替色（#C2410C, #92400E）をコメントで記録

### Visual Validation for User Story 3

- [ ] T045 [US3] 複数のブラウザ（Chrome, Firefox, Safari）で色の表示を確認
- [ ] T046 [US3] ライトモード/ダークモードでの表示を確認（該当する場合）

**チェックポイント**: すべてのユーザーストーリーが独立して機能

---

## Phase 7: Polish & Cross-Cutting Concerns

**目的**: 複数のユーザーストーリーに影響する改善

### Code Quality

- [ ] T047 [P] npm run lint でリントエラーがないことを確認
- [ ] T048 [P] npm run format で自動フォーマットを実行
- [ ] T049 [P] npm run check ですべてのチェックが通ることを確認

### Integration Testing

- [ ] T050 手番切り替え時に選択状態がリセットされることを確認
- [ ] T051 駒移動完了後に選択枠が消えることを確認
- [ ] T052 同じ駒を再度クリックすると選択が解除される（トグル動作）ことを確認

### Documentation

- [ ] T053 [P] JSDoc コメントをすべての関数に追加（日本語）
- [ ] T054 [P] src/logic/selectionLogic.ts にモジュールレベルのコメントを追加
- [ ] T055 実装に基づいて quickstart.md の内容が正確か確認

### Performance Validation

- [ ] T056 駒クリックから枠表示までの応答時間が100ミリ秒以内であることを確認
- [ ] T057 React DevTools Profiler で不要な再レンダリングがないことを確認

### Final Validation

- [ ] T058 すべてのテストが通ることを最終確認（npm test）
- [ ] T059 仕様書の全受入シナリオを手動で検証
- [ ] T060 README.md または CHANGELOG.md に変更内容を記録

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存関係なし - すぐに開始可能
- **Foundational (Phase 2)**: Setup 完了後 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3-6)**: Foundational フェーズ完了後
  - 推奨順序: US4 → US1 → US2 → US3（優先度順）
  - US4, US1, US2 は P1（必須）、US3 は P2（推奨）
- **Polish (Phase 7)**: すべての必要なユーザーストーリー完了後

### User Story Dependencies

- **User Story 4 (P1)**: Foundational 後に開始可能 - 他のストーリーへの依存なし（基盤）
- **User Story 1 (P1)**: US4 完了後 - US4の選択ロジックに依存
- **User Story 2 (P1)**: US4 完了後 - US4の選択ロジックに依存（実質的にUS4でカバー済み）
- **User Story 3 (P2)**: US1 完了後 - US1の視覚的フィードバックの改善

### Within Each User Story

1. **Tests First** (TDD): テストを書き、失敗を確認（Red）
2. **Implementation**: 最小限の実装でテストを通す（Green）
3. **Integration**: 既存コンポーネントとの統合
4. **Validation**: 手動テストで動作確認

### Parallel Opportunities

#### Phase 1 (Setup)
- T001-T004 すべて並列実行可能

#### Phase 2 (Foundational)
- T005-T008 並列実行可能（コードリーディング）

#### Phase 3 (User Story 4)
- **Tests**: T009-T014 すべて並列でテストケース作成可能
- **Implementation**: T016-T019 は順次実行（同一ファイル）
- **Integration**: T021-T023 は順次実行（同一ファイル）

#### Phase 4 (User Story 1)
- **Tests**: T025-T027 並列でテストケース作成可能

#### Phase 5 (User Story 2)
- **Tests**: T034-T036 並列でテストケース作成可能

#### Phase 6 (User Story 3)
- T040-T044 並列実行可能（検証タスク）

#### Phase 7 (Polish)
- T047-T049 並列実行可能（異なるツール）
- T053-T054 並列実行可能（異なるファイル）

---

## Parallel Example: User Story 4

複数の開発者が同時に作業する場合の例：

**Developer A** (Tests):
```
T009 → T010 → T011 → T012 → T013 → T014 → T015 (Red確認)
```

**Developer B** (Implementation - Aの完了後):
```
T016 → T017 → T018 → T019 → T020 (Green確認)
```

**Developer C** (Integration - Bの完了後):
```
T021 → T022 → T023 → T024 (動作確認)
```

**Solo Developer**:
```
Phase 1 → Phase 2 → US4 (T009-T024) → US1 (T025-T033) → US2 (T034-T039) → US3 (T040-T046) → Phase 7 (T047-T060)
```

---

## MVP Scope

**推奨MVPスコープ**: Phase 1 + Phase 2 + Phase 3 (User Story 4) + Phase 4 (User Story 1)

これにより、以下の基本機能が提供されます：
- ✅ 手番による駒選択制限
- ✅ 選択時のオレンジ色の枠表示
- ✅ 空マスや相手の駒をクリックしても何も起こらない

User Story 2 は実質的に User Story 4 でカバーされるため、MVP に含まれます。
User Story 3（視認性）は推奨ですが、MVP 後に追加可能です。

---

## Implementation Strategy

1. **TDD Approach**: すべての実装はテストファーストで進める
   - Red: テストを書いて失敗を確認
   - Green: 最小限の実装でテストを通す
   - Refactor: コードをクリーンに（必要に応じて）

2. **Incremental Delivery**: ユーザーストーリーごとに完成させる
   - 各ストーリー完了時にデモ可能な状態を維持
   - 早期にフィードバックを得る機会を作る

3. **Independent Testing**: 各ユーザーストーリーは独立してテスト可能
   - US4 単独で「手番制限」をテスト
   - US1 単独で「視覚的フィードバック」をテスト
   - US2 単独で「空マス無反応」をテスト（実質US4でカバー）
   - US3 単独で「枠色の視認性」をテスト

4. **Constitution Compliance**: すべてのタスクで憲法準拠
   - 日本語でのコメント記述
   - テスト駆動開発の徹底
   - ドキュメントの同時更新

---

## Summary

**Total Tasks**: 60
**Test Tasks**: 15（T009-T015, T025-T028, T034-T037）
**Implementation Tasks**: 32（T016-T024, T029-T033, T038-T046, T050-T052）
**Setup/Infrastructure Tasks**: 8（T001-T008）
**Polish Tasks**: 5（T047-T049, T053-T060）

**Task Count per User Story**:
- User Story 4 (P1): 16 タスク（T009-T024）
- User Story 1 (P1): 9 タスク（T025-T033）
- User Story 2 (P1): 6 タスク（T034-T039）
- User Story 3 (P2): 7 タスク（T040-T046）

**Parallel Opportunities**: 約20タスクが並列実行可能（[P]マーク付き）

**Suggested MVP**: Phase 1-4（T001-T033）= 33 タスク、推定3-4時間

**Format Validation**: ✅ すべてのタスクがチェックリストフォーマット（`- [ ] [TaskID] [P?] [Story?] Description with file path`）に準拠
