# Quickstart: 持ち駒を打つ機能

**Feature**: 006-piece-drop
**Date**: 2025-11-29

## 前提条件

- Node.js 18+ がインストールされていること
- 005-piece-capture フィーチャーが実装済みであること

## セットアップ

```bash
# リポジトリのルートディレクトリで
cd /Users/yusuke.doi/src/github.com/wai-doi/kifunarabe

# ブランチを確認
git branch  # 006-piece-drop であること

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

## 機能の動作確認

1. ブラウザで http://localhost:5173 を開く
2. 先手の駒を動かして後手の駒を取る（持ち駒が増える）
3. 持ち駒エリアの駒をクリック → 選択状態になる
4. 盤面の空きマスをクリック → 駒が打たれる
5. 手番が相手に移ることを確認

## 開発コマンド

```bash
# テスト実行
npm test

# 特定のテストファイルを実行
npm test -- dropLogic.test.ts

# カバレッジレポート
npm run test:coverage

# リント
npm run lint

# フォーマットチェック
npm run format:check
```

## 実装順序

この機能は以下の順序で実装することを推奨:

### Phase 1: 型定義とロジック

1. `src/types/selection.ts` - 選択状態の型定義
2. `src/logic/dropLogic.ts` - 打つロジック
3. `src/logic/captureLogic.ts` - `removeFromCapturedPieces` 追加
4. 上記のユニットテスト

### Phase 2: コンポーネント拡張

5. `CapturedPieces.tsx` - クリックハンドラ追加
6. `ShogiBoard.tsx` - 選択状態の拡張と統合
7. 統合テスト

## ファイル構成

```
src/
├── types/
│   └── selection.ts      # 新規
├── logic/
│   ├── dropLogic.ts      # 新規
│   └── captureLogic.ts   # 拡張
└── components/
    ├── CapturedPieces.tsx # 拡張
    └── ShogiBoard.tsx     # 拡張

tests/
└── logic/
    └── dropLogic.test.ts  # 新規
```

## トラブルシューティング

### 持ち駒が選択できない
- 現在の手番を確認（自分の手番でないと選択不可）
- 持ち駒の数が0でないことを確認

### 駒を打てない
- 打とうとしている場所に既に駒がないか確認
- コンソールにエラーが出ていないか確認

### テストが失敗する
```bash
# テストの詳細を確認
npm test -- --reporter=verbose

# 特定のテストのみ実行
npm test -- -t "canDropPiece"
```
