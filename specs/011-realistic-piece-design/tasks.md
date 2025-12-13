# Tasks: リアルな将棋駒デザイン

**Input**: /specs/011-realistic-piece-design/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 package.json の依存関係をインストールして環境を整備 (root/package.json)
- [ ] T002 既存テストのベースラインを確認して現在の状態を把握 (tests/)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 五角形形状・色・影の定数をまとめるユーティリティを作成 (src/components/pieceStyle.ts)
- [ ] T004 Pieceコンポーネント用のテストスケルトンを準備し共通renderを整備 (tests/components/Piece.test.tsx)

**Checkpoint**: ここまで完了で全ユーザーストーリー着手可

---

## Phase 3: User Story 1 - 五角形の駒形状による視覚的認識 (Priority: P1) 🎯 MVP

**Goal**: 全ての駒を五角形で表示し、先手/後手の向きを正しく反映する
**Independent Test**: 盤面表示で全駒が五角形かつ先手は下向き・後手は上向きに見える

### Tests for User Story 1

- [ ] T005 [P] [US1] 五角形clip-pathと先手/後手の回転を検証するテストを追加 (tests/components/Piece.test.tsx)
- [ ] T006 [P] [US1] 持ち駒でも五角形が適用されることを確認するテストを追加 (tests/components/Piece.test.tsx)

### Implementation for User Story 1

- [ ] T007 [US1] Piece.tsxでclip-pathと先手/後手のtransformを実装 (src/components/Piece.tsx)
- [ ] T008 [P] [US1] 持ち駒ボタンに五角形スタイルを適用しサイズを調整 (src/components/CapturedPieces.tsx)
- [ ] T009 [P] [US1] 五角形スタイルの共通クラス/スタイルをindex.cssに追加し適用 (src/index.css)

**Checkpoint**: 盤面と持ち駒が五角形で向きも正しいことを確認

---

## Phase 4: User Story 2 - 駒の質感表現 (Priority: P2)

**Goal**: 木目調の質感と立体感を駒に付与する
**Independent Test**: 駒の背景が木目調グラデーションで陰影が付き、選択時にハイライトが見える

### Tests for User Story 2

- [ ] T010 [P] [US2] 木目調グラデーションと基本陰影の適用を検証するテストを追加 (tests/components/Piece.test.tsx)
- [ ] T011 [P] [US2] 選択状態でハイライト陰影が変化することを検証するテストを追加 (tests/components/Piece.test.tsx)

### Implementation for User Story 2

- [ ] T012 [US2] Piece.tsxに木目調背景と基本box-shadowを適用 (src/components/Piece.tsx)
- [ ] T013 [P] [US2] 持ち駒ボタンにも同じ質感と陰影を反映 (src/components/CapturedPieces.tsx)
- [ ] T014 [P] [US2] index.cssの共通スタイルに木目調と陰影ユーティリティを追加 (src/index.css)

**Checkpoint**: 駒全体に木目調と立体感が一貫して反映されていることを確認

---

## Phase 5: User Story 3 - 駒の文字の視認性向上 (Priority: P3)

**Goal**: 五角形内で文字が明瞭に読めるようフォント・配置を最適化する
**Independent Test**: 盤面と持ち駒の文字が中央配置され、サイズ調整と成り駒の赤色が判読性を満たす

### Tests for User Story 3

- [ ] T015 [P] [US3] 文字の中央配置とclampフォントサイズを検証するテストを追加 (tests/components/Piece.test.tsx)
- [ ] T016 [P] [US3] 成り駒の赤色と通常の茶色のコントラストを検証するテストを追加 (tests/components/Piece.test.tsx)

### Implementation for User Story 3

- [ ] T017 [US3] Piece.tsxでフォント配置・clampサイズ・通常/成りの文字色を実装 (src/components/Piece.tsx)
- [ ] T018 [P] [US3] 持ち駒の文字サイズと配置を小サイズ向けに最適化 (src/components/CapturedPieces.tsx)

**Checkpoint**: 全ての駒で文字が中央・判読性良好で色分けが正しいことを確認

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] 仕様に沿った視覚確認を実施しスクリーンショットを取得 (quickstart.md に沿って確認)
- [ ] T020 [P] 全テスト実行で回帰確認 (tests/)
- [ ] T021 [P] ESLint/Prettierチェックを実行しスタイルを整える (package.json scripts)
- [ ] T022 成果物とガイドを更新・要点を記録 (specs/011-realistic-piece-design/quickstart.md)

---

## Dependencies & Execution Order

- Setup → Foundational → US1 (P1) → US2 (P2) → US3 (P3) → Polish
- US1完了後にUS2/US3に進むのが安全。Foundational完了まではユーザーストーリー着手不可。

### User Story Dependencies
- US1: Foundational完了後に開始。独立して動作確認可能。
- US2: US1の形状が前提。US1完了後に開始。
- US3: US1の形状とUS2の背景/陰影が前提。US2完了後に開始。

### Parallel Opportunities
- [P] マークは別ファイルかつ依存なしで並行可能
- 各ユーザーストーリーのテスト追加タスクは並行可 (tests/components/Piece.test.tsx での追記は競合注意)
- UI実装タスクはPiece.tsxとCapturedPieces.tsxで並行可 (同一ファイル編集はシリアル実施)
- Polish段階のテスト・lintは並行で実行可

## Implementation Strategy

- **MVP**: US1完了時点で五角形形状と向きが成立。ここで一度デモ可能。
- **Incremental**: US2で質感追加、US3で文字視認性を改善。各フェーズ後にテストと手動確認。
- **Testing**: 各USのテストを先に書き、Red→Green→Refactorで進める。
