# タスク完了時の手順
- 影響範囲のテストを実行 (npm test か対象テスト)。必要なら npm run test:coverage。
- Lint/フォーマット確認: npm run lint, npm run format:check。変更後は npm run format で整形。
- 手動確認: 現フェーズはUI確認(clip-path形状、質感、文字視認性)。quickstartに沿ってスクショ取得(T019)。
- 変更点要約と次ステップ提示。