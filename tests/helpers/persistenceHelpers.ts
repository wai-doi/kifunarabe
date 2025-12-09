import type { Piece } from '../../src/types/piece';
import type { CapturedPieces } from '../../src/types/capturedPieces';
import type { HistoryEntry } from '../../src/types/history';
import type { GameStateInput, PersistedGameState } from '../../src/types/persistence';

/**
 * テスト用の基本的なゲーム状態を生成
 */
export function createTestGameState(): GameStateInput {
  const testPieces: Piece[] = [
    { type: '玉', owner: 'sente', position: { file: 5, rank: 9 }, isPromoted: false },
    { type: '玉', owner: 'gote', position: { file: 5, rank: 1 }, isPromoted: false },
  ];

  const testCapturedPieces: CapturedPieces = {
    sente: {},
    gote: {},
  };

  const testHistory: HistoryEntry[] = [
    {
      pieces: testPieces,
      capturedPieces: testCapturedPieces,
      currentTurn: 'sente',
      moveNumber: 0,
    },
  ];

  return {
    pieces: testPieces,
    capturedPieces: testCapturedPieces,
    currentTurn: 'sente',
    history: testHistory,
    currentIndex: 0,
  };
}

/**
 * テスト用の完全な永続化状態を生成（versionとtimestamp付き）
 */
export function createTestPersistedGameState(): PersistedGameState {
  const baseState = createTestGameState();
  return {
    ...baseState,
    version: '1.0.0',
    timestamp: Date.now(),
  };
}

/**
 * localStorageをモック化するためのヘルパー
 */
export class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * localStorage容量超過をシミュレートするためのモック
 */
export class QuotaExceededLocalStorageMock extends LocalStorageMock {
  setItem(): void {
    const error = new Error('QuotaExceededError');
    error.name = 'QuotaExceededError';
    throw error;
  }
}

/**
 * テスト用に不正なデータを生成
 */
export function createInvalidPersistedData() {
  return {
    missingFields: {
      pieces: [],
      // capturedPieces欠如
      currentTurn: 'sente',
    },
    invalidTypes: {
      pieces: 'not-an-array',
      capturedPieces: {},
      currentTurn: 123,
      history: [],
      currentIndex: 0,
      version: '1.0.0',
      timestamp: Date.now(),
    },
    invalidCurrentIndex: {
      pieces: [],
      capturedPieces: { sente: {}, gote: {} },
      currentTurn: 'sente',
      history: [],
      currentIndex: 10, // history.lengthを超える
      version: '1.0.0',
      timestamp: Date.now(),
    },
  };
}
