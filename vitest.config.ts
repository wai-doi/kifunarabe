import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom環境を使用してブラウザDOM APIをシミュレート
    environment: 'jsdom',
    // グローバルAPIを有効化(describe, it, expectなど)
    globals: true,
    // セットアップファイルを指定
    setupFiles: './tests/setup.ts',
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.ts',
        '*.config.js',
        'src/main.tsx',
      ],
    },
  },
});
