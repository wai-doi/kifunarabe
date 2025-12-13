# プロジェクト概要
- 名称: kifunarabe — 将棋の棋譜を並べて学習するWebアプリ。
- 目的: 盤面表示と駒操作を通じて棋譜学習を支援。現在はフロントエンド中心で各フェーズのUI実装を進行。
- 技術スタック: TypeScript 5.9 / React 19 / Vite 7 / Tailwind CSS 4 / Vitest + RTL。ESLint + Prettier。
- 構成: frontend中心 (src/, tests/, public/, specs/フェーズ別ドキュメント)。specs/011-realistic-piece-design が現行タスク。
- ブラウザ依存: localStorage使用フェーズあり(009)、現フェーズはUIのみ。