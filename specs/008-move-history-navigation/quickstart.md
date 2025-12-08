# Quick Start: 手順の巻き戻し・再生機能

**Feature**: 008-move-history-navigation
**Date**: 2025-12-08
**Target Audience**: 開発者

## 概要

この機能は、将棋盤で指された手の履歴を管理し、「一手戻る」「一手進む」「初手に戻る」「最終手に進む」の4つのナビゲーション操作を提供します。各手の完全な盤面状態（駒配置、持ち駒、手番）をスナップショットとして保存し、任意の手数に瞬時に移動できます。

## 主要コンポーネント

### 1. `types/history.ts` - 型定義

履歴管理に必要な型を定義します。

```typescript
import { Board } from './board';
import { CapturedPieces } from './capturedPieces';
import { Turn } from './turn';

export interface HistoryEntry {
  readonly boardState: Board;
  readonly capturedPieces: CapturedPieces;
  readonly currentTurn: Turn;
  readonly moveNumber: number;
}

export interface GameHistory {
  readonly entries: readonly HistoryEntry[];
  readonly currentIndex: number;
}

export interface NavigationState {
  readonly canGoBack: boolean;
  readonly canGoForward: boolean;
  readonly currentMoveNumber: number;
  readonly totalMoves: number;
}
```

### 2. `logic/historyManager.ts` - 履歴管理ロジック

履歴の追加、ナビゲーション、状態取得のロジックを提供します。

```typescript
import { GameHistory, HistoryEntry, NavigationState } from '../types/history';

/**
 * 新しい手を履歴に追加する
 * 現在位置より後ろの履歴は削除される
 */
export function addMove(
  history: GameHistory,
  newEntry: HistoryEntry
): GameHistory {
  const newEntries = history.entries.slice(0, history.currentIndex + 1);
  return {
    entries: [...newEntries, newEntry],
    currentIndex: newEntries.length,
  };
}

/**
 * 一手戻る
 */
export function goToPrevious(history: GameHistory): GameHistory {
  if (history.currentIndex === 0) return history;
  return {
    ...history,
    currentIndex: history.currentIndex - 1,
  };
}

/**
 * 一手進む
 */
export function goToNext(history: GameHistory): GameHistory {
  if (history.currentIndex === history.entries.length - 1) return history;
  return {
    ...history,
    currentIndex: history.currentIndex + 1,
  };
}

/**
 * 初手に戻る
 */
export function goToFirst(history: GameHistory): GameHistory {
  return {
    ...history,
    currentIndex: 0,
  };
}

/**
 * 最終手に進む
 */
export function goToLast(history: GameHistory): GameHistory {
  return {
    ...history,
    currentIndex: history.entries.length - 1,
  };
}

/**
 * 現在の履歴エントリを取得
 */
export function getCurrentEntry(history: GameHistory): HistoryEntry {
  return history.entries[history.currentIndex];
}

/**
 * ナビゲーション状態を取得
 */
export function getNavigationState(history: GameHistory): NavigationState {
  return {
    canGoBack: history.currentIndex > 0,
    canGoForward: history.currentIndex < history.entries.length - 1,
    currentMoveNumber: history.currentIndex,
    totalMoves: history.entries.length - 1,
  };
}
```

### 3. `components/NavigationControls.tsx` - ナビゲーションUI

4つのナビゲーションボタンを提供するコンポーネント。

```typescript
import React from 'react';
import { NavigationState } from '../types/history';

interface NavigationControlsProps {
  navigationState: NavigationState;
  onGoToFirst: () => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
  onGoToLast: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  navigationState,
  onGoToFirst,
  onGoToPrevious,
  onGoToNext,
  onGoToLast,
}) => {
  const { canGoBack, canGoForward, currentMoveNumber, totalMoves } = navigationState;

  return (
    <div className="flex items-center gap-4 p-4">
      <button
        onClick={onGoToFirst}
        disabled={!canGoBack}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="初手に戻る"
      >
        ⏮ 初手
      </button>
      
      <button
        onClick={onGoToPrevious}
        disabled={!canGoBack}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="一手戻る"
      >
        ◀ 戻る
      </button>
      
      <div className="text-lg font-semibold">
        {currentMoveNumber}手目 / {totalMoves}手
      </div>
      
      <button
        onClick={onGoToNext}
        disabled={!canGoForward}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="一手進む"
      >
        進む ▶
      </button>
      
      <button
        onClick={onGoToLast}
        disabled={!canGoForward}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="最終手に進む"
      >
        最終手 ⏭
      </button>
    </div>
  );
};
```

### 4. `components/ShogiBoard.tsx` への統合

既存の ShogiBoard に履歴管理機能を追加します。

```typescript
// 主要な変更点のみ抜粋

import { GameHistory, HistoryEntry } from '../types/history';
import * as HistoryManager from '../logic/historyManager';
import { NavigationControls } from './NavigationControls';

export const ShogiBoard: React.FC = () => {
  // 既存の状態
  const [board, setBoard] = useState<Board>(initialBoard);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({ /* ... */ });
  const [currentTurn, setCurrentTurn] = useState<Turn>('先手');
  
  // 新規: 履歴管理
  const [history, setHistory] = useState<GameHistory>(() => {
    // 初期配置を最初の履歴エントリとして記録
    const initialEntry: HistoryEntry = {
      boardState: initialBoard,
      capturedPieces: { 先手: [], 後手: [] },
      currentTurn: '先手',
      moveNumber: 0,
    };
    return {
      entries: [initialEntry],
      currentIndex: 0,
    };
  });

  // 盤面を履歴から復元
  const restoreFromHistory = (entry: HistoryEntry) => {
    setBoard(entry.boardState);
    setCapturedPieces(entry.capturedPieces);
    setCurrentTurn(entry.currentTurn);
  };

  // 手を指した後、履歴に追加
  const handleMove = (/* ... */) => {
    // 既存の移動ロジック
    // ...
    
    // 新しい盤面状態を履歴に追加
    const newEntry: HistoryEntry = {
      boardState: newBoard,
      capturedPieces: newCapturedPieces,
      currentTurn: newTurn,
      moveNumber: history.currentIndex + 1,
    };
    
    const newHistory = HistoryManager.addMove(history, newEntry);
    setHistory(newHistory);
  };

  // ナビゲーションハンドラー
  const handleGoToFirst = () => {
    const newHistory = HistoryManager.goToFirst(history);
    setHistory(newHistory);
    restoreFromHistory(HistoryManager.getCurrentEntry(newHistory));
  };

  const handleGoToPrevious = () => {
    const newHistory = HistoryManager.goToPrevious(history);
    setHistory(newHistory);
    restoreFromHistory(HistoryManager.getCurrentEntry(newHistory));
  };

  const handleGoToNext = () => {
    const newHistory = HistoryManager.goToNext(history);
    setHistory(newHistory);
    restoreFromHistory(HistoryManager.getCurrentEntry(newHistory));
  };

  const handleGoToLast = () => {
    const newHistory = HistoryManager.goToLast(history);
    setHistory(newHistory);
    restoreFromHistory(HistoryManager.getCurrentEntry(newHistory));
  };

  const navigationState = HistoryManager.getNavigationState(history);

  return (
    <div>
      <NavigationControls
        navigationState={navigationState}
        onGoToFirst={handleGoToFirst}
        onGoToPrevious={handleGoToPrevious}
        onGoToNext={handleGoToNext}
        onGoToLast={handleGoToLast}
      />
      <Board /* ... */ />
      {/* その他のコンポーネント */}
    </div>
  );
};
```

## テスト例

### `tests/logic/historyManager.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import * as HistoryManager from '../../src/logic/historyManager';
import { GameHistory, HistoryEntry } from '../../src/types/history';

describe('historyManager', () => {
  const createMockEntry = (moveNumber: number): HistoryEntry => ({
    boardState: [] as any,
    capturedPieces: { 先手: [], 後手: [] },
    currentTurn: '先手',
    moveNumber,
  });

  it('初期配置から一手追加できる', () => {
    const history: GameHistory = {
      entries: [createMockEntry(0)],
      currentIndex: 0,
    };

    const newEntry = createMockEntry(1);
    const newHistory = HistoryManager.addMove(history, newEntry);

    expect(newHistory.entries).toHaveLength(2);
    expect(newHistory.currentIndex).toBe(1);
  });

  it('履歴の途中から新手を指すと以降の履歴が削除される', () => {
    const history: GameHistory = {
      entries: [
        createMockEntry(0),
        createMockEntry(1),
        createMockEntry(2),
        createMockEntry(3),
      ],
      currentIndex: 1, // 2手目を表示中
    };

    const newEntry = createMockEntry(2);
    const newHistory = HistoryManager.addMove(history, newEntry);

    expect(newHistory.entries).toHaveLength(3); // 0, 1, 新2
    expect(newHistory.currentIndex).toBe(2);
  });

  it('一手戻ると currentIndex が減る', () => {
    const history: GameHistory = {
      entries: [createMockEntry(0), createMockEntry(1)],
      currentIndex: 1,
    };

    const newHistory = HistoryManager.goToPrevious(history);
    expect(newHistory.currentIndex).toBe(0);
  });

  it('0手目で一手戻っても変わらない', () => {
    const history: GameHistory = {
      entries: [createMockEntry(0)],
      currentIndex: 0,
    };

    const newHistory = HistoryManager.goToPrevious(history);
    expect(newHistory.currentIndex).toBe(0);
  });
});
```

## 実装チェックリスト

- [ ] `types/history.ts` を作成（型定義）
- [ ] `logic/historyManager.ts` を作成（履歴管理ロジック）
- [ ] `tests/logic/historyManager.test.ts` を作成（単体テスト）
- [ ] `components/NavigationControls.tsx` を作成（UIコンポーネント）
- [ ] `tests/components/NavigationControls.test.tsx` を作成（コンポーネントテスト）
- [ ] `components/ShogiBoard.tsx` に履歴管理を統合
- [ ] 既存のテストが引き続き動作することを確認
- [ ] エンドツーエンドの動作確認

## 開発の流れ（TDD）

1. **Red**: テストを書いて失敗を確認
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: コードを整理
4. 次のテストケースへ

## トラブルシューティング

### 問題: 盤面が正しく復元されない

**原因**: 盤面のコピーが浅いコピーになっている可能性

**解決策**: 
```typescript
// NG: 浅いコピー
const newBoard = board;

// OK: 深いコピー（配列の場合）
const newBoard = board.map(row => [...row]);
```

### 問題: ボタンが無効化されない

**原因**: NavigationState の計算ロジックが間違っている

**解決策**: `getNavigationState` 関数のテストを確認し、期待値と実際の値を比較

## 参考資料

- [data-model.md](./data-model.md) - 詳細なデータモデル定義
- [research.md](./research.md) - 技術的な決定事項
- [spec.md](./spec.md) - 機能仕様書
