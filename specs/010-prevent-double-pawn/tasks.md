# Tasks: 二歩禁止ルール

**Input**: Design documents from `/specs/010-prevent-double-pawn/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（US1, US2, US3）
- 説明には正確なファイルパスを含める

## Phase 1: Setup（セットアップ）

**目的**: 新しいファイルの作成とプロジェクト構造の準備

- [x] T001 [P] 型定義ファイルを作成 src/types/validation.ts
- [x] T002 [P] 二歩検証ロジックファイルを作成 src/logic/doublePawnValidation.ts
- [x] T003 [P] テストファイルを作成 tests/logic/doublePawnValidation.test.ts

---

## Phase 2: Foundational（基盤実装）

**目的**: 全てのユーザーストーリーで使用される共通の検証ロジックを実装

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

- [x] T004 ValidationErrorCode型を定義 src/types/validation.ts
- [x] T005 ValidationResult型を定義 src/types/validation.ts
- [x] T006 [P] hasUnpromotedPawnInFile関数のテストを作成 tests/logic/doublePawnValidation.test.ts
- [x] T007 hasUnpromotedPawnInFile関数を実装 src/logic/doublePawnValidation.ts
- [x] T008 テストを実行してhasUnpromotedPawnInFile関数が正しく動作することを確認

**チェックポイント**: 基盤実装完了 - ユーザーストーリーの実装を並列開始可能

---

## Phase 3: User Story 1 - 二歩を打とうとしたときに警告する (Priority: P1) 🎯 MVP

**目標**: 同じ筋に歩が既に存在する場合、二歩として検出し、打ち手を拒否してエラーメッセージを表示

**Independent Test**: 3筋に歩がある状態で、3筋に歩を打とうとする → システムが拒否し、「二歩は反則です」と表示される

### Tests for User Story 1

> **注意: これらのテストを最初に書き、実装前に失敗することを確認してください**

- [x] T009 [P] [US1] 基本的な二歩検証のテストケースを作成 tests/logic/doublePawnValidation.test.ts
  - 同じ筋に歩がある場合はtrueを返す
  - 異なる筋に歩がある場合はfalseを返す
  - 空の盤面の場合はfalseを返す

- [x] T010 [P] [US1] 成り駒の扱いに関するテストケースを作成 tests/logic/doublePawnValidation.test.ts
  - 同じ筋に成り駒（と金）がある場合はfalseを返す（成り駒は歩扱いではない）
  - 成り駒と未成の歩が混在する場合、未成の歩のみをカウント

- [x] T011 [P] [US1] プレイヤー別の二歩判定テストケースを作成 tests/logic/doublePawnValidation.test.ts
  - 先手の歩がある筋に後手は歩を打てる（相手の歩は影響しない）
  - 全ての筋（1-9筋）で正しく判定される

- [x] T012 [P] [US1] validateDoublePawn関数のテストケースを作成 tests/logic/doublePawnValidation.test.ts
  - 二歩の場合、isValid=false、errorCode='DOUBLE_PAWN'を返す
  - 打てる場合、isValid=trueを返す
  - 歩以外の駒の場合、二歩チェックをスキップしてisValid=trueを返す

### Implementation for User Story 1

- [x] T013 [US1] validateDoublePawn関数を実装 src/logic/doublePawnValidation.ts
  - 駒種が歩でない場合は即座にisValid=trueを返す
  - 歩の場合、hasUnpromotedPawnInFileを呼び出して二歩判定
  - 二歩の場合、適切なエラー情報を含むValidationResultを返す

- [x] T014 [US1] getErrorMessage関数を実装 src/logic/doublePawnValidation.ts
  - DOUBLE_PAWN → "二歩は反則です"
  - OUT_OF_BOARD → "盤面外には打てません"
  - SQUARE_OCCUPIED → "既に駒があるマスには打てません"

- [x] T015 [US1] テストを実行してvalidateDoublePawn関数が全てのテストケースを通過することを確認

- [x] T016 [US1] canDropPiece関数を拡張 src/logic/dropLogic.ts
  - オプショナルパラメータpieceTypeとplayerを追加
  - 既存のチェック（盤面内、占有）を維持
  - pieceType='歩'かつplayerが指定されている場合、hasUnpromotedPawnInFileを呼び出し
  - 二歩の場合はfalseを返す

- [x] T017 [US1] canDropPiece関数のテストを追加 tests/logic/dropLogic.test.ts
  - 既存のテストが全て通過することを確認（後方互換性）
  - 新しいパラメータを使用した二歩検証のテストを追加
  - 二歩の場合はfalseを返すことを確認
  - 歩以外の駒の場合は二歩チェックをスキップすることを確認

- [x] T018 [US1] エラーメッセージの状態管理を追加 src/App.tsx
  - errorMessage状態を追加（useState<string | null>(null)）
  - setErrorMessage関数をBoardコンポーネントに渡す

- [x] T019 [US1] エラーメッセージ表示UIを実装 src/App.tsx
  - errorMessageがnullでない場合、エラーバナーを表示
  - 「閉じる」ボタンでerrorMessageをnullにセット
  - Tailwind CSSでスタイリング

- [x] T020 [US1] Boardコンポーネントで二歩検証を統合 src/components/Board.tsx
  - 駒を打つハンドラーでcanDropPieceを呼び出し、pieceTypeとplayerを渡す
  - canDropPieceがfalseを返した場合、setErrorMessage("二歩は反則です")を呼び出し
  - 手番を変更せず、ユーザーが別の打ち手を選択できる状態を維持

- [x] T021 [US1] 統合テストを実行して全体の動作を確認
  - npm testを実行し、全てのテストが通過することを確認
  - 手動テスト: アプリを起動し、二歩を打とうとしてエラーメッセージが表示されることを確認

**チェックポイント**: User Story 1が完全に機能し、独立してテスト可能

---

## Phase 4: User Story 2 - 打てるマス目の視覚的表示 (Priority: P2)

**目標**: 持ち駒の歩を選択したとき、二歩にならない筋の空きマス目のみをハイライト表示

**Independent Test**: 1筋、3筋、5筋に歩がある状態で、持ち駒の歩を選択 → 2筋、4筋、6筋、7筋、8筋、9筋の空きマスのみがハイライトされる

### Tests for User Story 2

- [x] T022 [P] [US2] getValidPawnDropSquares関数のテストケースを作成 tests/logic/doublePawnValidation.test.ts
  - 歩がある筋を除外した空きマスのリストを返す
  - 成り駒がある筋は除外しない（打てる）
  - 相手の歩がある筋は除外しない

### Implementation for User Story 2

- [x] T023 [US2] getValidPawnDropSquares関数を実装 src/logic/doublePawnValidation.ts
  - 盤面上の全ての空きマスを取得（81マス - 駒の数）
  - 各マスについて、その筋にhasUnpromotedPawnInFileを呼び出し
  - 二歩にならないマスのみをフィルタリングして返す

- [x] T024 [US2] テストを実行してgetValidPawnDropSquares関数が正しく動作することを確認

- [x] T025 [US2] Boardコンポーネントで打てる候補マスを計算 src/components/Board.tsx
  - useMemoを使用して、selectedCapturedPieceとpiecesが変更された時のみ再計算
  - selectedCapturedPiece.type === '歩'の場合、getValidPawnDropSquaresを呼び出し
  - 歩以外の駒の場合は、全ての空きマスを候補として返す

- [x] T026 [US2] Squareコンポーネントにハイライト表示を追加 src/components/Square.tsx
  - isValidDropSquare propsを追加
  - isValidDropSquare=trueの場合、ハイライトクラスを適用
  - Tailwind CSSで視覚的に分かりやすいスタイル（例: 薄い緑の背景）

- [x] T027 [US2] Boardコンポーネントテストを追加 tests/components/Board.test.tsx
  - 歩を選択時、正しいマスがハイライトされることを確認
  - 二歩になるマスはハイライトされないことを確認
  - 歩以外の駒を選択時、全ての空きマスがハイライトされることを確認

- [x] T028 [US2] 統合テストを実行して視覚的表示が正しく動作することを確認
  - 手動テスト: 歩を選択し、二歩にならない筋のみがハイライトされることを確認

**チェックポイント**: User Story 1とUser Story 2が両方とも独立して動作

---

## Phase 5: User Story 3 - 二歩ルールの例外処理 (Priority: P3)

**目標**: 成り駒は歩としてカウントされないことを確認し、移動後の盤面でも正しく判定される

**Independent Test**: 5筋にと金がある状態で、5筋に歩を打つ → 成功する（と金は歩扱いではない）

### Tests for User Story 3

- [x] T029 [P] [US3] エッジケースのテストケースを追加 tests/logic/doublePawnValidation.test.ts
  - 歩が移動した後、元の筋に歩を打てることを確認
  - 歩が成ってと金になった後、同じ筋に歩を打てることを確認
  - 履歴をナビゲートして過去の局面に戻った場合の二歩判定を確認

### Implementation for User Story 3

- [x] T030 [US3] 既存の実装がエッジケースを正しく処理することを確認
  - hasUnpromotedPawnInFile関数が成り駒を除外していることを再確認
  - 履歴ナビゲーション時、現在の盤面状態に基づいて判定されることを確認

- [x] T031 [US3] エッジケースのテストを実行して全て通過することを確認

- [x] T032 [US3] 統合テストと手動テストでエッジケースを検証
  - 成り駒がある筋に歩を打てることを確認
  - 履歴を戻った後の二歩判定が正しいことを確認

**チェックポイント**: 全てのユーザーストーリーが独立して機能

---

## Phase 6: Polish & Cross-Cutting Concerns（仕上げ）

**目的**: 複数のユーザーストーリーに影響する改善と最終検証

- [x] T033 [P] パフォーマンステストを実行
  - 二歩検証が50ミリ秒以内で完了することを確認（SC-004）
  - 必要に応じて最適化

- [x] T034 [P] コードカバレッジを確認
  - npm run test:coverageを実行
  - カバレッジが90%以上であることを確認

- [x] T035 [P] ESLintとPrettierでコード品質をチェック
  - npm run checkを実行
  - 全てのlintエラーとフォーマットエラーを修正

- [x] T036 [P] 日本語コメントの確認
  - 全ての新規コードに適切な日本語コメントがあることを確認
  - JSDocコメントが日本語で記述されていることを確認

- [x] T037 quickstart.mdの手順を検証
  - quickstart.mdに記載された手順を実際に実行
  - 手順通りに動作することを確認

- [x] T038 最終的な統合テストとデモ
  - 全てのユーザーストーリーが正しく動作することを確認
  - エラーケースと正常ケースの両方をテスト
  - パフォーマンスと使いやすさを評価

---

## Dependencies & Execution Order（依存関係と実行順序）

### Phase Dependencies（フェーズの依存関係）

- **Setup (Phase 1)**: 依存関係なし - 即座に開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - 全てのユーザーストーリーをブロック
- **User Stories (Phase 3+)**: Foundationalフェーズの完了に依存
  - ユーザーストーリーは並列実行可能（リソースがあれば）
  - または優先順位順に順次実行（P1 → P2 → P3）
- **Polish (Final Phase)**: 実装したい全てのユーザーストーリーの完了に依存

### User Story Dependencies（ユーザーストーリーの依存関係）

- **User Story 1 (P1)**: Foundational (Phase 2)の後に開始可能 - 他のストーリーへの依存なし
- **User Story 2 (P2)**: Foundational (Phase 2)の後に開始可能 - US1と統合するが独立してテスト可能
- **User Story 3 (P3)**: Foundational (Phase 2)の後に開始可能 - US1/US2の実装に依存するが独立してテスト可能

### Within Each User Story（各ユーザーストーリー内）

- テスト → 実装前に作成し、失敗することを確認
- 基盤関数 → 統合前に実装
- UI統合 → ロジックの実装後
- ストーリー完了 → 次の優先度に移る前

### Parallel Opportunities（並列実行の機会）

- Setup: T001, T002, T003は全て並列実行可能
- Foundational Phase内の[P]マーク付きタスクは並列実行可能
- Foundationalフェーズ完了後、全てのユーザーストーリーを並列開始可能（チームのキャパシティがあれば）
- 各ユーザーストーリー内の[P]マーク付きテストタスクは並列実行可能

---

## Parallel Example: User Story 1（並列実行例）

```bash
# User Story 1の全てのテストを同時に開始:
T009: "基本的な二歩検証のテストケースを作成"
T010: "成り駒の扱いに関するテストケースを作成"
T011: "プレイヤー別の二歩判定テストケースを作成"
T012: "validateDoublePawn関数のテストケースを作成"

# これらのテストが全て失敗することを確認してから実装に進む
```

---

## Implementation Strategy（実装戦略）

### MVP First (User Story 1のみ)

1. Phase 1: Setupを完了
2. Phase 2: Foundationalを完了（重要 - 全てのストーリーをブロック）
3. Phase 3: User Story 1を完了
4. **停止して検証**: User Story 1を独立してテスト
5. 準備ができたらデプロイ/デモ

### Incremental Delivery（段階的デリバリー）

1. Setup + Foundational完了 → 基盤準備完了
2. User Story 1追加 → 独立してテスト → デプロイ/デモ（MVP！）
3. User Story 2追加 → 独立してテスト → デプロイ/デモ
4. User Story 3追加 → 独立してテスト → デプロイ/デモ
5. 各ストーリーが前のストーリーを壊すことなく価値を追加

### Parallel Team Strategy（並列チーム戦略）

複数の開発者がいる場合:

1. チーム全体でSetup + Foundationalを完了
2. Foundational完了後:
   - 開発者A: User Story 1
   - 開発者B: User Story 2
   - 開発者C: User Story 3
3. ストーリーが独立して完了し、統合される

---

## Summary（サマリー）

**総タスク数**: 38タスク

**ユーザーストーリー別タスク数**:
- User Story 1 (P1): 13タスク（テスト4 + 実装9）
- User Story 2 (P2): 7タスク（テスト1 + 実装6）
- User Story 3 (P3): 4タスク（テスト1 + 実装3）

**並列実行機会**:
- Setup: 3タスクを並列実行可能
- Foundational: 2テストタスクを並列実行可能
- User Story 1: 4テストタスクを並列実行可能
- User Story 2: 1テストタスクを並列実行可能
- User Story 3: 1テストタスクを並列実行可能
- Polish: 4タスクを並列実行可能

**Independent Test Criteria（独立テスト基準）**:
- User Story 1: 3筋に歩がある状態で3筋に歩を打つ → システムが拒否し、エラーメッセージ表示
- User Story 2: 歩を選択 → 二歩にならない筋のみハイライト
- User Story 3: 5筋にと金がある状態で5筋に歩を打つ → 成功

**推奨MVPスコープ**: User Story 1のみ（基本的な二歩検証とエラー表示）

---

## Notes（注意事項）

- [P]タスク = 異なるファイル、依存関係なし
- [Story]ラベル = 特定のユーザーストーリーへのタスクのマッピング
- 各ユーザーストーリーは独立して完了・テスト可能であるべき
- 実装前にテストが失敗することを確認
- 各タスクまたは論理的なグループ後にコミット
- 任意のチェックポイントで停止してストーリーを独立して検証
- 避けるべきこと: 曖昧なタスク、同じファイルの競合、ストーリーの独立性を壊す依存関係
