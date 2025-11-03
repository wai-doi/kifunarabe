import { describe, it, expect } from 'vitest';
import { canSelectPiece, switchTurn, getTurnDisplayName } from '../../src/logic/turnControl';
import type { Turn } from '../../src/types/turn';
import type { Player } from '../../src/types/piece';

describe('turnControl', () => {
  describe('canSelectPiece', () => {
    it('先手のターンで先手の駒を選択できる', () => {
      const currentTurn: Turn = 'sente';
      const piecePlayer: Player = 'sente';
      expect(canSelectPiece(currentTurn, piecePlayer)).toBe(true);
    });

    it('後手のターンで後手の駒を選択できる', () => {
      const currentTurn: Turn = 'gote';
      const piecePlayer: Player = 'gote';
      expect(canSelectPiece(currentTurn, piecePlayer)).toBe(true);
    });

    it('先手のターンで後手の駒を選択できない', () => {
      const currentTurn: Turn = 'sente';
      const piecePlayer: Player = 'gote';
      expect(canSelectPiece(currentTurn, piecePlayer)).toBe(false);
    });

    it('後手のターンで先手の駒を選択できない', () => {
      const currentTurn: Turn = 'gote';
      const piecePlayer: Player = 'sente';
      expect(canSelectPiece(currentTurn, piecePlayer)).toBe(false);
    });
  });

  describe('switchTurn', () => {
    it('先手から後手に切り替わる', () => {
      const currentTurn: Turn = 'sente';
      expect(switchTurn(currentTurn)).toBe('gote');
    });

    it('後手から先手に切り替わる', () => {
      const currentTurn: Turn = 'gote';
      expect(switchTurn(currentTurn)).toBe('sente');
    });
  });

  describe('getTurnDisplayName', () => {
    it('先手のターンで「先手の番」を返す', () => {
      const turn: Turn = 'sente';
      expect(getTurnDisplayName(turn)).toBe('先手の番');
    });

    it('後手のターンで「後手の番」を返す', () => {
      const turn: Turn = 'gote';
      expect(getTurnDisplayName(turn)).toBe('後手の番');
    });
  });
});
