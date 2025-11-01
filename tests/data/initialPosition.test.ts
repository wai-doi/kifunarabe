import { describe, it, expect } from 'vitest';
import { INITIAL_POSITION } from '../../src/data/initialPosition';
import type { Piece } from '../../src/types/piece';

describe('INITIAL_POSITION', () => {
  it('40枚の駒が含まれている', () => {
    expect(INITIAL_POSITION).toHaveLength(40);
  });

  it('重複する位置がない', () => {
    const positions = INITIAL_POSITION.map(
      (piece) => `${piece.file}-${piece.rank}`
    );
    const uniquePositions = new Set(positions);
    expect(uniquePositions.size).toBe(INITIAL_POSITION.length);
  });

  it('先手に王が1枚だけ存在する', () => {
    const senteKings = INITIAL_POSITION.filter(
      (piece) => piece.type === '王' && piece.player === 'sente'
    );
    expect(senteKings).toHaveLength(1);
  });

  it('後手に玉が1枚だけ存在する', () => {
    const goteKings = INITIAL_POSITION.filter(
      (piece) => piece.type === '玉' && piece.player === 'gote'
    );
    expect(goteKings).toHaveLength(1);
  });

  it('すべての駒のfile、rankが1-9の範囲内', () => {
    INITIAL_POSITION.forEach((piece) => {
      expect(piece.file).toBeGreaterThanOrEqual(1);
      expect(piece.file).toBeLessThanOrEqual(9);
      expect(piece.rank).toBeGreaterThanOrEqual(1);
      expect(piece.rank).toBeLessThanOrEqual(9);
    });
  });

  it('先手の駒が20枚存在する', () => {
    const sentePieces = INITIAL_POSITION.filter(
      (piece) => piece.player === 'sente'
    );
    expect(sentePieces).toHaveLength(20);
  });

  it('後手の駒が20枚存在する', () => {
    const gotePieces = INITIAL_POSITION.filter(
      (piece) => piece.player === 'gote'
    );
    expect(gotePieces).toHaveLength(20);
  });

  it('先手の1段目に正しい駒配置', () => {
    const expectedRank1: Piece[] = [
      { type: '香', player: 'sente', file: 1, rank: 1 },
      { type: '桂', player: 'sente', file: 2, rank: 1 },
      { type: '銀', player: 'sente', file: 3, rank: 1 },
      { type: '金', player: 'sente', file: 4, rank: 1 },
      { type: '王', player: 'sente', file: 5, rank: 1 },
      { type: '金', player: 'sente', file: 6, rank: 1 },
      { type: '銀', player: 'sente', file: 7, rank: 1 },
      { type: '桂', player: 'sente', file: 8, rank: 1 },
      { type: '香', player: 'sente', file: 9, rank: 1 },
    ];

    const rank1Pieces = INITIAL_POSITION.filter((piece) => piece.rank === 1);
    expect(rank1Pieces).toEqual(expectedRank1);
  });

  it('後手の9段目に正しい駒配置', () => {
    const expectedRank9: Piece[] = [
      { type: '香', player: 'gote', file: 1, rank: 9 },
      { type: '桂', player: 'gote', file: 2, rank: 9 },
      { type: '銀', player: 'gote', file: 3, rank: 9 },
      { type: '金', player: 'gote', file: 4, rank: 9 },
      { type: '玉', player: 'gote', file: 5, rank: 9 },
      { type: '金', player: 'gote', file: 6, rank: 9 },
      { type: '銀', player: 'gote', file: 7, rank: 9 },
      { type: '桂', player: 'gote', file: 8, rank: 9 },
      { type: '香', player: 'gote', file: 9, rank: 9 },
    ];

    const rank9Pieces = INITIAL_POSITION.filter((piece) => piece.rank === 9);
    expect(rank9Pieces).toEqual(expectedRank9);
  });
});
