# Tasks: 将棋盤と駒の初期配置表示

**Input**: Design documents from `/specs/002-shogi-board-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

**Tests**: テスト駆動開発(TDD)を採用。各実装タスクの前に対応するテストタスクを配置。

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーを独立して実装・テスト可能。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能(異なるファイル、依存関係なし)
- **[Story]**: このタスクが属するユーザーストーリー(例: US1, US2, US3)
- 説明には正確なファイルパスを含む

## Path Conventions

プロジェクトルートから:
- ソースコード: `src/`
- テスト: `tests/`
- ドキュメント: `specs/001-shogi-board-display/`

---

## Phase 1: Setup (共通インフラストラクチャ)

**Purpose**: プロジェクト初期化と基本構造の準備

- [ ] T001 Vitestとテストライブラリをインストール: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui`
- [ ] T002 [P] Vitestの設定ファイルを作成: `vitest.config.ts`に設定を追加(jsdom環境、グローバル設定)
- [ ] T003 [P] package.jsonにテストスクリプトを追加: `test`, `test:ui`, `test:coverage`
- [ ] T004 [P] テストセットアップファイルを作成: `tests/setup.ts`にReact Testing Libraryの設定を追加

---

## Phase 2: Foundational (ブロッキング前提条件)

**Purpose**: すべてのユーザーストーリーの実装前に完了が必須のコア基盤

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

- [ ] T005 型定義ファイルを作成: `src/types/piece.ts`にPieceType, Player, Piece型を定義
- [ ] T006 [P] 型定義ファイルを作成: `src/types/position.ts`にPosition型を定義
- [ ] T007 [P] 型定義ファイルを作成: `src/types/board.ts`にBoardState, SquareProps型を定義
- [ ] T008 初期配置データを作成: `src/data/initialPosition.ts`にINITIAL_POSITION配列(40枚の駒)を定義
- [ ] T009 初期配置データのテストを作成: `tests/data/initialPosition.test.ts`に配列長、重複チェック、王/玉の検証テストを作成
- [ ] T010 初期配置データのテストを実行して失敗を確認
- [ ] T011 初期配置データを実装してテストを通す

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並列開始可能

---

## Phase 3: User Story 1 - 将棋盤の表示 (Priority: P1) 🎯 MVP

**Goal**: 9×9のマス目で構成された将棋盤をトップページに表示する

**Independent Test**: ブラウザでトップページを開き、81個のマス目が境界線とともに表示されることを確認

### Tests for User Story 1

> **注意: 実装前にテストを作成し、失敗を確認してから実装する**

- [ ] T012 [P] [US1] Squareコンポーネントのテストを作成: `tests/components/Square.test.tsx`にマス目のレンダリング、境界線、ARIA属性のテストを作成
- [ ] T013 [P] [US1] Boardコンポーネントのテストを作成: `tests/components/Board.test.tsx`に81個のSquareがレンダリングされるテスト、グリッドレイアウト、ARIA属性のテストを作成
- [ ] T014 [US1] テストを実行して失敗を確認(コンポーネント未実装のため)

### Implementation for User Story 1

- [ ] T015 [P] [US1] Squareコンポーネントを実装: `src/components/Square.tsx`にマス目を表示するコンポーネントを作成(position propsを受け取り、境界線をスタイリング)
- [ ] T016 [US1] Boardコンポーネントを実装: `src/components/Board.tsx`に9×9のCSS Gridレイアウトを作成し、81個のSquareをレンダリング
- [ ] T017 [US1] Boardコンポーネントに配色を適用: 将棋盤の背景色(#D4A574)、境界線のスタイリングをTailwind CSSで実装
- [ ] T018 [US1] Boardコンポーネントにレスポンシブサイズを実装: 最小300x300px、最大90vminのサイズ制約をCSSで設定
- [ ] T019 [US1] App.tsxを更新: `src/App.tsx`にBoardコンポーネントを配置し、ページ背景色(#C8B560)を適用
- [ ] T020 [US1] テストを実行して成功を確認
- [ ] T021 [US1] ブラウザで手動確認: `npm run dev`で開発サーバーを起動し、将棋盤が正しく表示されることを確認

**Checkpoint**: この時点で、User Story 1は完全に機能し、独立してテスト可能

---

## Phase 4: User Story 2 - 駒の初期配置表示 (Priority: P2)

**Goal**: 将棋盤上に40枚の駒を初期配置で表示する

**Independent Test**: ブラウザでトップページを開き、将棋盤上に40枚の駒が正しい位置に表示され、先手の駒は上向き、後手の駒は下向きになっていることを確認

### Tests for User Story 2

- [ ] T022 [P] [US2] Pieceコンポーネントのテストを作成: `tests/components/Piece.test.tsx`に駒の文字表示、色(#8B4513)、後手の駒の回転(rotate-180)、ARIA属性のテストを作成
- [ ] T023 [P] [US2] ShogiBoardコンポーネントのテストを作成: `tests/components/ShogiBoard.test.tsx`に40枚の駒がレンダリングされるテスト、初期配置データが正しく使用されるテストを作成
- [ ] T024 [US2] テストを実行して失敗を確認

### Implementation for User Story 2

- [ ] T025 [P] [US2] Pieceコンポーネントを実装: `src/components/Piece.tsx`に駒を表示するコンポーネントを作成(piece propsを受け取り、typeを表示、playerに応じて回転)
- [ ] T026 [US2] Pieceコンポーネントにスタイリングを適用: フォントサイズ70%、色#8B4513、中央配置、transform: rotate(180deg)を後手の駒に適用
- [ ] T027 [US2] Squareコンポーネントを更新: `src/components/Square.tsx`にpiece propsを追加し、駒があればPieceコンポーネントをレンダリング
- [ ] T028 [US2] ShogiBoardコンポーネントを実装: `src/components/ShogiBoard.tsx`にINITIAL_POSITIONを使用してBoardとPieceを統合
- [ ] T029 [US2] ShogiBoardのヘルパー関数を実装: 指定されたfile/rankに対応する駒を見つける関数を実装
- [ ] T030 [US2] App.tsxを更新: `src/App.tsx`のBoardをShogiBoardに置き換え
- [ ] T031 [US2] テストを実行して成功を確認
- [ ] T032 [US2] ブラウザで手動確認: 40枚の駒が正しい位置に表示され、向きが正しいことを確認

**Checkpoint**: この時点で、User Story 1とUser Story 2の両方が独立して動作

---

## Phase 5: User Story 3 - レスポンシブ表示 (Priority: P3)

**Goal**: 異なる画面サイズで将棋盤と駒が適切にスケーリングされる

**Independent Test**: ブラウザのウィンドウサイズを変更し、将棋盤と駒が自動的にリサイズされることを確認。モバイルビュー(480px)とデスクトップビュー(1024px)で確認

### Tests for User Story 3

- [ ] T033 [P] [US3] レスポンシブテストを作成: `tests/components/ShogiBoard.test.tsx`に異なるビューポートサイズでのレンダリングテストを追加
- [ ] T034 [P] [US3] 最小サイズのテストを作成: 300px未満のウィンドウでスクロールバーが表示されることを確認するテストを追加
- [ ] T035 [US3] テストを実行して失敗を確認

### Implementation for User Story 3

- [ ] T036 [US3] ShogiBoardコンポーネントにレスポンシブスタイルを追加: `src/components/ShogiBoard.tsx`にvmin単位を使用したサイズ調整を実装
- [ ] T037 [US3] 最小サイズ制約を確認: min-width/heightが300pxで正しく動作することを確認
- [ ] T038 [US3] グレースフルデグラデーションのスタイルを追加: 古いブラウザ用のフォールバックCSSを追加
- [ ] T039 [US3] index.cssにビューポート設定を追加: `src/index.css`にレスポンシブ対応のための基本設定を追加
- [ ] T040 [US3] テストを実行して成功を確認
- [ ] T041 [US3] 複数デバイスで手動確認: Chrome DevToolsのデバイスモードで、スマートフォン、タブレット、デスクトップの各サイズで確認

**Checkpoint**: すべてのユーザーストーリーが独立して機能

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数のユーザーストーリーに影響する改善

- [ ] T042 [P] アクセシビリティの最終確認: すべてのARIA属性が正しく設定されているか確認
- [ ] T043 [P] パフォーマンス測定: Lighthouseで将棋盤表示が1秒以内、駒配置が2秒以内であることを確認
- [ ] T044 [P] コードの整理とリファクタリング: コンポーネントの責任分離、重複コードの削除
- [ ] T045 [P] 日本語コメントの追加: すべてのコンポーネントと関数に日本語のJSDocコメントを追加
- [ ] T046 [P] ESLintとPrettierでコード品質をチェック: `npm run lint`を実行してエラーを修正
- [ ] T047 [P] 本番ビルドのテスト: `npm run build`を実行し、ビルドが成功することを確認
- [ ] T048 quickstart.mdの検証: 新規開発者がquickstart.mdの手順に従って環境をセットアップできることを確認
- [ ] T049 READMEの更新: プロジェクトルートのREADME.mdに機能の説明とスクリーンショットを追加
- [ ] T050 最終統合テスト: すべてのユーザーストーリーが統合された状態で正しく動作することを確認

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存関係なし - すぐに開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3+)**: すべてFoundationalフェーズの完了に依存
  - ユーザーストーリーは並列実行可能(リソースがあれば)
  - または優先順位順に実行(P1 → P2 → P3)
- **Polish (Final Phase)**: すべての必要なユーザーストーリーの完了に依存

### User Story Dependencies

- **User Story 1 (P1)**: Foundational (Phase 2)の後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P2)**: Foundational (Phase 2)の後に開始可能 - US1と統合するが独立してテスト可能
- **User Story 3 (P3)**: Foundational (Phase 2)の後に開始可能 - US1/US2と統合するが独立してテスト可能

### Within Each User Story

- テストは実装前に作成し、失敗を確認
- モデル/型定義 → コンポーネント → 統合の順
- コア実装 → スタイリング → 統合の順
- ストーリー完了後、次の優先順位に移行

### Parallel Opportunities

- Phase 1のすべての[P]タスクは並列実行可能
- Phase 2のすべての[P]タスク(型定義)は並列実行可能
- Foundationalフェーズ完了後、すべてのユーザーストーリーを並列開始可能(チーム容量があれば)
- 各ユーザーストーリー内の[P]タスクは並列実行可能
- 異なるユーザーストーリーは異なるチームメンバーが並列作業可能

---

## Parallel Example: User Story 1

同時に作業可能:
```
T012 (Squareテスト) || T013 (Boardテスト)
↓
T014 (テスト失敗確認)
↓
T015 (Square実装) || T016開始の準備
↓
T016 (Board実装) - T015に依存
↓
T017 (配色) || T018 (レスポンシブ) - 両方T016に依存だが並列可能
↓
T019 (App.tsx更新)
↓
T020 (テスト成功確認) || T021 (手動確認) - 並列可能
```

---

## Implementation Strategy

### MVP Scope (最小実行可能製品)

**推奨MVP**: User Story 1のみ
- 将棋盤の表示(9×9グリッド)
- 基本的な配色とレイアウト
- これだけで価値のあるデモが可能

### Incremental Delivery (段階的デリバリー)

1. **MVP (US1)**: 将棋盤の表示 → デモ可能
2. **Phase 2 (US1 + US2)**: 駒の配置追加 → 実用的な機能
3. **Full Feature (US1 + US2 + US3)**: レスポンシブ対応 → 完全な機能

### Quality Gates (品質ゲート)

各ユーザーストーリーの完了時:
- ✅ すべてのテストが通る
- ✅ 手動確認が成功する
- ✅ 独立テスト基準を満たす
- ✅ 憲法準拠(日本語コメント、TDD、ドキュメント)

---

## Task Summary

**Total Tasks**: 50
- Setup: 4 tasks
- Foundational: 7 tasks
- User Story 1: 10 tasks
- User Story 2: 11 tasks
- User Story 3: 9 tasks
- Polish: 9 tasks

**Parallel Opportunities**: 24 tasks marked [P]

**Independent Test Criteria**:
- US1: 将棋盤のマス目構造が表示される
- US2: 40枚の駒が正しい位置に表示される
- US3: 画面サイズに応じてスケーリングされる

**Suggested MVP**: User Story 1 (Tasks T001-T021)

**Estimated Timeline**:
- MVP (US1): 2-3日
- MVP + US2: 4-5日
- Full Feature (US1-US3): 6-7日
- With Polish: 8-10日

**Format Validation**: ✅ すべてのタスクがチェックボックス形式に従っています
