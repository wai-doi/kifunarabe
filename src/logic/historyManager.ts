import type { HistoryEntry, GameHistory, NavigationState } from '../types/history';

/**
 * 新しい手を履歴に追加する
 * 現在位置より後ろの履歴を削除し、新しいエントリを末尾に追加
 */
export function addMove(history: GameHistory, newEntry: HistoryEntry): GameHistory {
  // 現在位置より後ろの履歴を削除
  const newEntries = history.entries.slice(0, history.currentIndex + 1);
  // 新しいエントリを追加
  newEntries.push(newEntry);

  return {
    entries: newEntries,
    currentIndex: newEntries.length - 1,
  };
}

/**
 * 一手戻る
 * currentIndex を 1 減らす（0 より小さくならない）
 */
export function goToPrevious(history: GameHistory): GameHistory {
  const newIndex = Math.max(0, history.currentIndex - 1);
  return {
    ...history,
    currentIndex: newIndex,
  };
}

/**
 * 一手進む
 * currentIndex を 1 増やす（entries.length - 1 を超えない）
 */
export function goToNext(history: GameHistory): GameHistory {
  const maxIndex = history.entries.length - 1;
  const newIndex = Math.min(maxIndex, history.currentIndex + 1);
  return {
    ...history,
    currentIndex: newIndex,
  };
}

/**
 * 初手に戻る
 * currentIndex を 0 に設定
 */
export function goToFirst(history: GameHistory): GameHistory {
  return {
    ...history,
    currentIndex: 0,
  };
}

/**
 * 最終手に進む
 * currentIndex を entries.length - 1 に設定
 */
export function goToLast(history: GameHistory): GameHistory {
  return {
    ...history,
    currentIndex: history.entries.length - 1,
  };
}

/**
 * 現在のエントリを取得する
 */
export function getCurrentEntry(history: GameHistory): HistoryEntry {
  return history.entries[history.currentIndex];
}

/**
/**
 * ナビゲーション状態を取得する
 */
export function getNavigationState(history: GameHistory): NavigationState {
  const canGoBack = history.currentIndex > 0;
  const canGoForward = history.currentIndex < history.entries.length - 1;
  const currentMoveNumber = history.currentIndex;
  const totalMoves = history.entries.length - 1;

  return {
    canGoBack,
    canGoForward,
    currentMoveNumber,
    totalMoves,
  };
}
