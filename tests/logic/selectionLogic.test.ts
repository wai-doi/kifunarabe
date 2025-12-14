import { describe, it, expect } from 'vitest';
import { canSelectPiece } from '../../src/logic/selectionLogic';
import type { Piece } from '../../src/types/piece';

describe('selectionLogic', () => {
  describe('canSelectPiece', () => {
    it('空マス（null）の場合はfalseを返す', () => {
      const result = canSelectPiece(null, 'sente');
      expect(result).toBe(false);
    });

    it('先手の手番で先手の駒の場合はtrueを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 7,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'sente');
      expect(result).toBe(true);
    });

    it('先手の手番で後手の駒の場合はfalseを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'gote',
        file: 5,
        rank: 3,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'sente');
      expect(result).toBe(false);
    });

    it('後手の手番で後手の駒の場合はtrueを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'gote',
        file: 5,
        rank: 3,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'gote');
      expect(result).toBe(true);
    });

    it('後手の手番で先手の駒の場合はfalseを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 7,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'gote');
      expect(result).toBe(false);
    });
  });
});
