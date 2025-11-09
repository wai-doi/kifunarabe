# Quickstart: 駒の捕獲機能

**Feature**: 駒の捕獲機能
**Date**: 2025-11-09
**Status**: 完了

## 概要

駒の捕獲機能の開発環境セットアップとTDD開発フローのガイド。

---

## 前提条件

- Node.js 18以上がインストールされている
- npm または yarn がインストールされている
- Git がインストールされている
- VSCode または任意のエディタ

---

## セットアップ手順

### 1. リポジトリのクローンとブランチの切り替え

```bash
# リポジトリのクローン(初回のみ)
git clone https://github.com/wai-doi/kifunarabe.git
cd kifunarabe

# 駒の捕獲機能のブランチに切り替え
git checkout 005-piece-capture
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
# 開発サーバーを起動(ホットリロード有効)
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

### 4. テストの実行

```bash
# テストを実行(ウォッチモード)
npm run test

# テストをUIモードで実行
npm run test:ui

# カバレッジ付きでテストを実行
npm run test:coverage
```

---

## 開発フロー

### TDDサイクル(Red-Green-Refactor)

駒の捕獲機能はテスト駆動開発(TDD)で実装します。

#### 1. Red: テストを書く(失敗を確認)

```bash
# 1. テストファイルを作成
touch tests/logic/captureLogic.test.ts

# 2. テストを記述(まだ実装していない機能のテスト)
# 3. テストを実行して失敗を確認
npm run test captureLogic.test.ts
```

**例**: `getTargetPiece`のテスト

```typescript
// tests/logic/captureLogic.test.ts
import { describe, it, expect } from 'vitest';
import { getTargetPiece } from '../../src/logic/captureLogic';

describe('getTargetPiece', () => {
  it('移動先に相手の駒があるとき、その駒を返す', () => {
    const pieces = [
      { type: '歩', player: 'sente', file: 5, rank: 5 },
      { type: '歩', player: 'gote', file: 5, rank: 4 }
    ];
    const position = { file: 5, rank: 4 };
    const currentPlayer = 'sente';

    const result = getTargetPiece(pieces, position, currentPlayer);

    expect(result).toEqual({ type: '歩', player: 'gote', file: 5, rank: 4 });
  });
});
```

#### 2. Green: 最小限の実装でテストを通す

```bash
# 1. 実装ファイルを作成
touch src/logic/captureLogic.ts

# 2. テストを通す最小限のコードを書く
# 3. テストを実行して成功を確認
npm run test captureLogic.test.ts
```

**例**: `getTargetPiece`の実装

```typescript
// src/logic/captureLogic.ts
import type { Piece, Player } from '../types/piece';
import type { Position } from '../types/position';

export function getTargetPiece(
  pieces: Piece[],
  position: Position,
  currentPlayer: Player
): Piece | null {
  const targetPiece = pieces.find(
    (p) => p.file === position.file && p.rank === position.rank
  );
  
  if (targetPiece && targetPiece.player !== currentPlayer) {
    return targetPiece;
  }
  
  return null;
}
```

#### 3. Refactor: コードを改善

```bash
# 1. テストが通っている状態で、コードを整理・改善
# 2. リファクタリング後もテストが通ることを確認
npm run test captureLogic.test.ts
```

**リファクタリング例**:
- 重複コードの削除
- 関数の分割
- 型の改善
- コメントの追加

#### 4. 次のテストケースへ

上記のサイクルを繰り返し、全ての機能を実装:
1. `getTargetPiece`の他のケース
2. `addToCapturedPieces`
3. `removePieceFromBoard`
4. `updateBoardAfterMove`(拡張)
5. `CapturedPieces`コンポーネント
6. 統合テスト

---

## 実装順序

### フェーズ1: 型定義

```bash
# 1. 型定義ファイルを作成
touch src/types/capturedPieces.ts

# 2. 型を定義
# - CapturedPiecesMap
# - CapturedPieces
# - CapturedPiecesProps

# 3. 既存の型(GameState)を拡張
# src/types/board.ts を編集
```

### フェーズ2: ロジック実装(TDD)

```bash
# 1. captureLogic.ts のテストと実装
npm run test -- --run captureLogic.test.ts

# 2. boardState.ts の拡張(テストと実装)
npm run test -- --run boardState.test.ts
```

### フェーズ3: コンポーネント実装(TDD)

```bash
# 1. CapturedPieces コンポーネントのテストと実装
npm run test -- --run CapturedPieces.test.tsx

# 2. Board コンポーネントの拡張(テストと実装)
npm run test -- --run Board.test.tsx

# 3. ShogiBoard コンポーネントの拡張(テストと実装)
npm run test -- --run ShogiBoard.test.tsx
```

### フェーズ4: 統合テストと確認

```bash
# 1. 全てのテストを実行
npm run test

# 2. カバレッジを確認
npm run test:coverage

# 3. 開発サーバーで動作確認
npm run dev
```

---

## テスト実行コマンド

### 基本コマンド

```bash
# 全てのテストを実行(ウォッチモード)
npm run test

# 特定のテストファイルのみ実行
npm run test captureLogic.test.ts

# テストを1回だけ実行(CI用)
npm run test -- --run

# UIモードでテストを実行
npm run test:ui

# カバレッジ付きでテストを実行
npm run test:coverage
```

### 便利なオプション

```bash
# 特定のテストケースのみ実行(it.only)
# テストファイル内で it.only('テスト名', ...) を使用

# 特定のテストをスキップ(it.skip)
# テストファイル内で it.skip('テスト名', ...) を使用

# ファイル変更時に自動再実行(デフォルト)
npm run test
```

---

## デバッグ方法

### 1. ブラウザでのデバッグ

```bash
# 開発サーバーを起動
npm run dev

# ブラウザの開発者ツールを開く(F12)
# Consoleタブでログを確認
# Sourcesタブでブレークポイントを設定
```

### 2. テストのデバッグ

```bash
# テストUIモードを使用
npm run test:ui

# ブラウザでテスト結果を確認
# 失敗したテストの詳細を表示
```

### 3. VSCodeでのデバッグ

`.vscode/launch.json` を作成:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test", "--", "--run"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

VSCodeのデバッグビューから「Debug Tests」を実行。

---

## コード品質チェック

### Lintとフォーマット

```bash
# ESLintでコードをチェック
npm run lint

# Prettierでコードをフォーマット
npm run format

# フォーマットチェックのみ(CIで使用)
npm run format:check

# Lintとフォーマットチェックをまとめて実行
npm run check
```

### コミット前のチェック

```bash
# コミット前に必ず実行
npm run check
npm run test -- --run
```

---

## よくある問題と解決策

### 問題1: テストが通らない

**症状**: テストを実行しても失敗する

**解決策**:
```bash
# 1. node_modulesをクリーンアップ
rm -rf node_modules
npm install

# 2. キャッシュをクリア
npm run test -- --clearCache

# 3. テストファイルのパスを確認
# 正しいインポートパスを使用しているか確認
```

### 問題2: 開発サーバーが起動しない

**症状**: `npm run dev` でエラーが出る

**解決策**:
```bash
# 1. ポート5173が使用中でないか確認
lsof -i :5173

# 2. 使用中の場合、プロセスを終了
kill -9 [PID]

# 3. 別のポートを使用
npm run dev -- --port 3000
```

### 問題3: 型エラーが出る

**症状**: TypeScriptの型エラーが出る

**解決策**:
```bash
# 1. TypeScriptの型チェックを実行
npx tsc --noEmit

# 2. エラーメッセージを確認し、型定義を修正
# 3. 必要に応じて型定義ファイルを追加
```

### 問題4: コンポーネントが表示されない

**症状**: 実装したコンポーネントがブラウザに表示されない

**解決策**:
```bash
# 1. ブラウザのコンソールでエラーを確認
# 2. コンポーネントのインポートパスを確認
# 3. Reactのエラーメッセージを読む
# 4. 開発サーバーを再起動
npm run dev
```

---

## 参考資料

### プロジェクト内ドキュメント

- [仕様書](./spec.md) - 機能の詳細仕様
- [実装計画](./plan.md) - 技術的な実装方針
- [データモデル](./data-model.md) - エンティティとデータフロー
- [契約仕様](./contracts/README.md) - APIとコンポーネントの契約

### 外部リソース

- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Vitest 公式ドキュメント](https://vitest.dev/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [Testing Library 公式ドキュメント](https://testing-library.com/docs/react-testing-library/intro/)

---

## 次のステップ

1. **Phase 2: タスク分解** - `/speckit.tasks` コマンドで詳細なタスクに分解
2. **実装開始** - TDDサイクルに従って実装
3. **レビュー** - コードレビューと憲法準拠確認
4. **マージ** - mainブランチへのマージ

---

## サポート

問題が発生した場合:
1. このQuickstartの「よくある問題と解決策」を確認
2. プロジェクトの他のドキュメントを参照
3. チームメンバーに相談
