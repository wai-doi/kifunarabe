import { describe, test, expect } from 'vitest';
import {
  getTargetPiece,
  addToCapturedPieces,
  removePieceFromBoard,
} from '../../src/logic/captureLogic';
import type { Piece } from '../../src/types/piece';
import type { CapturedPieces } from '../../src/types/capturedPieces';

describe('captureLogic', () => {
  describe('getTargetPiece', () => {
    const pieces: Piece[] = [
      // 先手の駒
      { type: '歩', player: 'sente', file: 5, rank: 7 },
      { type: '飛', player: 'sente', file: 2, rank: 8 },
      // 後手の駒
      { type: '歩', player: 'gote', file: 5, rank: 3 },
      { type: '角', player: 'gote', file: 8, rank: 2 },
    ];

    test('移動先に相手の駒があるとき、その駒を返す', () => {
      // 先手のプレイヤーが後手の歩(5, 3)の位置を見る
      const result = getTargetPiece(pieces, { file: 5, rank: 3 }, 'sente');
      expect(result).toEqual({ type: '歩', player: 'gote', file: 5, rank: 3 });

      // 後手のプレイヤーが先手の飛(2, 8)の位置を見る
      const result2 = getTargetPiece(pieces, { file: 2, rank: 8 }, 'gote');
      expect(result2).toEqual({ type: '飛', player: 'sente', file: 2, rank: 8 });
    });

    test('移動先が空のとき、nullを返す', () => {
      // 空のマス(1, 1)を確認
      const result = getTargetPiece(pieces, { file: 1, rank: 1 }, 'sente');
      expect(result).toBeNull();
    });

    test('移動先に自分の駒があるとき、nullを返す', () => {
      // 先手のプレイヤーが先手の歩(5, 7)の位置を見る
      const result = getTargetPiece(pieces, { file: 5, rank: 7 }, 'sente');
      expect(result).toBeNull();

      // 後手のプレイヤーが後手の角(8, 2)の位置を見る
      const result2 = getTargetPiece(pieces, { file: 8, rank: 2 }, 'gote');
      expect(result2).toBeNull();
    });

    test('無効な位置が指定されたとき、nullを返す', () => {
      // 盤面外の位置(10, 10)を確認
      const result = getTargetPiece(pieces, { file: 10, rank: 10 }, 'sente');
      expect(result).toBeNull();

      // 負の座標(-1, -1)を確認
      const result2 = getTargetPiece(pieces, { file: -1, rank: -1 }, 'gote');
      expect(result2).toBeNull();
    });
  });

  describe('addToCapturedPieces', () => {
    test('空の持ち駒に駒を追加すると、その駒の数量が1になる', () => {
      const capturedPieces: CapturedPieces = {
        sente: {},
        gote: {},
      };
      const capturedPiece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = addToCapturedPieces(capturedPieces, capturedPiece, 'sente');

      expect(result.sente['歩']).toBe(1);
      expect(result.gote).toEqual({});
    });

    test('既に同じ種類の駒がある場合、数量が増える', () => {
      const capturedPieces: CapturedPieces = {
        sente: { 歩: 2 },
        gote: {},
      };
      const capturedPiece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = addToCapturedPieces(capturedPieces, capturedPiece, 'sente');

      expect(result.sente['歩']).toBe(3);
    });

    test('後手が駒を取った場合、後手の持ち駒が増える', () => {
      const capturedPieces: CapturedPieces = {
        sente: {},
        gote: {},
      };
      const capturedPiece: Piece = { type: '飛', player: 'sente', file: 2, rank: 8 };

      const result = addToCapturedPieces(capturedPieces, capturedPiece, 'gote');

      expect(result.gote['飛']).toBe(1);
      expect(result.sente).toEqual({});
    });

    test('異なる種類の駒を取った場合、それぞれ独立して記録される', () => {
      const capturedPieces: CapturedPieces = {
        sente: { 歩: 1 },
        gote: {},
      };
      const capturedPiece: Piece = { type: '角', player: 'gote', file: 8, rank: 2 };

      const result = addToCapturedPieces(capturedPieces, capturedPiece, 'sente');

      expect(result.sente['歩']).toBe(1);
      expect(result.sente['角']).toBe(1);
    });

    test('元の持ち駒オブジェクトは変更されない(イミュータブル)', () => {
      const capturedPieces: CapturedPieces = {
        sente: {},
        gote: {},
      };
      const capturedPiece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = addToCapturedPieces(capturedPieces, capturedPiece, 'sente');

      expect(capturedPieces.sente).toEqual({});
      expect(result.sente['歩']).toBe(1);
      expect(result).not.toBe(capturedPieces);
    });
  });

  describe('removePieceFromBoard', () => {
    test('指定された駒を盤面から削除する', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '飛', player: 'sente', file: 2, rank: 8 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
        { type: '角', player: 'gote', file: 8, rank: 2 },
      ];
      const pieceToRemove: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = removePieceFromBoard(pieces, pieceToRemove);

      expect(result).toHaveLength(3);
      expect(result).not.toContainEqual(pieceToRemove);
    });

    test('削除後も他の駒は残る', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '飛', player: 'sente', file: 2, rank: 8 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
      ];
      const pieceToRemove: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = removePieceFromBoard(pieces, pieceToRemove);

      expect(result).toContainEqual({ type: '歩', player: 'sente', file: 5, rank: 7 });
      expect(result).toContainEqual({ type: '飛', player: 'sente', file: 2, rank: 8 });
    });

    test('元の盤面は変更されない(イミュータブル)', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7 },
        { type: '歩', player: 'gote', file: 5, rank: 3 },
      ];
      const pieceToRemove: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };

      const result = removePieceFromBoard(pieces, pieceToRemove);

      expect(pieces).toHaveLength(2);
      expect(result).toHaveLength(1);
      expect(result).not.toBe(pieces);
    });

    test('存在しない駒を削除しようとしても盤面は変わらない', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 5, rank: 7 }];
      const pieceToRemove: Piece = { type: '歩', player: 'gote', file: 9, rank: 9 };

      const result = removePieceFromBoard(pieces, pieceToRemove);

      expect(result).toHaveLength(1);
      expect(result).toEqual(pieces);
    });
  });
});
