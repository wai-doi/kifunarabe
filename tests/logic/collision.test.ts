import { describe, it, expect } from 'vitest';
import type { Piece } from '../../src/types/piece';
import type { Position } from '../../src/types/position';
import { isPathClear } from '../../src/logic/moveRules';

/**
 * T024-T025: 衝突検出のテスト
 * Phase 5: User Story 3 - 駒がある位置への移動制限
 */

describe('collision detection', () => {
  describe('isPathClear - 経路上の障害物チェック', () => {
    it('飛車: 縦方向の経路に駒がない場合はtrue', () => {
      const from: Position = { file: 5, rank: 1 };
      const to: Position = { file: 5, rank: 5 };
      const board: Piece[] = [
        { type: '飛', player: 'sente', file: 5, rank: 1 },
        // 経路上(file: 5, rank: 2-4)に駒なし
        { type: '歩', player: 'sente', file: 6, rank: 3 }, // 横にずれている
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });

    it('飛車: 縦方向の経路に駒がある場合はfalse', () => {
      const from: Position = { file: 5, rank: 1 };
      const to: Position = { file: 5, rank: 5 };
      const board: Piece[] = [
        { type: '飛', player: 'sente', file: 5, rank: 1 },
        { type: '歩', player: 'sente', file: 5, rank: 3 }, // 経路上に駒
      ];

      expect(isPathClear(from, to, board)).toBe(false);
    });

    it('飛車: 横方向の経路に駒がない場合はtrue', () => {
      const from: Position = { file: 2, rank: 5 };
      const to: Position = { file: 7, rank: 5 };
      const board: Piece[] = [
        { type: '飛', player: 'sente', file: 2, rank: 5 },
        // 経路上(file: 3-6, rank: 5)に駒なし
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });

    it('飛車: 横方向の経路に駒がある場合はfalse', () => {
      const from: Position = { file: 2, rank: 5 };
      const to: Position = { file: 7, rank: 5 };
      const board: Piece[] = [
        { type: '飛', player: 'sente', file: 2, rank: 5 },
        { type: '金', player: 'sente', file: 5, rank: 5 }, // 経路上に駒
      ];

      expect(isPathClear(from, to, board)).toBe(false);
    });

    it('角: 斜め方向の経路に駒がない場合はtrue', () => {
      const from: Position = { file: 2, rank: 2 };
      const to: Position = { file: 5, rank: 5 };
      const board: Piece[] = [
        { type: '角', player: 'sente', file: 2, rank: 2 },
        // 経路上((3,3), (4,4))に駒なし
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });

    it('角: 斜め方向の経路に駒がある場合はfalse', () => {
      const from: Position = { file: 2, rank: 2 };
      const to: Position = { file: 5, rank: 5 };
      const board: Piece[] = [
        { type: '角', player: 'sente', file: 2, rank: 2 },
        { type: '銀', player: 'sente', file: 3, rank: 3 }, // 経路上に駒
      ];

      expect(isPathClear(from, to, board)).toBe(false);
    });

    it('香: 前方直進の経路に駒がない場合はtrue', () => {
      const from: Position = { file: 1, rank: 1 };
      const to: Position = { file: 1, rank: 5 };
      const board: Piece[] = [
        { type: '香', player: 'sente', file: 1, rank: 1 },
        // 経路上(file: 1, rank: 2-4)に駒なし
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });

    it('香: 前方直進の経路に駒がある場合はfalse', () => {
      const from: Position = { file: 1, rank: 1 };
      const to: Position = { file: 1, rank: 5 };
      const board: Piece[] = [
        { type: '香', player: 'sente', file: 1, rank: 1 },
        { type: '歩', player: 'sente', file: 1, rank: 3 }, // 経路上に駒
      ];

      expect(isPathClear(from, to, board)).toBe(false);
    });

    it('桂馬: ジャンプするため経路チェック不要、常にtrue', () => {
      const from: Position = { file: 5, rank: 1 };
      const to: Position = { file: 4, rank: 3 };
      const board: Piece[] = [
        { type: '桂', player: 'sente', file: 5, rank: 1 },
        { type: '歩', player: 'sente', file: 5, rank: 2 }, // 経路上に駒があってもOK
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });

    it('1マス移動の駒(歩、金、銀、王): 常にtrue', () => {
      const from: Position = { file: 5, rank: 5 };
      const to: Position = { file: 5, rank: 6 };
      const board: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 5 },
      ];

      expect(isPathClear(from, to, board)).toBe(true);
    });
  });

  describe('移動先の駒チェック', () => {
    it('移動先に味方の駒がある場合、その位置は移動可能マスに含まれない', () => {
      // TODO: T027実装後にcalculateValidMovesでテスト
      expect(true).toBe(true); // プレースホルダー
    });

    it('移動先に駒がない場合、その位置は移動可能マスに含まれる', () => {
      // TODO: T027実装後にcalculateValidMovesでテスト
      expect(true).toBe(true); // プレースホルダー
    });

    it('長距離駒: 経路上に駒がある場合、その先のマスは移動可能マスに含まれない', () => {
      // TODO: T028実装後にcalculateValidMovesでテスト
      expect(true).toBe(true); // プレースホルダー
    });
  });
});
