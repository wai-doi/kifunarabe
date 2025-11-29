# Implementation Plan: 駒の成り機能

**Branch**: `007-piece-promotion` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-piece-promotion/spec.md`

## Summary

駒が敵陣（相手側3段）に入った時、敵陣から出た時、または敵陣内で移動した時に、成る/成らないを選択できる機能を実装する。既存のPiece型に`promoted: boolean`フラグを追加し、成り駒の移動パターン（歩・香・桂・銀→金の動き、飛→竜、角→馬）を実装する。成り選択UIは移動先のマス目付近にポップアップ表示する。

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.1.1, Tailwind CSS 4.1.16, Vite 7.1.7
**Storage**: N/A（クライアント側の状態管理のみ）
**Testing**: Vitest 3.2.4 + Testing Library
**Target Platform**: Web ブラウザ（デスクトップ・モバイル）
**Project Type**: single（フロントエンドのみの React アプリ）
**Performance Goals**: 60fps（UIアニメーション）、成り選択UIは即座に表示
**Constraints**: 成り選択中は他の操作をブロック、ゲーム状態の一貫性を維持
**Scale/Scope**: 単一プレイヤーのローカルアプリ、9x9の将棋盤

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
specs/007-piece-promotion/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - フロントエンドのみ)
└── tasks.md             # Phase 2 output
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
│   ├── ShogiBoard.tsx
│   ├── Square.tsx
│   ├── TurnDisplay.tsx
│   └── PromotionDialog.tsx    # 新規: 成り選択UI
├── data/
│   └── initialPosition.ts
├── logic/
│   ├── boardState.ts
│   ├── captureLogic.ts
│   ├── dropLogic.ts
│   ├── moveRules.ts           # 拡張: 成り駒の移動パターン
│   ├── turnControl.ts
│   └── promotionLogic.ts      # 新規: 成り判定ロジック
└── types/
    ├── board.ts
    ├── capturedPieces.ts
    ├── movePattern.ts
    ├── piece.ts               # 拡張: promoted フラグ追加
    ├── position.ts
    ├── selection.ts
    └── turn.ts

tests/
├── components/
│   └── PromotionDialog.test.tsx  # 新規
└── logic/
    └── promotionLogic.test.ts    # 新規
```

**Structure Decision**: 既存のsingle project構造を維持。成り機能のためのロジック（promotionLogic.ts）とUI（PromotionDialog.tsx）を追加。既存のPiece型とmoveRulesを拡張する。

## Complexity Tracking

> 憲法違反なし。シンプルな拡張アプローチを採用。

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
