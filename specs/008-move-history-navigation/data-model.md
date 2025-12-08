# Data Model: 手順の巻き戻し・再生機能

**Feature**: 008-move-history-navigation
**Date**: 2025-12-08
**Phase**: 1 (Design & Contracts)

## エンティティ定義

### 1. HistoryEntry（履歴エントリ）

**説明**: 1手分の完全な盤面状態のスナップショット

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 |
|-------------|-----|------|------|
| boardState | `Board` | ✓ | 81マスの駒配置（9x9の2次元配列） |
| capturedPieces | `CapturedPieces` | ✓ | 先手・後手の持ち駒リスト |
| currentTurn | `Turn` | ✓ | 現在の手番（'先手' or '後手'） |
| moveNumber | `number` | ✓ | 手数（0が初期配置、1以降が指した手） |

**関係性**:
- Board 型は既存の `types/board.ts` で定義済み
- CapturedPieces 型は既存の `types/capturedPieces.ts` で定義済み
- Turn 型は既存の `types/turn.ts` で定義済み

**バリデーションルール**:
- moveNumber は 0 以上の整数
- boardState は 9x9 の配列で、各マスは Piece | null
- capturedPieces の各配列には重複した駒種はない（成駒は不成駒に戻して記録）
- currentTurn は '先手' または '後手' のみ

**状態遷移**:
- 新しい手が指されると、現在の盤面状態から新しい HistoryEntry が作成される
- ナビゲーション操作では HistoryEntry の作成・削除は発生せず、インデックスのみ変更

### 2. GameHistory（ゲーム履歴）

**説明**: HistoryEntry の順序付きコレクション

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 |
|-------------|-----|------|------|
| entries | `HistoryEntry[]` | ✓ | 履歴エントリの配列（0番目が初期配置） |
| currentIndex | `number` | ✓ | 現在表示中の手のインデックス |

**関係性**:
- entries[0] は常に初期配置の状態
- entries[currentIndex] が現在表示されている盤面状態
- entries.length - 1 が最終手のインデックス

**バリデーションルール**:
- entries は最低1つの要素を持つ（初期配置）
- currentIndex は 0 以上 entries.length - 1 以下
- entries[i].moveNumber === i（インデックスと手数が一致）

**操作**:
1. **addMove(newEntry: HistoryEntry)**: 
   - 現在位置より後ろの履歴を削除
   - 新しいエントリを末尾に追加
   - currentIndex を新しいエントリに移動

2. **goToPrevious()**: 
   - currentIndex を 1 減らす（0 より小さくならない）

3. **goToNext()**: 
   - currentIndex を 1 増やす（entries.length - 1 を超えない）

4. **goToFirst()**: 
   - currentIndex を 0 に設定

5. **goToLast()**: 
   - currentIndex を entries.length - 1 に設定

6. **getCurrentEntry()**: 
   - entries[currentIndex] を返す

7. **canGoBack()**: 
   - currentIndex > 0 を返す

8. **canGoForward()**: 
   - currentIndex < entries.length - 1 を返す

### 3. NavigationState（ナビゲーション状態）

**説明**: UI のボタン有効/無効状態を決定するための状態情報

**フィールド**:

| フィールド名 | 型 | 必須 | 説明 |
|-------------|-----|------|------|
| canGoBack | `boolean` | ✓ | 「一手戻る」「初手に戻る」が有効か |
| canGoForward | `boolean` | ✓ | 「一手進む」「最終手に進む」が有効か |
| currentMoveNumber | `number` | ✓ | 現在の手数 |
| totalMoves | `number` | ✓ | 総手数（entries.length - 1） |

**導出ルール**:
- canGoBack = currentIndex > 0
- canGoForward = currentIndex < entries.length - 1
- currentMoveNumber = currentIndex
- totalMoves = entries.length - 1

## データフロー

### 1. 手を指す（新しい履歴の追加）

```
ユーザーが駒を移動
  ↓
現在の盤面から新しい HistoryEntry を作成
  ↓
GameHistory.addMove(newEntry)
  ↓
履歴配列の currentIndex 以降を削除（履歴分岐の防止）
  ↓
新しいエントリを末尾に追加
  ↓
currentIndex を新しいエントリに更新
  ↓
盤面を再レンダリング（すでに最新状態なので変更なし）
```

### 2. 一手戻る

```
ユーザーが「一手戻る」をクリック
  ↓
GameHistory.goToPrevious()
  ↓
currentIndex を 1 減らす
  ↓
GameHistory.getCurrentEntry() で新しい現在エントリを取得
  ↓
盤面状態を新しいエントリで置き換え
  ↓
盤面を再レンダリング
```

### 3. 一手進む

```
ユーザーが「一手進む」をクリック
  ↓
GameHistory.goToNext()
  ↓
currentIndex を 1 増やす
  ↓
GameHistory.getCurrentEntry() で新しい現在エントリを取得
  ↓
盤面状態を新しいエントリで置き換え
  ↓
盤面を再レンダリング
```

### 4. 初手に戻る / 最終手に進む

```
ユーザーが「初手に戻る」または「最終手に進む」をクリック
  ↓
GameHistory.goToFirst() または goToLast()
  ↓
currentIndex を 0 または entries.length - 1 に設定
  ↓
GameHistory.getCurrentEntry() で新しい現在エントリを取得
  ↓
盤面状態を新しいエントリで置き換え
  ↓
盤面を再レンダリング
```

## エッジケースの処理

### 1. 初期配置の状態

- entries は1つのエントリ（初期配置）のみ
- currentIndex = 0
- canGoBack = false（ボタン無効化）
- canGoForward = false（ボタン無効化）

### 2. 最終手の状態

- currentIndex = entries.length - 1
- canGoBack = true
- canGoForward = false（ボタン無効化）

### 3. 履歴の途中から新手を指す

**例**: 5手目まで進んだ後、3手目まで戻って新しい手を指す

```
Before: entries = [0手目, 1手目, 2手目, 3手目, 4手目, 5手目], currentIndex = 2
        （3手目を表示中）

新しい手を指す
  ↓
After:  entries = [0手目, 1手目, 2手目, 3手目, 新4手目], currentIndex = 4
        （4手目以降が削除され、新しい4手目が追加された）
```

### 4. 成った駒・取られた駒の復元

- HistoryEntry は完全なスナップショットなので、特別な処理は不要
- 盤面状態をそのまま entries[currentIndex] で置き換えるだけ

## パフォーマンス考慮事項

### メモリ使用量

**1手あたりの推定サイズ**:
- Board (9x9): 81 マス × 約 20 bytes = 1.6 KB
- CapturedPieces: 最大 38 駒 × 約 10 bytes = 380 bytes
- その他のメタデータ: 約 100 bytes
- **合計: 約 2 KB / 手**

**100手の場合**: 約 200 KB（十分に小さい）

### コピーのコスト

- 新しい手を指すたびに盤面の浅いコピーが必要
- JavaScript の spread operator で O(n) だが、n=81 なので高速
- React の再レンダリングも最適化されているため問題なし

### 最適化の必要性

- 現時点では最適化不要
- 将来的に1000手以上の長い棋譜をサポートする場合は検討
  - Virtual Scrolling（履歴リスト表示時）
  - 差分管理（メモリ削減）
  - Lazy Loading（古い履歴の遅延読み込み）

## TypeScript 型定義（抜粋）

```typescript
// types/history.ts

import { Board } from './board';
import { CapturedPieces } from './capturedPieces';
import { Turn } from './turn';

/**
 * 1手分の完全な盤面状態のスナップショット
 */
export interface HistoryEntry {
  readonly boardState: Board;
  readonly capturedPieces: CapturedPieces;
  readonly currentTurn: Turn;
  readonly moveNumber: number;
}

/**
 * ゲーム全体の履歴を管理するコレクション
 */
export interface GameHistory {
  readonly entries: readonly HistoryEntry[];
  readonly currentIndex: number;
}

/**
 * ナビゲーションボタンの有効/無効状態
 */
export interface NavigationState {
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly currentMoveNumber: number;
  readonly totalMoves: number;
}
```

## データ整合性の保証

### 不変性（Immutability）

- すべてのデータ構造は readonly 修飾子を使用
- 状態更新は新しいオブジェクトを作成（spread operator）
- React の状態更新パターンに準拠

### テストによる検証

1. **履歴追加のテスト**
   - 新しいエントリが正しく追加されるか
   - 途中からの追加で以降の履歴が削除されるか

2. **ナビゲーションのテスト**
   - インデックスが正しく移動するか
   - 境界値（0, length-1）で止まるか

3. **盤面復元のテスト**
   - 戻った後の盤面が正確か
   - 成り駒・持ち駒が正しく復元されるか
