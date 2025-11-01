import { describe, it, expect } from 'vitest';
import { isValidMove } from '../../src/logic/moveRules';
import type { Piece } from '../../src/types/piece';
import type { Position } from '../../src/types/position';

/**
 * T023: エッジケーステスト
 * - 盤面の端での移動
 * - 特殊な駒の動き(桂馬の2マスジャンプ)
 */

describe('moveRules - エッジケース', () => {
  const emptyBoard: Piece[] = [];

  describe('盤面の端での移動制限', () => {
    it('1筋の歩は右に移動できない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 1, rank: 5 };
      const from: Position = { file: 1, rank: 5 };
      const to: Position = { file: 0, rank: 6 }; // 盤外

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('9筋の歩は左に移動できない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 9, rank: 5 };
      const from: Position = { file: 9, rank: 5 };
      const to: Position = { file: 10, rank: 6 }; // 盤外

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('1段の歩(後手)は前進できない', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 1 };
      const from: Position = { file: 5, rank: 1 };
      const to: Position = { file: 5, rank: 0 }; // 盤外

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('9段の歩(先手)は前進できない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 9 };
      const from: Position = { file: 5, rank: 9 };
      const to: Position = { file: 5, rank: 10 }; // 盤外

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });
  });

  describe('香車の直進性', () => {
    it('香車は前方直進のみ、横には移動できない', () => {
      const piece: Piece = { type: '香', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };
      const to: Position = { file: 6, rank: 5 }; // 横移動

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('香車は後退できない', () => {
      const piece: Piece = { type: '香', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };
      const to: Position = { file: 5, rank: 4 }; // 後退

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });
  });

  describe('桂馬の特殊な動き', () => {
    it('桂馬は前方2マス+左右1マスのみ、他の位置には移動できない', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 前方1マスは不可
      expect(isValidMove(from, { file: 5, rank: 6 }, piece, emptyBoard)).toBe(false);
      // 斜め前方は不可
      expect(isValidMove(from, { file: 6, rank: 6 }, piece, emptyBoard)).toBe(false);
      // 真横は不可
      expect(isValidMove(from, { file: 6, rank: 5 }, piece, emptyBoard)).toBe(false);
    });

    it('桂馬は前方2マス+左右1マスには移動可能', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 右前方2+1
      expect(isValidMove(from, { file: 4, rank: 7 }, piece, emptyBoard)).toBe(true);
      // 左前方2+1
      expect(isValidMove(from, { file: 6, rank: 7 }, piece, emptyBoard)).toBe(true);
    });

    it('2段目の桂馬(先手)は移動先が盤外になるため移動不可', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 5, rank: 8 };
      const from: Position = { file: 5, rank: 8 };

      // 前方2マス+左右1マスは盤外(rank 10)
      expect(isValidMove(from, { file: 4, rank: 10 }, piece, emptyBoard)).toBe(false);
      expect(isValidMove(from, { file: 6, rank: 10 }, piece, emptyBoard)).toBe(false);
    });
  });

  describe('角・飛車の長距離移動', () => {
    it('角は斜め方向のみ移動可能、縦横には移動できない', () => {
      const piece: Piece = { type: '角', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 縦方向は不可
      expect(isValidMove(from, { file: 5, rank: 8 }, piece, emptyBoard)).toBe(false);
      // 横方向は不可
      expect(isValidMove(from, { file: 8, rank: 5 }, piece, emptyBoard)).toBe(false);
      // 斜め方向は可能
      expect(isValidMove(from, { file: 8, rank: 8 }, piece, emptyBoard)).toBe(true);
    });

    it('飛車は縦横方向のみ移動可能、斜めには移動できない', () => {
      const piece: Piece = { type: '飛', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 斜め方向は不可
      expect(isValidMove(from, { file: 8, rank: 8 }, piece, emptyBoard)).toBe(false);
      // 縦方向は可能
      expect(isValidMove(from, { file: 5, rank: 8 }, piece, emptyBoard)).toBe(true);
      // 横方向は可能
      expect(isValidMove(from, { file: 8, rank: 5 }, piece, emptyBoard)).toBe(true);
    });
  });

  describe('金と銀の移動範囲の違い', () => {
    it('銀は真後ろに移動できない', () => {
      const piece: Piece = { type: '銀', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };
      const to: Position = { file: 5, rank: 4 }; // 真後ろ

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('銀は後方斜めに移動可能', () => {
      const piece: Piece = { type: '銀', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 右後方
      expect(isValidMove(from, { file: 4, rank: 4 }, piece, emptyBoard)).toBe(true);
      // 左後方
      expect(isValidMove(from, { file: 6, rank: 4 }, piece, emptyBoard)).toBe(true);
    });

    it('金は真後ろに移動可能', () => {
      const piece: Piece = { type: '金', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };
      const to: Position = { file: 5, rank: 4 }; // 真後ろ

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(true);
    });

    it('金は後方斜めに移動できない', () => {
      const piece: Piece = { type: '金', player: 'sente', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // 右後方斜めは不可
      expect(isValidMove(from, { file: 4, rank: 4 }, piece, emptyBoard)).toBe(false);
      // 左後方斜めは不可
      expect(isValidMove(from, { file: 6, rank: 4 }, piece, emptyBoard)).toBe(false);
    });
  });

  describe('後手の駒の動き', () => {
    it('後手の歩は先手と逆方向(rank減少方向)に移動', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // rank減少方向は可能
      expect(isValidMove(from, { file: 5, rank: 4 }, piece, emptyBoard)).toBe(true);
      // rank増加方向は不可
      expect(isValidMove(from, { file: 5, rank: 6 }, piece, emptyBoard)).toBe(false);
    });

    it('後手の桂馬は先手と逆方向にジャンプ', () => {
      const piece: Piece = { type: '桂', player: 'gote', file: 5, rank: 5 };
      const from: Position = { file: 5, rank: 5 };

      // rank減少方向+左右は可能
      expect(isValidMove(from, { file: 4, rank: 3 }, piece, emptyBoard)).toBe(true);
      expect(isValidMove(from, { file: 6, rank: 3 }, piece, emptyBoard)).toBe(true);
      // rank増加方向は不可
      expect(isValidMove(from, { file: 4, rank: 7 }, piece, emptyBoard)).toBe(false);
    });
  });
});
