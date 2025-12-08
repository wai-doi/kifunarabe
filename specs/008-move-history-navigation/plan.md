# Implementation Plan: 手順の巻き戻し・再生機能

**Branch**: `008-move-history-navigation` | **Date**: 2025-12-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-move-history-navigation/spec.md`

## Summary

将棋盤で指された手の履歴を管理し、「一手戻る」「一手進む」「初手に戻る」「最終手に進む」の4つのナビゲーション操作を提供する。各手の盤面状態（駒配置、持ち駒、手番）を完全に記録し、任意の手数に移動できるようにする。履歴の途中から新しい手を指した場合、それ以降の履歴は削除される。React の useState を使用した状態管理で実装し、手履歴の配列と現在位置のインデックスで管理する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1 (useState), Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A（クライアント側の状態管理のみ、履歴はメモリ内配列）
**Testing**: Vitest 3.2.4 + Testing Library
**Target Platform**: Web ブラウザ（デスクトップ・モバイル）
**Project Type**: single（フロントエンドのみの React アプリ）
**Performance Goals**: ナビゲーション操作は1秒以内、100手以上の履歴でも遅延なし
**Constraints**: 履歴の途中から新手を指すと以降の履歴削除、分岐は作成しない
**Scale/Scope**: 単一プレイヤーのローカルアプリ、履歴上限なし（実用上は数百手程度を想定）

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
specs/008-move-history-navigation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - フロントエンドのみ)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── App.tsx
├── index.css
├── main.tsx
├── components/
│   ├── Board.tsx
│   ├── CapturedPieces.tsx
│   ├── Piece.tsx
│   ├── ShogiBoard.tsx           # 拡張: 履歴管理とナビゲーション機能追加
│   ├── Square.tsx
│   ├── TurnDisplay.tsx
│   └── NavigationControls.tsx   # 新規: ナビゲーションボタンコンポーネント
├── data/
│   └── initialPosition.ts
├── logic/
│   ├── boardState.ts
│   ├── captureLogic.ts
│   ├── dropLogic.ts
│   ├── moveRules.ts
│   ├── turnControl.ts
│   ├── promotionLogic.ts
│   └── historyManager.ts        # 新規: 手履歴管理ロジック
└── types/
    ├── board.ts
    ├── capturedPieces.ts
    ├── movePattern.ts
    ├── piece.ts
    ├── position.ts
    ├── selection.ts
    ├── turn.ts
    └── history.ts               # 新規: 履歴関連の型定義

tests/
├── components/
│   └── NavigationControls.test.tsx  # 新規
└── logic/
    └── historyManager.test.ts       # 新規
```

**Structure Decision**: 既存のsingle project構造を維持。手履歴管理のためのロジック（historyManager.ts）とUI（NavigationControls.tsx）を追加。ShogiBoard.tsxに履歴状態を追加し、手を指すたびに履歴を記録する。

## Complexity Tracking

> 憲法違反なし。シンプルな配列ベースの履歴管理アプローチを採用。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
