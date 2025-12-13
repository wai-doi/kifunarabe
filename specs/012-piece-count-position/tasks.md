# Tasks: 持ち駒の数字表示位置変更

**Input**: /specs/012-piece-count-position/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/layout-spec.md, quickstart.md

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明には正確なファイルパスを含める

## Phase 1: Setup (Shared Infrastructure)

**目的**: プロジェクトの初期化と基本構造の確認

- [x] T001 package.json の依存関係を確認し、必要に応じてインストール (root/package.json)
- [x] T002 既存のテストベースラインを確認して現在の状態を把握 (tests/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**目的**: 全ユーザーストーリーの実装前に完了すべきコアインフラストラクチャ

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの実装は開始できません

- [x] T003 数字表示のスタイル定数をpieceStyle.tsに追加 (src/components/pieceStyle.ts)
- [x] T004 CapturedPiecesコンポーネント用のテストスケルトンを準備 (tests/components/CapturedPieces.test.tsx)

**Checkpoint**: 基盤が整い、ユーザーストーリーの実装を並列で開始可能

---

## Phase 3: User Story 1 - 持ち駒の数字を駒の右下に配置 (Priority: P1) 🎯 MVP

**Goal**: 2枚以上の持ち駒がある場合、その枚数を駒の右下に小さく表示する

**Independent Test**: 複数枚の持ち駒を持った状態で持ち駒エリアを表示し、数字が駒の文字の右下に配置されているか、1枚の場合は数字が表示されないかを確認

### Tests for User Story 1

> **NOTE: これらのテストを最初に作成し、実装前に失敗することを確認する**

- [x] T005 [P] [US1] 2枚以上の持ち駒で数字が右下に表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T006 [P] [US1] 1枚のみの持ち駒で数字が表示されないことを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T007 [P] [US1] 先手・後手ともに数字が画面上の物理的な右下に配置されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T008 [P] [US1] 2桁の数字（10枚以上）も適切に表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)

### Implementation for User Story 1

- [x] T009 [US1] CapturedPieces.tsxの駒コンテナにposition: relativeを追加（未設定の場合） (src/components/CapturedPieces.tsx)
- [x] T010 [US1] 数字の表示ロジックを変更：「×{count}」から「{count}」に変更し、position: absoluteで右下に配置 (src/components/CapturedPieces.tsx)
- [x] T011 [US1] 数字のフォントサイズを駒の文字の60%に設定（CAPTURED_FONT_SIZE * 0.6） (src/components/CapturedPieces.tsx)
- [x] T012 [US1] 数字の配置位置を指定（right: 2px, bottom: 2px, z-index: 10） (src/components/CapturedPieces.tsx)
- [x] T013 [US1] pointer-events: noneを数字に追加してクリックイベントを駒のボタンに透過 (src/components/CapturedPieces.tsx)

**Checkpoint**: この時点で、数字が駒の右下に配置され、1枚の場合は表示されず、独立して機能することを確認

---

## Phase 4: User Story 2 - 数字のサイズと色の視認性 (Priority: P2)

**Goal**: 数字が駒の文字よりも小さく、かつ適切な色で表示される

**Independent Test**: 複数枚の持ち駒を持った状態で、数字のサイズが駒の文字より小さく、木目調の背景に対してコントラストがあることを確認

### Tests for User Story 2

- [x] T014 [P] [US2] 数字のフォントサイズが駒の文字の50-70%であることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T015 [P] [US2] 数字の色が#5C4033（濃い茶色）で表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T016 [P] [US2] 成り駒の場合、駒の文字は赤色、数字は濃い茶色で表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)

### Implementation for User Story 2

- [x] T017 [US2] pieceStyle.tsに数字の色定数を追加（COUNT_COLOR: '#5C4033', COUNT_COLOR_SELECTED: '#3E2723'） (src/components/pieceStyle.ts)
- [x] T018 [US2] CapturedPieces.tsxで数字の色をCOUNT_COLORに設定 (src/components/CapturedPieces.tsx)
- [x] T019 [US2] 成り駒の場合でも数字の色は通常の色（COUNT_COLOR）を使用するロジックを実装 (src/components/CapturedPieces.tsx)
- [x] T020 [US2] font-weightを600（やや太め）に設定して視認性を向上 (src/components/CapturedPieces.tsx)

**Checkpoint**: この時点で、数字のサイズと色が適切に設定され、User Story 1と2が両方とも独立して機能することを確認

---

## Phase 5: User Story 3 - 選択状態での数字の可視性 (Priority: P3)

**Goal**: 持ち駒を選択した状態でも数字が見える

**Independent Test**: 複数枚の持ち駒を選択した状態で、数字が適切に表示され、ハイライトと干渉していないことを確認

### Tests for User Story 3

- [x] T021 [P] [US3] 選択状態でも数字が表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T022 [P] [US3] 選択時に数字の色がCOUNT_COLOR_SELECTEDに変更されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)
- [x] T023 [P] [US3] z-indexにより数字がハイライトより前面に表示されることを検証するテストを追加 (tests/components/CapturedPieces.test.tsx)

### Implementation for User Story 3

- [x] T024 [US3] 選択状態の判定（isSelected）を追加し、数字の色を動的に変更 (src/components/CapturedPieces.tsx)
- [x] T025 [US3] 選択時の数字の色をCOUNT_COLOR_SELECTED（#3E2723）に設定 (src/components/CapturedPieces.tsx)
- [x] T026 [US3] z-indexが10以上であることを確認し、必要に応じて調整 (src/components/CapturedPieces.tsx)

**Checkpoint**: 全てのユーザーストーリーが独立して機能することを確認

---

## Phase 6: Polish & Cross-Cutting Concerns

**目的**: 複数のユーザーストーリーに影響する改善

- [x] T027 [P] quickstart.mdに沿って視覚的な確認を実施 (specs/012-piece-count-position/quickstart.md)
- [x] T028 [P] 全テストを実行してリグレッションがないことを確認 (`npm test`)
- [x] T029 [P] ESLintとPrettierでコード品質を確認 (`npm run check`)
- [x] T030 [P] レスポンシブ対応の確認：モバイルデバイスでも数字が判読可能か視覚的に確認（calc(clamp(...) * 0.6)によりレスポンシブ対応済み）
- [x] T031 [P] アクセシビリティの確認：aria-labelに枚数が含まれているか確認 (tests/components/CapturedPieces.test.tsx)
- [x] T032 [P] エッジケースの確認：10枚以上の2桁の数字が適切に表示されるか確認
- [x] T033 コードレビューと憲法準拠の確認（日本語コメント、シンプルさ、ドキュメント更新）
- [x] T034 quickstart.mdとdata-model.mdを最新の実装に合わせて更新（必要に応じて）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - すぐに開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - 全ユーザーストーリーをブロック
- **User Stories (Phase 3+)**: 全てFoundationalフェーズの完了に依存
  - ユーザーストーリーは並列で進行可能（スタッフがいる場合）
  - または優先順位順に順次実行（P1 → P2 → P3）
- **Polish (Final Phase)**: 希望する全てのユーザーストーリーの完了に依存

### User Story Dependencies

- **User Story 1 (P1)**: Foundational (Phase 2) 完了後に開始可能 - 他のストーリーに依存しない
- **User Story 2 (P2)**: Foundational (Phase 2) 完了後に開始可能 - US1と統合するが、独立してテスト可能
- **User Story 3 (P3)**: Foundational (Phase 2) 完了後に開始可能 - US1/US2と統合するが、独立してテスト可能

### Within Each User Story

- テストを最初に作成し、実装前に失敗することを確認
- スタイル定数 → 基本実装 → 詳細調整の順
- ストーリーが完了してから次の優先度に移行

### Parallel Opportunities

- 全てのSetupタスク（[P]マーク）は並列実行可能
- 全てのFoundationalタスク（[P]マーク）は並列実行可能（Phase 2内）
- Foundationalフェーズ完了後、全てのユーザーストーリーを並列で開始可能（チーム容量による）
- 各ユーザーストーリー内で[P]マークのテストは並列実行可能
- 異なるユーザーストーリーは異なるチームメンバーが並列作業可能

---

## Parallel Example: User Story 1

### Scenario: 2人のチームメンバー

**Member A**:
1. T005 - 2枚以上のテスト
2. T007 - 先手・後手のテスト
3. T009 - position: relative追加
4. T011 - フォントサイズ設定

**Member B**:
1. T006 - 1枚のみのテスト
2. T008 - 2桁のテスト
3. T010 - 数字の表示ロジック変更
4. T012 - 配置位置指定

**統合**: T013でpointer-eventsを追加して完了

---

## Implementation Strategy

### MVP Scope (最小限の価値提供)

MVP = User Story 1 のみ実装:
- 数字が駒の右下に配置される
- 1枚の場合は数字が表示されない
- 先手・後手で統一された配置

この時点で、基本的な視認性向上が実現され、ユーザーに価値を提供できます。

### Incremental Delivery

1. **MVP (User Story 1)**: 数字の基本配置 - 即座に価値提供
2. **Enhanced (User Story 2)**: サイズと色の最適化 - 視認性のさらなる向上
3. **Polished (User Story 3)**: 選択状態への対応 - ユーザー体験の完成

各段階で独立したテストとデプロイが可能です。

---

## Task Completion Checklist

各タスク完了時に以下を確認:

- [ ] 実装がspec.mdの要件を満たしている
- [ ] テストが追加・更新され、全て成功している
- [ ] 日本語でコメントが記述されている
- [ ] ESLintエラーがない (`npm run lint`)
- [ ] Prettierでフォーマット済み (`npm run format`)
- [ ] 既存のテストがすべてパスしている (`npm test`)
- [ ] 変更が関連ドキュメント（data-model.md、contracts/など）と整合している

---

## Notes

- このタスクリストはspec.mdのUser Stories（P1, P2, P3）に基づいて構成されています
- 各フェーズは独立してテスト可能で、段階的なデリバリーが可能です
- テストは実装の前に作成し、TDDアプローチに従います
- 全てのタスクはquickstart.mdの手順と整合しています
- 憲法に従い、全てのコメントとドキュメントは日本語で記述します
