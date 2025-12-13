# スタイルと規約
- 言語: 日本語でのドキュメント/出力。ASCII基本、既存Unicodeは維持。
- TypeScript厳格。Reactフック（useState/useEffect）採用。Tailwindクラス利用が中心。
- デザイン指針(011): 将棋駒をCSS clip-pathで五角形、木目グラデーション、box-shadowで立体感。成り駒は赤 (#CC0000)、通常文字は茶 (#8B4513)。先手は0deg、後手は180deg回転。
- コードコメントは最小限で要点のみ。既存のclass命名・ARIAラベルを尊重。
- 成果物参照: specs/011-realistic-piece-design/spec.md, plan.md, research.md, style-guide, tasks.md。
- テスト: Vitest + @testing-library/react。Red→Green→Refactorを推奨。