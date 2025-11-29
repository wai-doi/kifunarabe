import { describe, test, expect } from 'vitest';
import { canDropPiece, dropPiece } from '../../src/logic/dropLogic';
import type { Piece } from '../../src/types/piece';

describe('dropLogic', () => {
  describe('canDropPiece', () => {
    test('空きマスには駒を打てる', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
      ];

      // 空いているマス(1, 1)に打てる
      const result = canDropPiece(pieces, { file: 1, rank: 1 });
      expect(result).toBe(true);
    });

    test('駒があるマスには打てない', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
      ];

      // 先手の歩がある位置(5, 7)には打てない
      const result = canDropPiece(pieces, { file: 5, rank: 7 });
      expect(result).toBe(false);
    });

    test('後手の駒があるマスにも打てない', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
      ];

      // 後手の歩がある位置(5, 3)には打てない
      const result = canDropPiece(pieces, { file: 5, rank: 3 });
      expect(result).toBe(false);
    });

    test('空の盤面にはどこでも打てる', () => {
      const pieces: Piece[] = [];

      // 空の盤面ならどこでも打てる
      expect(canDropPiece(pieces, { file: 1, rank: 1 })).toBe(true);
      expect(canDropPiece(pieces, { file: 5, rank: 5 })).toBe(true);
      expect(canDropPiece(pieces, { file: 9, rank: 9 })).toBe(true);
    });

    test('盤面外の位置には打てない', () => {
      const pieces: Piece[] = [];

      // 盤面外(file: 0, rank: 0)には打てない
      expect(canDropPiece(pieces, { file: 0, rank: 0 })).toBe(false);
      // 盤面外(file: 10, rank: 10)には打てない
      expect(canDropPiece(pieces, { file: 10, rank: 10 })).toBe(false);
      // 盤面外(file: -1, rank: 5)には打てない
      expect(canDropPiece(pieces, { file: -1, rank: 5 })).toBe(false);
    });
  });

  describe('dropPiece', () => {
    test('空きマスに駒を打つと盤面に駒が追加される', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 5, rank: 7 }];

      const result = dropPiece(pieces, { file: 3, rank: 5 }, '角', 'sente');

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ type: '角', player: 'sente', file: 3, rank: 5 });
      // 元の駒も残っている
      expect(result).toContainEqual({ type: '歩', player: 'sente', file: 5, rank: 7 });
    });

    test('後手が駒を打つと後手の駒として追加される', () => {
      const pieces: Piece[] = [];

      const result = dropPiece(pieces, { file: 1, rank: 1 }, '飛', 'gote');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ type: '飛', player: 'gote', file: 1, rank: 1 });
    });

    test('元の盤面は変更されない(イミュータブル)', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 5, rank: 7 }];

      const result = dropPiece(pieces, { file: 3, rank: 5 }, '角', 'sente');

      // 元の盤面は変更されない
      expect(pieces).toHaveLength(1);
      // 結果は別のオブジェクト
      expect(result).not.toBe(pieces);
      expect(result).toHaveLength(2);
    });

    test('異なる種類の駒を打てる', () => {
      const pieces: Piece[] = [];

      // 歩を打つ
      let result = dropPiece(pieces, { file: 5, rank: 5 }, '歩', 'sente');
      expect(result[0].type).toBe('歩');

      // 桂を打つ
      result = dropPiece(pieces, { file: 3, rank: 3 }, '桂', 'gote');
      expect(result[0].type).toBe('桂');

      // 香を打つ
      result = dropPiece(pieces, { file: 1, rank: 2 }, '香', 'sente');
      expect(result[0].type).toBe('香');
    });
  });
});
