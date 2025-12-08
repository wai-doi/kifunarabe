# API Contracts

**Feature**: 008-move-history-navigation

## 説明

このフィーチャーはフロントエンドのみの実装であり、外部 API は使用しません。

すべてのロジックはクライアント側の状態管理（React useState）で完結します。

## 将来の拡張

将来的にサーバーサイドで棋譜を保存・読み込む機能を追加する場合、以下のようなエンドポイントが必要になる可能性があります:

- `GET /api/games/:id/history` - 棋譜の履歴を取得
- `POST /api/games/:id/moves` - 新しい手を保存

現時点では未実装です。
