import { describe, it, expect } from 'vitest';
import {
  isValidPosition,
  updateBoardAfterMove,
  createInitialGameState,
} from '../../src/logic/boardState';
import type { Piece } from '../../src/types/piece';
import type { Position } from '../../src/types/position';

describe('boardState', () => {
  describe('isValidPosition', () => {
    it('有効な座標(1,1)はtrue', () => {
      expect(isValidPosition({ file: 1, rank: 1 })).toBe(true);
    });

    it('有効な座標(9,9)はtrue', () => {
      expect(isValidPosition({ file: 9, rank: 9 })).toBe(true);
    });

    it('有効な座標(5,5)はtrue', () => {
      expect(isValidPosition({ file: 5, rank: 5 })).toBe(true);
    });

    it('盤外の座標(0,5)はfalse', () => {
      expect(isValidPosition({ file: 0, rank: 5 })).toBe(false);
    });

    it('盤外の座標(10,5)はfalse', () => {
      expect(isValidPosition({ file: 10, rank: 5 })).toBe(false);
    });

    it('盤外の座標(5,0)はfalse', () => {
      expect(isValidPosition({ file: 5, rank: 0 })).toBe(false);
    });

    it('盤外の座標(5,10)はfalse', () => {
      expect(isValidPosition({ file: 5, rank: 10 })).toBe(false);
    });
  });

  describe('updateBoardAfterMove', () => {
    const initialBoard: Piece[] = [
      { type: '歩', player: 'sente', file: 5, rank: 3 },
      { type: '金', player: 'sente', file: 4, rank: 1 },
      { type: '王', player: 'sente', file: 5, rank: 1 },
      { type: '歩', player: 'gote', file: 5, rank: 7 },
    ];

    it('指定された駒が正しく移動される', () => {
      const from: Position = { file: 5, rank: 3 };
      const to: Position = { file: 5, rank: 4 };
      const newBoard = updateBoardAfterMove(initialBoard, from, to);

      // 移動した駒が新しい位置にある
      const movedPiece = newBoard.find((p) => p.file === 5 && p.rank === 4);
      expect(movedPiece).toBeDefined();
      expect(movedPiece?.type).toBe('歩');
      expect(movedPiece?.player).toBe('sente');

      // 元の位置には駒がない
      const oldPosition = newBoard.find((p) => p.file === 5 && p.rank === 3);
      expect(oldPosition).toBeUndefined();
    });

    it('他の駒は影響を受けない', () => {
      const from: Position = { file: 5, rank: 3 };
      const to: Position = { file: 5, rank: 4 };
      const newBoard = updateBoardAfterMove(initialBoard, from, to);

      // 他の駒は元の位置に残る
      expect(newBoard.find((p) => p.file === 4 && p.rank === 1)).toBeDefined();
      expect(newBoard.find((p) => p.file === 5 && p.rank === 1)).toBeDefined();
      expect(newBoard.find((p) => p.file === 5 && p.rank === 7)).toBeDefined();
    });

    it('元の盤面は変更されない(イミュータブル)', () => {
      const from: Position = { file: 5, rank: 3 };
      const to: Position = { file: 5, rank: 4 };
      const newBoard = updateBoardAfterMove(initialBoard, from, to);

      // 元の盤面は変更されていない
      expect(initialBoard.find((p) => p.file === 5 && p.rank === 3)).toBeDefined();
      expect(initialBoard.find((p) => p.file === 5 && p.rank === 4)).toBeUndefined();

      // 新しい盤面は別のオブジェクト
      expect(newBoard).not.toBe(initialBoard);
    });

    it('盤面のサイズは変わらない', () => {
      const from: Position = { file: 5, rank: 3 };
      const to: Position = { file: 5, rank: 4 };
      const newBoard = updateBoardAfterMove(initialBoard, from, to);

      expect(newBoard.length).toBe(initialBoard.length);
    });

    it('複数回の移動が正しく適用される', () => {
      const from1: Position = { file: 5, rank: 3 };
      const to1: Position = { file: 5, rank: 4 };
      const board1 = updateBoardAfterMove(initialBoard, from1, to1);

      const from2: Position = { file: 5, rank: 4 };
      const to2: Position = { file: 5, rank: 5 };
      const board2 = updateBoardAfterMove(board1, from2, to2);

      // 最終的な位置に駒がある
      expect(board2.find((p) => p.file === 5 && p.rank === 5)).toBeDefined();
      // 中間位置と元の位置には駒がない
      expect(board2.find((p) => p.file === 5 && p.rank === 4)).toBeUndefined();
      expect(board2.find((p) => p.file === 5 && p.rank === 3)).toBeUndefined();
    });
  });

  // T019: US2 - ターン切り替えロジックのテスト
  describe('createInitialGameState', () => {
    it('初期ゲーム状態には先手のターンが設定されている', () => {
      const gameState = createInitialGameState();
      expect(gameState.currentTurn).toBe('sente');
    });

    it('初期ゲーム状態には選択中のマスがnullである', () => {
      const gameState = createInitialGameState();
      expect(gameState.selectedSquare).toBeNull();
    });

    it('初期ゲーム状態には40枚の駒がある', () => {
      const gameState = createInitialGameState();
      expect(gameState.pieces.length).toBe(40);
    });

    it('初期ゲーム状態には空の持ち駒が設定されている', () => {
      const gameState = createInitialGameState();
      expect(gameState.capturedPieces).toBeDefined();
      expect(gameState.capturedPieces.sente).toEqual({});
      expect(gameState.capturedPieces.gote).toEqual({});
    });
  });
});
