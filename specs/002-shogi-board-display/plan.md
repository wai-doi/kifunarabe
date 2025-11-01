# Implementation Plan: 将棋盤と駒の初期配置表示

**Branch**: `002-shogi-board-display` | **Date**: 2025-11-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-shogi-board-display/spec.md`

<!-- 注意: このテンプレートから生成される実装計画は、憲法に従い日本語で記述してください -->

## Summary

トップページに9×9の将棋盤と40枚の駒を初期配置で表示する機能を実装する。将棋盤は木製風の薄茶色(#D4A574)、駒は日本語テキスト文字で濃茶色(#8B4513)、背景は畳風の黄緑がかった茶色(#C8B560)で表示する。レスポンシブ対応し、最小300x300ピクセルで表示する。React + TypeScript + Tailwind CSSを使用し、CSS GridまたはFlexboxで将棋盤のレイアウトを構築する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A (静的な初期配置データのみ、状態管理は将来のフェーズ)
**Testing**: Vitest (React Testing Library使用予定)
**Target Platform**: モダンブラウザ(Chrome、Firefox、Safari、Edge最新版・1つ前), グレースフルデグラデーション対応
**Project Type**: Webアプリケーション(フロントエンドのみ)
**Performance Goals**:
  - 将棋盤表示: 1秒以内
  - 全駒配置完了: 2秒以内
  - 60fps でのレスポンシブリサイズ
**Constraints**:
  - 最小表示サイズ: 300x300ピクセル
  - 駒のフォントサイズ: マス目の70%
  - 画像アセット不使用(テキストのみ)
**Scale/Scope**:
  - 単一ページ
  - 81マス(9×9)
  - 40枚の駒
  - 状態管理なし(静的表示のみ)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されている
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在する
- [x] **テスト駆動**: テスト戦略が明確 - Vitestでコンポーネントのレンダリングと配色をテスト
- [x] **ドキュメント優先**: data-model.md(将棋盤・駒・マス目の構造), quickstart.md(開発環境セットアップ)を作成予定
- [x] **シンプルさ**: 外部状態管理ライブラリ不使用、Reactの基本機能のみ使用、複雑性なし

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Board.tsx           # 将棋盤コンポーネント(9×9グリッド)
│   ├── Square.tsx          # マス目コンポーネント
│   ├── Piece.tsx           # 駒コンポーネント(テキスト表示)
│   └── ShogiBoard.tsx      # 統合コンポーネント(Board + Pieces)
├── types/
│   ├── piece.ts            # 駒の型定義
│   ├── position.ts         # 座標の型定義
│   └── board.ts            # 将棋盤の型定義
├── data/
│   └── initialPosition.ts  # 初期配置データ
├── App.tsx                 # メインアプリケーション
├── main.tsx               # エントリーポイント
└── index.css              # グローバルスタイル

tests/
├── components/
│   ├── Board.test.tsx
│   ├── Square.test.tsx
│   ├── Piece.test.tsx
│   └── ShogiBoard.test.tsx
└── data/
    └── initialPosition.test.ts
```

**Structure Decision**: シンプルなコンポーネントベースの構造を採用。将棋盤(Board)、マス目(Square)、駒(Piece)の3つの基本コンポーネントを組み合わせて、統合コンポーネント(ShogiBoard)を構築する。状態管理は不要なため、propsによるデータの受け渡しのみを使用する。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

違反なし - すべての憲法原則に準拠している。

---

## Phase 0: Research (完了)

すべての技術的決定が完了しました。詳細は [research.md](./research.md) を参照してください。

### 主要な決定事項

1. **レイアウト**: CSS Grid (9×9の均等グリッドに最適)
2. **駒の表示**: 日本語テキスト + font-size: 70%
3. **駒の向き**: CSS transform: rotate(180deg)
4. **レスポンシブ**: vmin単位 + min-width/height
5. **スタイリング**: Tailwind CSS + カスタムCSS
6. **データ管理**: TypeScript定数配列
7. **テスト**: Vitest + React Testing Library
8. **アクセシビリティ**: ARIA属性による最小限の対応

---

## Phase 1: Design & Contracts (完了)

以下のドキュメントが作成されました:

### 1. データモデル ([data-model.md](./data-model.md))

- **Piece**: 駒の型定義(type, player, file, rank)
- **Position**: 座標の型定義(file, rank)
- **BoardState**: 将棋盤の状態
- **INITIAL_POSITION**: 40枚の駒の初期配置データ

### 2. コンポーネント契約 ([contracts/README.md](./contracts/README.md))

- **ShogiBoard**: 統合コンポーネント
- **Board**: グリッドレイアウト
- **Square**: マス目の表示
- **Piece**: 駒の表示

データフロー: INITIAL_POSITION → ShogiBoard → Board → Square → Piece

### 3. クイックスタートガイド ([quickstart.md](./quickstart.md))

- 開発環境のセットアップ
- TDDワークフロー
- テストの実行方法
- コーディング規約

### 4. エージェントコンテキスト更新

GitHub Copilotの設定ファイルが更新されました:
- 追加技術: TypeScript 5.9.3 + React 19.1.1, Tailwind CSS 4.1.16, Vite 7.1.7
- プロジェクトタイプ: Webアプリケーション

---

## Constitution Check (Phase 1後の再確認)

Phase 1完了後の憲法準拠を再確認:

- [x] **日本語優先**: research.md, data-model.md, contracts/, quickstart.md すべて日本語で記述
- [x] **Speckit準拠**: 仕様書に基づいて計画が作成され、すべてのドキュメントが揃っている
- [x] **テスト駆動**: quickstart.mdにTDDワークフローが明記され、テスト戦略が確立
- [x] **ドキュメント優先**: 実装前にすべての設計ドキュメントが完成
- [x] **シンプルさ**: 複雑性の導入なし、必要最小限の技術スタック

---

## 次のステップ

Phase 0とPhase 1が完了しました。次は `/speckit.tasks` コマンドを実行して、実装タスクの分解を行ってください。

**コマンド**: `/speckit.tasks`

これにより、以下が作成されます:
- `tasks.md`: 実装タスクのチェックリスト
- 各タスクの依存関係と優先順位
- 見積もり時間と実装順序
