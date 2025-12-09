import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveGameState,
  loadGameState,
  clearGameState,
  validatePersistedGameState,
} from '../../src/logic/persistenceManager';
import {
  LocalStorageMock,
  QuotaExceededLocalStorageMock,
  createTestGameState,
  createTestPersistedGameState,
  createInvalidPersistedData,
} from '../helpers/persistenceHelpers';

describe('persistenceManager', () => {
  let localStorageMock: LocalStorageMock;

  beforeEach(() => {
    // 各テスト前にlocalStorageをモック化
    localStorageMock = new LocalStorageMock();
    global.localStorage = localStorageMock as unknown as Storage;
  });

  afterEach(() => {
    // 各テスト後にクリーンアップ
    localStorageMock.clear();
    vi.restoreAllMocks();
  });

  describe('saveGameState', () => {
    it('T004: 正常系 - ゲーム状態を正常に保存できる', () => {
      const state = createTestGameState();
      const result = saveGameState(state);

      expect(result).toBe(true);

      const saved = localStorageMock.getItem('kifunarabe:gameState');
      expect(saved).not.toBeNull();

      const parsed = JSON.parse(saved!);
      expect(parsed.pieces).toEqual(state.pieces);
      expect(parsed.capturedPieces).toEqual(state.capturedPieces);
      expect(parsed.currentTurn).toBe(state.currentTurn);
      expect(parsed.history).toEqual(state.history);
      expect(parsed.currentIndex).toBe(state.currentIndex);
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.timestamp).toBeGreaterThan(0);
    });

    it('T004: 容量超過時 - falseを返し、警告ログを出力する', () => {
      global.localStorage = new QuotaExceededLocalStorageMock() as unknown as Storage;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = createTestGameState();
      const result = saveGameState(state);

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('T004: localStorage無効時 - falseを返し、警告ログを出力する', () => {
      // localStorageをnullに設定
      Object.defineProperty(global, 'localStorage', {
        value: null,
        writable: true,
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = createTestGameState();
      const result = saveGameState(state);

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('loadGameState', () => {
    it('T005: 正常系 - 保存されたゲーム状態を正常に復元できる', () => {
      const testState = createTestPersistedGameState();
      localStorageMock.setItem('kifunarabe:gameState', JSON.stringify(testState));

      const loaded = loadGameState();

      expect(loaded).not.toBeNull();
      expect(loaded!.pieces).toEqual(testState.pieces);
      expect(loaded!.capturedPieces).toEqual(testState.capturedPieces);
      expect(loaded!.currentTurn).toBe(testState.currentTurn);
      expect(loaded!.history).toEqual(testState.history);
      expect(loaded!.currentIndex).toBe(testState.currentIndex);
      expect(loaded!.version).toBe(testState.version);
      expect(loaded!.timestamp).toBe(testState.timestamp);
    });

    it('T005: データなし - nullを返す（警告ログなし）', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadGameState();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('T005: パースエラー - nullを返し、警告ログを出力する', () => {
      localStorageMock.setItem('kifunarabe:gameState', 'invalid-json{');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadGameState();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('T005: バリデーション失敗 - nullを返し、警告ログを出力する', () => {
      const invalidData = createInvalidPersistedData().missingFields;
      localStorageMock.setItem('kifunarabe:gameState', JSON.stringify(invalidData));
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadGameState();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('T005: localStorage無効時 - nullを返し、警告ログを出力する', () => {
      Object.defineProperty(global, 'localStorage', {
        value: null,
        writable: true,
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const loaded = loadGameState();

      expect(loaded).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('validatePersistedGameState', () => {
    it('T006: 有効なデータ - trueを返す', () => {
      const validData = createTestPersistedGameState();
      expect(validatePersistedGameState(validData)).toBe(true);
    });

    it('T006: 必須フィールド欠如 - falseを返す', () => {
      const invalidData = createInvalidPersistedData().missingFields;
      expect(validatePersistedGameState(invalidData)).toBe(false);
    });

    it('T006: 型不一致 - falseを返す', () => {
      const invalidData = createInvalidPersistedData().invalidTypes;
      expect(validatePersistedGameState(invalidData)).toBe(false);
    });

    it('T006: 範囲外の値(currentIndex) - falseを返す', () => {
      const invalidData = createInvalidPersistedData().invalidCurrentIndex;
      expect(validatePersistedGameState(invalidData)).toBe(false);
    });

    it('T006: nullまたはundefined - falseを返す', () => {
      expect(validatePersistedGameState(null)).toBe(false);
      expect(validatePersistedGameState(undefined)).toBe(false);
    });

    it('T006: currentTurnが"sente"または"gote"以外 - falseを返す', () => {
      const invalidData = {
        ...createTestPersistedGameState(),
        currentTurn: 'invalid-turn',
      };
      expect(validatePersistedGameState(invalidData)).toBe(false);
    });
  });

  describe('clearGameState', () => {
    it('T007: 正常にlocalStorageからデータを削除できる', () => {
      const testState = createTestPersistedGameState();
      localStorageMock.setItem('kifunarabe:gameState', JSON.stringify(testState));

      clearGameState();

      const saved = localStorageMock.getItem('kifunarabe:gameState');
      expect(saved).toBeNull();
    });

    it('T007: データが存在しない場合もエラーなく実行できる', () => {
      expect(() => clearGameState()).not.toThrow();
    });

    it('T007: localStorage無効時 - 警告ログを出力する', () => {
      Object.defineProperty(global, 'localStorage', {
        value: null,
        writable: true,
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      clearGameState();

      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});
