# kifunarabe Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-01

<!-- 注意: このファイルから生成される開発ガイドラインは、憲法に従い日本語で記述してください -->

## Active Technologies
- TypeScript 5.9.3 + React 19.1.1, Tailwind CSS 4.1.16, Vite 7.1.7 (002-shogi-board-display)
- N/A (静的な初期配置データのみ、状態管理は将来のフェーズ) (002-shogi-board-display)
- TypeScript 5.9.3 + React 19.1.1 (Hooks: useState), Tailwind CSS 4.1.16, Vite 7.1.7 (003-piece-movement)
- N/A (クライアント側の状態管理のみ、永続化は将来のフェーズ) (003-piece-movement)
- N/A (クライアント側の状態管理のみ、ページリロード時は初期状態にリセット) (004-turn-based-movement)
- N/A（クライアント側の状態管理のみ） (006-piece-drop)
- TypeScript 5.9.3 + React 19.1.1 (useState), Tailwind CSS 4.1.16, Vite 7.1.7 (008-move-history-navigation)
- N/A（クライアント側の状態管理のみ、履歴はメモリ内配列） (008-move-history-navigation)
- TypeScript 5.9.3 + React 19.1.1 + React Hooks (useState, useEffect), ブラウザ標準API (localStorage) (009-auto-save-state)
- localStorage (ブラウザ標準API) (009-auto-save-state)
- TypeScript 5.9.3 + React 19.1.1, Vite 7.1.7 (010-prevent-double-pawn)

- TypeScript 5.x (厳格な型チェックを有効化) (001-kifu-viewer-app)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x (厳格な型チェックを有効化): Follow standard conventions

## Recent Changes
- 010-prevent-double-pawn: Added TypeScript 5.9.3 + React 19.1.1, Vite 7.1.7
- 009-auto-save-state: Added TypeScript 5.9.3 + React 19.1.1 + React Hooks (useState, useEffect), ブラウザ標準API (localStorage)
- 008-move-history-navigation: Added TypeScript 5.9.3 + React 19.1.1 (useState), Tailwind CSS 4.1.16, Vite 7.1.7


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
