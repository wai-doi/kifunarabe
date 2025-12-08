import { describe, it, expect } from 'vitest';
import {
  addMove,
  goToPrevious,
  goToNext,
  getCurrentEntry,
  getNavigationState,
} from '../../src/logic/historyManager';
import type { GameHistory, HistoryEntry } from '../../src/types/history';
import type { Piece } from '../../src/types/piece';
import type { CapturedPieces } from '../../src/types/capturedPieces';

// テスト用のヘルパー: 履歴エントリを作成
function createTestEntry(
  moveNumber: number,
  pieces: Piece[] = [],
  capturedPieces: CapturedPieces = { sente: {}, gote: {} }
): HistoryEntry {
  return {
    pieces,
    capturedPieces,
    currentTurn: moveNumber % 2 === 0 ? 'sente' : 'gote',
    moveNumber,
  };
}

describe('historyManager', () => {
  describe('goToPrevious', () => {
    it('[US1] 初期配置（0手目）では戻れない（currentIndex は 0 のまま）', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0)],
        currentIndex: 0,
      };

      const result = goToPrevious(history);

      expect(result.currentIndex).toBe(0);
      expect(result.entries).toHaveLength(1);
    });

    it('[US1] 2手目から一手戻ると1手目になる', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 2,
      };

      const result = goToPrevious(history);

      expect(result.currentIndex).toBe(1);
      expect(result.entries).toHaveLength(3);
    });

    it('[US1] 履歴追加後に戻ると正しく前の手に戻る', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2), createTestEntry(3)],
        currentIndex: 3,
      };

      const result = goToPrevious(history);

      expect(result.currentIndex).toBe(2);
    });
  });

  describe('getCurrentEntry', () => {
    it('[US1] currentIndex の位置のエントリを返す', () => {
      const entries = [createTestEntry(0), createTestEntry(1)];
      const history: GameHistory = {
        entries,
        currentIndex: 1,
      };

      const entry = getCurrentEntry(history);

      expect(entry).toBe(entries[1]);
      expect(entry.moveNumber).toBe(1);
    });
  });

  describe('getNavigationState', () => {
    it('[US1] 初期配置では canGoBack が false', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0)],
        currentIndex: 0,
      };

      const state = getNavigationState(history);

      expect(state.canGoBack).toBe(false);
      expect(state.currentMoveNumber).toBe(0);
      expect(state.totalMoves).toBe(0);
    });
    it('[US1] 2手目では canGoBack が true', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 2,
      };

      const state = getNavigationState(history);

      expect(state.canGoBack).toBe(true);
      expect(state.currentMoveNumber).toBe(2);
      expect(state.totalMoves).toBe(2);
    });

    it('[US2] 最終手では canGoForward が false', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 2,
      };

      const state = getNavigationState(history);

      expect(state.canGoForward).toBe(false);
    });

    it('[US2] 1手目では canGoForward が true', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 1,
      };

      const state = getNavigationState(history);

      expect(state.canGoForward).toBe(true);
    });
  });

  describe('addMove', () => {
    it('[US1] 新しい手を履歴に追加する', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1)],
        currentIndex: 1,
      };

      const newEntry = createTestEntry(2);
      const result = addMove(history, newEntry);

      expect(result.entries).toHaveLength(3);
      expect(result.currentIndex).toBe(2);
      expect(result.entries[2]).toBe(newEntry);
    });

    it('[US1] 履歴の途中から新手を指すと以降の履歴が削除される', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2), createTestEntry(3)],
        currentIndex: 1,
      };

      const newEntry = createTestEntry(2);
      const result = addMove(history, newEntry);

      expect(result.entries).toHaveLength(3);
      expect(result.currentIndex).toBe(2);
      expect(result.entries[2]).toBe(newEntry);
    });
  });

  describe('goToNext', () => {
    it('[US2] 最終手では進めない（currentIndex は変わらない）', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 2,
      };

      const result = goToNext(history);

      expect(result.currentIndex).toBe(2);
      expect(result.entries).toHaveLength(3);
    });

    it('[US2] 1手目から一手進むと2手目になる', () => {
      const history: GameHistory = {
        entries: [createTestEntry(0), createTestEntry(1), createTestEntry(2)],
        currentIndex: 1,
      };

      const result = goToNext(history);

      expect(result.currentIndex).toBe(2);
      expect(result.entries).toHaveLength(3);
    });

    it('[US2] 戻った後に進むと正しく次の手に進む', () => {
      const history: GameHistory = {
        entries: [
          createTestEntry(0),
          createTestEntry(1),
          createTestEntry(2),
          createTestEntry(3),
          createTestEntry(4),
        ],
        currentIndex: 2,
      };

      const result = goToNext(history);

      expect(result.currentIndex).toBe(3);
    });
  });

  describe('goToFirst', () => {
    it.todo('[US3] 初手に戻る');
  });

  describe('goToLast', () => {
    it.todo('[US4] 最終手に進む');
  });
});
