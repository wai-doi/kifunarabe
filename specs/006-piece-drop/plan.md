# Implementation Plan: 持ち駒を打つ機能

**Branch**: `006-piece-drop` | **Date**: 2025-11-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-piece-drop/spec.md`

## Summary

プレイヤーが持ち駒を盤上の空きマスに打つ機能を実装する。既存の駒移動機能に加えて、持ち駒エリアからの駒選択と盤面への配置を可能にする。005-piece-captureで実装した持ち駒管理の仕組みを活用し、選択状態の拡張と打つロジックを追加する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A（クライアント側の状態管理のみ）
**Testing**: Vitest 3.2.4 + Testing Library
**Target Platform**: Webブラウザ
**Project Type**: Single（フロントエンドのみ）
**Performance Goals**: 60fps UI操作、即座のレスポンス
**Constraints**: <100ms の操作レスポンス
**Scale/Scope**: 将棋盤1面、2プレイヤー

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

以下の憲法原則への準拠を確認:

- [x] **日本語優先**: 全てのドキュメント・コメントは日本語で記述されているか
- [x] **Speckit準拠**: 仕様書 (spec.md) が承認され、このプラン作成前に存在するか
- [x] **テスト駆動**: テスト戦略が明確で、実装前のテスト作成が計画されているか
- [x] **ドキュメント優先**: 実装前に作成すべきドキュメント (data-model.md, contracts/) が特定されているか
- [x] **シンプルさ**: 複雑性の導入は Complexity Tracking セクションで正当化されているか

## Project Structure

### Documentation (this feature)

```text
specs/006-piece-drop/
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
│   ├── ShogiBoard.tsx    # 選択状態の拡張（持ち駒選択を追加）
│   ├── CapturedPieces.tsx # クリック可能に拡張
│   ├── Board.tsx
│   ├── Square.tsx
│   ├── Piece.tsx
│   └── TurnDisplay.tsx
├── logic/
│   ├── dropLogic.ts      # 新規: 持ち駒を打つロジック
│   ├── captureLogic.ts   # 持ち駒操作（削除関数を追加）
│   ├── boardState.ts
│   ├── moveRules.ts
│   └── turnControl.ts
├── types/
│   ├── selection.ts      # 新規: 選択状態の型定義
│   ├── capturedPieces.ts
│   ├── piece.ts
│   ├── position.ts
│   ├── board.ts
│   └── turn.ts
└── data/
    └── initialPosition.ts

tests/
├── components/
│   ├── ShogiBoard.test.tsx # 持ち駒打ちの統合テスト
│   └── CapturedPieces.test.tsx # クリックハンドラのテスト
└── logic/
    └── dropLogic.test.ts   # 新規: 打つロジックのユニットテスト
```

**Structure Decision**: 既存の単一プロジェクト構造を維持。新規ファイルは `logic/dropLogic.ts` と `types/selection.ts` の2つのみ。既存コンポーネントを拡張することでシンプルさを保つ。

## Complexity Tracking

> **該当なし** - 新規の設計パターンや複雑な構造の導入なし。既存の構造を拡張するのみ。
