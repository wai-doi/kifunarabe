# Data Model: 状態の自動保存

**Feature**: 009-auto-save-state
**Date**: 2025-12-09
**Phase**: 1 - Design & Contracts

## エンティティ概要

この機能では、ゲームの状態を永続化するための新しいデータ構造を定義します。既存の型定義（Board, CapturedPieces, Turn, MoveHistoryEntry）を組み合わせて、永続化用の複合型を作成します。

## エンティティ定義

### PersistedGameState

**説明**: localStorageに保存されるゲーム状態全体を表す型

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 | バリデーション |
|------------|---|------|------|--------------|
| `board` | `Board` | ✓ | 盤面の状態（9×9の二次元配列） | 81マスすべてが存在し、各マスがPiece \| null |
| `capturedPieces` | `CapturedPieces` | ✓ | 先手・後手の持ち駒 | senteとgoteのプロパティが存在し、それぞれがPieceType配列 |
| `currentTurn` | `Turn` | ✓ | 現在の手番 | "sente" または "gote" |
| `history` | `MoveHistoryEntry[]` | ✓ | 手順履歴の配列 | 配列であり、各要素がMoveHistoryEntry型に準拠 |
| `currentIndex` | `number` | ✓ | 履歴上の現在位置 | 0以上、history.length以下の整数 |
| `version` | `string` | ✓ | データ形式のバージョン番号 | セマンティックバージョニング（例: "1.0.0"） |
| `timestamp` | `number` | ✓ | 保存時のUnixタイムスタンプ（ミリ秒） | 正の整数 |

**関係性**:
- `board`, `capturedPieces`, `currentTurn`, `history` は既存の型定義から参照
- このエンティティは既存のエンティティの集約ルート（Aggregate Root）として機能

**状態遷移**:
1. **初期化**: アプリ起動時、localStorageから読み込み、存在しない場合は作成しない
2. **保存**: ゲーム状態が変更されるたびに自動的にlocalStorageに保存
3. **復元**: アプリ起動時、localStorageから読み込んで状態を復元
4. **削除**: 通常は削除しないが、将来的にはリセット機能で削除可能

### 既存エンティティ（参照のみ）

以下のエンティティは既に定義されており、この機能では変更しません。

#### Board

**説明**: 9×9の将棋盤の状態

**型定義**: `(Piece | null)[][]`（9×9の二次元配列）

**既存ファイル**: `src/types/board.ts`

#### CapturedPieces

**説明**: 先手と後手の持ち駒

**フィールド**:
- `sente`: `PieceType[]` - 先手の持ち駒
- `gote`: `PieceType[]` - 後手の持ち駒

**既存ファイル**: `src/types/capturedPieces.ts`

#### Turn

**説明**: 現在の手番

**型定義**: `"sente" | "gote"`

**既存ファイル**: `src/types/turn.ts`

#### MoveHistoryEntry

**説明**: 1手分の履歴情報

**フィールド**:
- `board`: `Board` - その時点の盤面
- `capturedPieces`: `CapturedPieces` - その時点の持ち駒
- `currentTurn`: `Turn` - その時点の手番
- その他、移動情報など

**既存ファイル**: `src/types/history.ts`

## ストレージキー設計

**キー名**: `kifunarabe:gameState`

**理由**:
- プレフィックス（`kifunarabe:`）でアプリ固有の名前空間を確保
- 明確で理解しやすい命名
- 将来的に複数の保存スロットを追加する場合は `kifunarabe:gameState:${slotId}` のように拡張可能

## データフロー

```
1. ユーザー操作（駒移動、履歴ナビゲーションなど）
   ↓
2. React state更新（useState）
   ↓
3. useEffect発火（依存配列の値が変更されたため）
   ↓
4. saveToLocalStorage()実行
   ↓
5. PersistedGameState構築
   ↓
6. JSON.stringify()
   ↓
7. localStorage.setItem('kifunarabe:gameState', json)
   ↓
8. 完了（エラーならconsole.warn）

---

アプリ起動時:

1. コンポーネントマウント
   ↓
2. useEffect（マウント時のみ実行、依存配列[]）
   ↓
3. loadFromLocalStorage()実行
   ↓
4. localStorage.getItem('kifunarabe:gameState')
   ↓
5. JSON.parse()
   ↓
6. バリデーション（validatePersistedGameState）
   ↓
7. 成功 → setState()で復元 / 失敗 → 何もしない（初期配置のまま）
```

## バリデーションルール

復元時に以下のチェックを実施し、1つでも失敗したら初期配置にフォールバック:

1. **データが存在するか**: `localStorage.getItem()` の結果がnullでない
2. **JSONとしてパース可能か**: `JSON.parse()` が例外を投げない
3. **必須フィールドが存在するか**: 全7フィールドが存在
4. **型が正しいか**:
   - `board`: 9×9の二次元配列で、各要素がオブジェクトまたはnull
   - `capturedPieces`: `sente`と`gote`プロパティを持つオブジェクト
   - `currentTurn`: 文字列で "sente" または "gote"
   - `history`: 配列
   - `currentIndex`: 数値で、0以上かつhistory.length以下
   - `version`: 文字列
   - `timestamp`: 数値
5. **ビジネスルールを満たすか**:
   - `currentIndex`が範囲内（0 <= currentIndex <= history.length）
   - `board`の各要素が有効な駒データまたはnull

## エラーハンドリング

| エラー種別 | 原因 | 対応 | ログ出力 |
|----------|------|------|---------|
| `localStorage無効` | ブラウザ設定、プライベートモード | 保存をスキップ、通常動作を継続 | console.warn |
| `QuotaExceededError` | 容量超過 | 保存をスキップ、通常動作を継続 | console.warn |
| `JSON.parse()失敗` | データ破損 | 初期配置を使用 | console.warn |
| `バリデーション失敗` | データ形式不一致 | 初期配置を使用 | console.warn |
| `localStorage.getItem()失敗` | 読み取りエラー | 初期配置を使用 | console.warn |

## バージョニング戦略

**現在のバージョン**: `"1.0.0"`

**将来の互換性対応**:
- データ構造を変更する場合、バージョンを更新（例: `"2.0.0"`）
- 復元時にバージョンをチェックし、必要に応じてマイグレーション処理を実行
- 未知のバージョンの場合は初期配置にフォールバック

**マイグレーション例**（将来の参考）:
```typescript
function migrateGameState(data: any): PersistedGameState | null {
  if (data.version === "1.0.0") {
    return data as PersistedGameState;
  }
  // 将来のバージョンに対応する処理をここに追加
  return null; // 未知のバージョン
}
```

## パフォーマンス考慮事項

**保存のタイミング**:
- 状態が変更されるたびに即座に保存（useEffectによる自動実行）
- デバウンスは初期実装では不要（必要に応じて後から追加）

**データサイズ見積もり**:
- 盤面（81マス × 約50バイト）: 約4KB
- 持ち駒（最大40駒 × 約20バイト）: 約0.8KB
- 履歴（100手 × 約5KB）: 約500KB
- 合計: 約505KB（localStorageの制限5MBに対して十分余裕あり）

**最適化の余地**:
- 現時点では最適化不要
- 将来的に履歴が非常に長くなる場合は、差分保存や圧縮を検討

## まとめ

この機能で新規に定義する型は `PersistedGameState` のみで、既存の型定義を組み合わせて使用します。データ構造はシンプルで、JSON直列化可能であり、バリデーションも容易です。エラーハンドリングとバージョニング戦略により、将来の拡張にも対応可能な設計となっています。
