# Research: 棋譜並べWebアプリケーション - 初期セットアップ

**Date**: 2025年11月1日
**Feature**: 001-kifu-viewer-app

## 調査項目

### 1. テストフレームワークの選定

**Decision**: Vitest + React Testing Library

**Rationale**:
- **Vitest**: Viteとの統合が優れており、設定が最小限で済む。高速な実行とHMR対応。
- **React Testing Library**: Reactコンポーネントのテストに特化し、ユーザー視点でのテストを推奨するベストプラクティスに準拠。
- 両者の組み合わせはモダンなReactプロジェクトの標準として広く採用されている。

**Alternatives considered**:
- **Jest + React Testing Library**:
  - 長所: 成熟したエコシステム、豊富なドキュメント
  - 短所: ViteとのESM統合に追加設定が必要、Vitestより遅い
  - 却下理由: ViteプロジェクトではVitestの方が設定が簡単で、開発体験が優れている
- **Testing Library単体**:
  - 長所: シンプル
  - 短所: テストランナーが別途必要
  - 却下理由: 統合ソリューションの方が保守しやすい

---

### 2. React + Vite + TypeScriptのベストプラクティス

**Decision**: 公式テンプレート (`npm create vite@latest`) をベースに、厳格なTypeScript設定を適用

**Rationale**:
- Vite公式が提供するReact + TypeScriptテンプレートは、適切なデフォルト設定を含んでいる
- `tsconfig.json`で`strict: true`を有効化し、型安全性を最大化
- ESLintとPrettierは初期段階では導入せず、必要に応じて後から追加（YAGNI原則）

**Key configurations**:

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

### 3. Tailwind CSS統合のベストプラクティス

**Decision**: PostCSS経由でTailwind CSSを統合し、標準的な設定を使用

**Rationale**:
- Tailwind CSS公式ドキュメントのVite統合ガイドに従う
- JITモード（Just-In-Time）がデフォルトで有効化されており、開発体験が優れている
- 初期段階ではカスタムテーマやプラグインを最小限にする

**Setup steps**:
1. 依存関係のインストール: `npm install -D tailwindcss postcss autoprefixer`
2. 設定ファイルの生成: `npx tailwindcss init -p`
3. `tailwind.config.js`でコンテンツパスを設定
4. `src/index.css`にTailwindディレクティブを追加

**tailwind.config.js**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 4. プロジェクト初期化のステップ

**Decision**: 段階的なセットアップアプローチ

**Steps**:
1. Viteプロジェクトの作成: `npm create vite@latest kifunarabe -- --template react-ts`
2. 依存関係のインストール: `npm install`
3. Tailwind CSSのセットアップ:
   - `npm install -D tailwindcss postcss autoprefixer`
   - `npx tailwindcss init -p`
   - `tailwind.config.js`と`src/index.css`を設定
4. 開発サーバーの起動確認: `npm run dev`
5. TypeScript型チェック: `npx tsc --noEmit`
6. ビルドテスト: `npm run build`

**Rationale**:
- 各ステップを個別に実行し、問題を早期に発見できるようにする
- 公式ツールを使用することで、標準的な構成を保証する

---

### 5. Node.jsバージョン要件

**Decision**: Node.js 18.x以上を要求（推奨: 20.x LTS）

**Rationale**:
- Vite 5.xはNode.js 18.0以上を要求
- TypeScript 5.xも同様にNode.js 18以上を推奨
- LTS版を使用することで、長期的なサポートと安定性を確保

**Alternatives considered**:
- Node.js 16.x: Vite 5が非対応
- Node.js 21.x: 最新版だが非LTS版のため却下

---

## まとめ

全ての技術的な不明点が解決され、以下が確定しました:

1. **テスト戦略**: Vitest + React Testing Library（ただし初期セットアップでは未導入）
2. **プロジェクト構造**: Vite公式React + TypeScriptテンプレートをベース
3. **CSS戦略**: Tailwind CSS + PostCSS
4. **開発環境**: Node.js 18.x以上
5. **セットアップ手順**: 段階的アプローチで各ステップを検証

これらの決定により、Phase 1（設計とコントラクト）に進む準備が整いました。
