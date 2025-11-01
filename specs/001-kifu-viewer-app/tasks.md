---

description: "Task list template for feature implementation"
---

# Tasks: 棋譜並べWebアプリケーション - 初期セットアップ

**Input**: Design documents from `/specs/001-kifu-viewer-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

<!-- 注意: このテンプレートから生成されるタスクリストは、憲法に従い日本語で記述してください -->

**Tests**: 初期セットアップフェーズではテストフレームワークの導入は含まれません（Phase 2で追加予定）。

**Organization**: タスクはユーザーストーリーごとにグループ化され、各ストーリーの独立した実装とテストを可能にします。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明に正確なファイルパスを含める

## Path Conventions

- **フロントエンドのみ**: リポジトリルートに `src/`, `public/`, 設定ファイル
- `plan.md`の構造に基づいてパスを調整

---

## Phase 1: Setup (共有インフラストラクチャ)

**Purpose**: プロジェクトの初期化と基本構造の作成

- [x] T001 プロジェクトルートディレクトリの作成と初期化
- [x] T002 Vite + React + TypeScriptプロジェクトの作成（`npm create vite@latest kifunarabe -- --template react-ts`）
- [x] T003 基本的な依存関係のインストール（`npm install`）
- [x] T004 [P] .gitignoreファイルの確認と調整
- [x] T005 [P] READMEファイルの作成（プロジェクト概要とセットアップ手順）

---

## Phase 2: Foundational (ブロッキング前提条件)

**Purpose**: すべてのユーザーストーリーが実装される前に完了しなければならないコアインフラストラクチャ

**⚠️ CRITICAL**: このフェーズが完了するまで、ユーザーストーリーの作業は開始できません

### Tailwind CSSのセットアップ

- [x] T006 Tailwind CSS依存関係のインストール（`npm install -D tailwindcss postcss autoprefixer`）
- [x] T007 Tailwind CSS設定ファイルの生成（`npx tailwindcss init -p`）
- [x] T008 tailwind.config.jsの設定（contentパスの指定）
- [x] T009 postcss.config.jsの確認
- [x] T010 src/index.cssにTailwindディレクティブを追加

### TypeScript設定の最適化

- [x] T011 [P] tsconfig.jsonの厳格な型チェック設定の確認と調整
- [x] T012 [P] tsconfig.node.jsonの確認

### Vite設定

- [x] T013 [P] vite.config.tsの基本設定の確認

**Checkpoint**: 基盤準備完了 - ユーザーストーリーの実装を並行して開始可能

---

## Phase 3: User Story 2 - 開発環境の構築 (Priority: P1) 🎯 MVP Part 1

**Goal**: 開発者がプロジェクトのセットアップを完了し、依存関係をインストールして開発環境を構築できる

**Independent Test**: クリーンな環境でセットアップ手順を実行し、依存関係のインストールと開発サーバーの起動が成功することを確認

### 実装タスク

- [x] T014 [US2] package.jsonのスクリプトセクションの確認（dev, build, preview）
- [x] T015 [US2] 依存関係の整合性確認（`npm install`の実行テスト）
- [x] T016 [US2] TypeScript型チェックの実行確認（`npx tsc --noEmit`）

**Checkpoint**: この時点で、開発環境のセットアップが完全に機能し、独立してテスト可能

---

## Phase 4: User Story 3 - プロジェクト構造の確認 (Priority: P2)

**Goal**: 開発者がプロジェクトのファイル・ディレクトリ構造を確認し、標準的なプロジェクト構成を理解できる

**Independent Test**: プロジェクトのディレクトリ構造を確認し、設定ファイル、ソースコードディレクトリ、エントリーポイントなどが存在することを検証

### 実装タスク

- [x] T017 [P] [US3] public/ディレクトリの作成とvite.svgファイルの配置
- [x] T018 [P] [US3] src/componentsディレクトリの作成
- [x] T019 [US3] プロジェクト構造の文書化（README.mdに追加）

**Checkpoint**: プロジェクト構造が標準的で、開発者が理解しやすい状態

---

### Phase 5: User Story 1（アプリケーションの初期アクセス - P1）

**並列不可**: すべてのタスクがUIロジックに関連し、順次実行が必要

- [x] T020 index.htmlファイルの編集（タイトル、meta情報、lang属性）
- [x] T021 src/App.tsxの実装（トップ画面のコンポーネント設計、Tailwind CSSでのスタイリング）
- [x] T022 src/main.tsxの確認（Reactのエントリーポイント、ReactDOMのマウントロジック）
- [x] T023 src/App.cssの削除（Tailwind CSSを使用するため）
- [x] T024 開発サーバーの起動確認（`npm run dev`）
- [x] T025 ブラウザでのトップ画面表示確認（http://localhost:5173）
- [x] T026 ブラウザコンソールでのエラー確認（エラーがないことを確認）
- [x] T027 本番用ビルドの実行確認（`npm run build`）
- [x] T028 ビルドしたアプリケーションのプレビュー確認（`npm run preview`）

---

### Phase 6: Polish（最終調整）

**並列実行可能**: [P]マークがある場合

- [x] T029 [P] README.mdの完成（セットアップ手順、利用可能なコマンド、トラブルシューティング）
- [x] T030 [P] package.jsonのメタデータ更新（name, description, author）
- [x] T031 [P] 未使用ファイルの削除（react.svgなどのデフォルトアセット）
- [x] T032 コードの最終確認とクリーンアップ
- [x] T033 quickstart.mdの手順に従って動作確認

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 複数のユーザーストーリーに影響する改善

- [ ] T029 [P] README.mdの完成（セットアップ手順、利用可能なコマンド、トラブルシューティング）
- [ ] T030 [P] package.jsonのメタデータ更新（name, description, author）
- [ ] T031 [P] 未使用ファイルの削除（react.svgなどのデフォルトアセット）
- [ ] T032 コードの最終確認とクリーンアップ
- [ ] T033 quickstart.mdの手順に従って動作確認

---

## Dependencies & Execution Order

### フェーズの依存関係

- **Setup (Phase 1)**: 依存関係なし - 即座に開始可能
- **Foundational (Phase 2)**: Setupの完了に依存 - すべてのユーザーストーリーをブロック
- **User Stories (Phase 3+)**: すべてFoundationalフェーズの完了に依存
  - ユーザーストーリーは並行して進行可能（スタッフがいる場合）
  - または優先順位順に順次進行（P1 → P2 → P3）
- **Polish (Final Phase)**: 希望するすべてのユーザーストーリーの完了に依存

### ユーザーストーリーの依存関係

- **User Story 2 (P1)**: Foundational (Phase 2) 後に開始可能 - 他のストーリーへの依存なし
- **User Story 3 (P2)**: Foundational (Phase 2) 後に開始可能 - 他のストーリーへの依存なし
- **User Story 1 (P1)**: Foundational (Phase 2) とUser Story 2の完了後に開始 - 開発環境が必要

### 各ユーザーストーリー内

- 設定ファイル → UIコンポーネント → 動作確認の順序
- コア実装 → 統合前
- ストーリー完了 → 次の優先順位に移動

### 並列実行の機会

- すべての[P]マーク付きSetupタスクは並行実行可能
- すべての[P]マーク付きFoundationalタスクは並行実行可能（Phase 2内）
- Foundationalフェーズ完了後、User Story 2とUser Story 3は並行して開始可能（チームキャパシティが許す場合）
- 異なるユーザーストーリーは異なるチームメンバーによって並行作業可能

---

## Parallel Example: Setup Phase

```bash
# Phase 1内の並列タスク:
Task: "T004 [P] .gitignoreファイルの確認と調整"
Task: "T005 [P] READMEファイルの作成"

# Phase 2内の並列タスク:
Task: "T011 [P] tsconfig.jsonの厳格な型チェック設定の確認"
Task: "T012 [P] tsconfig.node.jsonの確認"
Task: "T013 [P] vite.config.tsの基本設定の確認"
```

---

## Parallel Example: User Story Implementation

```bash
# Foundational完了後、これらのストーリーを並行して開始可能:
Task: "Phase 3: User Story 2 - 開発環境の構築"
Task: "Phase 4: User Story 3 - プロジェクト構造の確認"

# Phase 6の並列タスク:
Task: "T029 [P] README.mdの完成"
Task: "T030 [P] package.jsonのメタデータ更新"
Task: "T031 [P] 未使用ファイルの削除"
```

---

## Implementation Strategy

### MVP First (最小限のユーザーストーリー)

1. Phase 1を完了: Setup
2. Phase 2を完了: Foundational (CRITICAL - すべてのストーリーをブロック)
3. Phase 3を完了: User Story 2（開発環境の構築）
4. Phase 5を完了: User Story 1（アプリケーションの初期アクセス）
5. **停止して検証**: トップ画面が正しく表示されることを独立してテスト
6. 準備ができたらデモ/デプロイ

### Incremental Delivery

1. Setup + Foundational完了 → 基盤準備完了
2. User Story 2追加 → 独立してテスト → MVP準備完了
3. User Story 1追加 → 独立してテスト → デプロイ/デモ（MVP!）
4. User Story 3追加 → 独立してテスト → デプロイ/デモ
5. 各ストーリーは以前のストーリーを壊すことなく価値を追加

### Parallel Team Strategy

複数の開発者がいる場合:

1. チームでSetup + Foundationalを一緒に完了
2. Foundational完了後:
   - 開発者A: User Story 2
   - 開発者B: User Story 3
   - 開発者C: User Story 1（US2の完了後）
3. ストーリーは独立して完了し、統合される

---

## Summary

**総タスク数**: 33タスク

**ユーザーストーリー別タスク数**:
- User Story 1（アプリケーションの初期アクセス - P1）: 9タスク
- User Story 2（開発環境の構築 - P1）: 3タスク
- User Story 3（プロジェクト構造の確認 - P2）: 3タスク

**並列実行の機会**:
- Phase 1: 2タスクが並列実行可能
- Phase 2: 7タスクが並列実行可能
- Phase 3-4: 2つのストーリーが並列実行可能
- Phase 6: 3タスクが並列実行可能

**推奨MVPスコープ**:
- Phase 1: Setup
- Phase 2: Foundational
- Phase 3: User Story 2（開発環境の構築）
- Phase 5: User Story 1（アプリケーションの初期アクセス）

**独立テスト基準**:
- US1: ブラウザでトップ画面が表示され、エラーがないこと
- US2: 依存関係のインストールと開発サーバーの起動が成功すること
- US3: プロジェクト構造が標準的で理解しやすいこと

**フォーマット検証**: ✅ すべてのタスクがチェックリスト形式に従っています（チェックボックス、ID、ラベル、ファイルパス）

---

## Notes

- [P]タスク = 異なるファイル、依存関係なし
- [Story]ラベルは特定のユーザーストーリーにタスクをマッピングしてトレーサビリティを確保
- 各ユーザーストーリーは独立して完了およびテスト可能
- 各タスクまたは論理的なグループの後にコミット
- 任意のチェックポイントで停止してストーリーを独立して検証
- 避けるべき: 曖昧なタスク、同じファイルの競合、独立性を壊すストーリー間の依存関係
