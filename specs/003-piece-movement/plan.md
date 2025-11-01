# Implementation Plan: 駒の移動機能

**Branch**: `003-piece-movement` | **Date**: 2025-11-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-piece-movement/spec.md`

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

将棋盤上で駒をクリックして選択し、移動先のマスをクリックすることで駒を移動できる機能を実装する。選択中の駒は視覚的に強調表示され、各駒の移動ルール(歩、香、桂、銀、金、飛、角、王)に従って移動可能なマスのみに移動できる。既に駒が存在するマスへの移動は禁止する。駒の成りと駒の取り合いは本フェーズでは実装しない。React Hooksによる状態管理を使用し、駒の選択状態と盤面状態を管理する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1 (Hooks: useState), Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A (クライアント側の状態管理のみ、永続化は将来のフェーズ)
**Testing**: Vitest (React Testing Library使用)
**Target Platform**: モダンブラウザ(Chrome、Firefox、Safari、Edge最新版)
**Project Type**: Webアプリケーション(フロントエンドのみ)
**Performance Goals**:
  - 駒の選択状態の視覚的表示: 0.1秒以内(SC-001)
  - 駒の移動完了: 0.2秒以内(SC-002)
  - 移動ルール判定: 即座に(同期処理)
**Constraints**:
  - 移動ルール判定の正確性: 100%(SC-003)
  - 選択状態の視認性: 90%以上のユーザーが識別可能(SC-004)
  - 操作の直感性: 90%以上のユーザーが初回使用時に理解(SC-005)
**Scale/Scope**:
  - 8種類の駒の移動ルール実装(歩、香、桂、銀、金、飛、角、王)
  - 選択状態の管理(1駒のみ選択可能)
  - 盤面状態の管理(81マス × 駒の有無)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述される
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在する
- [x] **テスト駆動**: テスト戦略が明確 - Vitestで駒の選択、移動ルール判定、状態管理をテスト
- [x] **ドキュメント優先**: data-model.md(選択状態・移動ルール), contracts/(コンポーネントインターフェース), quickstart.md(開発環境)を作成予定
- [x] **シンプルさ**: React Hooksの基本機能のみ使用、外部状態管理ライブラリ不使用、複雑性なし

## Project Structure

### Documentation (this feature)

```text
specs/003-piece-movement/
├── spec.md              # 仕様書
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── README.md        # コンポーネントインターフェース定義
├── checklists/
│   └── requirements.md  # 仕様品質チェックリスト
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Board.tsx           # 将棋盤コンポーネント (既存)
│   ├── Square.tsx          # マス目コンポーネント (既存 - 拡張: クリックハンドラー追加)
│   ├── Piece.tsx           # 駒コンポーネント (既存 - 拡張: 選択状態の視覚表示追加)
│   └── ShogiBoard.tsx      # 統合コンポーネント (既存 - 拡張: 状態管理・移動ロジック追加)
├── types/
│   ├── piece.ts            # 駒の型定義 (既存)
│   ├── position.ts         # 座標の型定義 (既存)
│   └── board.ts            # 将棋盤の型定義 (既存)
├── logic/                  # 新規ディレクトリ
│   ├── moveRules.ts        # 駒の移動ルール判定ロジック
│   └── boardState.ts       # 盤面状態管理ヘルパー関数
├── data/
│   └── initialPosition.ts  # 初期配置データ (既存)
├── App.tsx                 # メインアプリケーション (既存)
├── main.tsx               # エントリーポイント (既存)
└── index.css              # グローバルスタイル (既存)

tests/
├── components/
│   ├── Board.test.tsx      # (既存)
│   ├── Square.test.tsx     # (既存 - 拡張: クリックイベントテスト追加)
│   ├── Piece.test.tsx      # (既存 - 拡張: 選択状態テスト追加)
│   └── ShogiBoard.test.tsx # (既存 - 拡張: 移動ロジックテスト追加)
├── logic/                  # 新規ディレクトリ
│   ├── moveRules.test.ts   # 移動ルール判定のユニットテスト
│   └── boardState.test.ts  # 盤面状態管理のユニットテスト
└── data/
    └── initialPosition.test.ts  # (既存)
```

**Structure Decision**: 既存のコンポーネントベース構造を拡張する。新たに `logic/` ディレクトリを追加し、駒の移動ルール判定と盤面状態管理のロジックを分離する。これにより、ビジネスロジックとUIコンポーネントを分離し、テストしやすい設計とする。既存のコンポーネント(Square, Piece, ShogiBoard)にクリックハンドラーと状態管理機能を追加する。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

違反なし - すべての憲法原則に準拠している。

---

## Phase 0: Research (完了)

**ステータス**: ✅ 完了
**出力**: [research.md](./research.md)

調査完了項目:
1. ✅ React Hooksによる状態管理パターン → `useState`を採用
2. ✅ 駒の移動ルール実装パターン → 移動ベクトル + 経路チェック関数
3. ✅ 駒の選択状態の視覚表示 → Tailwind CSSクラスによる背景色・枠線
4. ✅ 移動ルール判定のパフォーマンス最適化 → 同期処理で十分
5. ✅ テスト戦略 → ユニットテスト + コンポーネントテストの2層構造

---

## Phase 1: Design & Contracts (完了)

**ステータス**: ✅ 完了

### 1. データモデル定義

**出力**: [data-model.md](./data-model.md)

定義完了エンティティ:
- ✅ Position (座標)
- ✅ Piece (駒)
- ✅ Board (盤面)
- ✅ SelectedState (選択状態)
- ✅ MovePattern (移動パターン)
- ✅ ValidMoves (移動可能マスの集合)

### 2. コンポーネントインターフェース定義

**出力**: [contracts/README.md](./contracts/README.md)

定義完了インターフェース:
- ✅ ShogiBoard Props & 内部状態
- ✅ Board Props
- ✅ Square Props
- ✅ Piece Props
- ✅ ロジック関数のシグネチャ (calculateValidMoves, isValidMove, isPathClear, etc.)

### 3. クイックスタートガイド

**出力**: [quickstart.md](./quickstart.md)

記載内容:
- ✅ 開発環境のセットアップ手順
- ✅ TDD実践ガイド
- ✅ 実装の推奨順序
- ✅ デバッグ方法
- ✅ コーディング規約

### 4. エージェントコンテキスト更新

**出力**: `.github/copilot-instructions.md` (自動更新)

更新内容:
- ✅ 使用技術の追加 (React Hooks, TypeScript 5.9.3)
- ✅ プロジェクト構造の更新
- ✅ テストコマンドの追加

---

## Constitution Check (再評価 - Phase 1 完了後)

*Phase 1 完了後の憲法準拠再確認*

- [x] **日本語優先**: すべてのドキュメントが日本語で記述されている
- [x] **Speckit準拠**: research.md, data-model.md, contracts/, quickstart.mdが作成された
- [x] **テスト駆動**: テスト戦略がresearch.mdとquickstart.mdに明記されている
- [x] **ドキュメント優先**: 実装前にすべての設計ドキュメントが完成している
- [x] **シンプルさ**: 外部ライブラリを追加せず、React標準機能のみ使用

**結論**: ✅ すべての憲法原則に準拠している

---

## Next Steps

Phase 2はこのコマンド(`/speckit.plan`)の範囲外です。次のフェーズに進むには:

### `/speckit.tasks` コマンドを実行

```
/speckit.tasks
```

このコマンドは:
1. `tasks.md` を生成
2. 実装タスクを具体的な作業単位に分解
3. 各タスクにテストケースを割り当て
4. 実装の順序を決定

### 手動で実装を開始する場合

1. `quickstart.md` のセットアップ手順に従う
2. TDDサイクルで実装を進める:
   - Red: テストを書く
   - Green: 実装する
   - Refactor: リファクタリング
3. `data-model.md` と `contracts/README.md` を参照しながら実装

---

## 生成されたアーティファクト

| ファイル | 説明 | ステータス |
|---------|------|----------|
| [spec.md](./spec.md) | 機能仕様書 | ✅ 完了 (/speckit.specify) |
| [plan.md](./plan.md) | 実装計画 (このファイル) | ✅ 完了 (/speckit.plan) |
| [research.md](./research.md) | 技術調査結果 | ✅ 完了 (/speckit.plan Phase 0) |
| [data-model.md](./data-model.md) | データモデル定義 | ✅ 完了 (/speckit.plan Phase 1) |
| [contracts/README.md](./contracts/README.md) | コンポーネントインターフェース | ✅ 完了 (/speckit.plan Phase 1) |
| [quickstart.md](./quickstart.md) | 開発環境セットアップガイド | ✅ 完了 (/speckit.plan Phase 1) |
| [checklists/requirements.md](./checklists/requirements.md) | 仕様品質チェックリスト | ✅ 完了 (/speckit.specify) |
| tasks.md | タスク分解 | ⏳ 未作成 (次: /speckit.tasks) |

---

## Summary

**Branch**: `003-piece-movement`
**Implementation Plan**: 完了
**Ready for**: タスク分解 (`/speckit.tasks`) または 実装開始
