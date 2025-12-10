/**
 * 二歩検証ロジックのテスト
 */

import { describe, it, expect } from 'vitest';
import {
  hasUnpromotedPawnInFile,
  validateDoublePawn,
  getValidPawnDropSquares,
  getErrorMessage,
} from '../../src/logic/doublePawnValidation';
import type { Piece } from '../../src/types/piece';
import type { Position } from '../../src/types/position';

describe('doublePawnValidation', () => {
  describe('hasUnpromotedPawnInFile', () => {
    it('同じ筋に歩がある場合はtrueを返す', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }];
      expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(true);
    });

    it('異なる筋に歩がある場合はfalseを返す', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }];
      expect(hasUnpromotedPawnInFile(pieces, 5, 'sente')).toBe(false);
    });

    it('空の盤面の場合はfalseを返す', () => {
      const pieces: Piece[] = [];
      expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(false);
    });

    it('同じ筋に成り駒（と金）がある場合はfalseを返す', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 4, promoted: true }];
      expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(false);
    });

    it('成り駒と未成の歩が混在する場合、未成の歩のみをカウント', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 3, rank: 4, promoted: true },
      ];
      expect(hasUnpromotedPawnInFile(pieces, 3, 'sente')).toBe(true);
    });

    it('先手の歩がある筋に後手は歩を打てる（相手の歩は影響しない）', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }];
      expect(hasUnpromotedPawnInFile(pieces, 3, 'gote')).toBe(false);
    });

    it('全ての筋（1-9筋）で正しく判定される', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 1, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 9, rank: 7, promoted: false },
      ];
      expect(hasUnpromotedPawnInFile(pieces, 1, 'sente')).toBe(true);
      expect(hasUnpromotedPawnInFile(pieces, 2, 'sente')).toBe(false);
      expect(hasUnpromotedPawnInFile(pieces, 5, 'sente')).toBe(true);
      expect(hasUnpromotedPawnInFile(pieces, 9, 'sente')).toBe(true);
    });
  });

  describe('validateDoublePawn', () => {
    // T009: 基本的な二歩検証
    describe('基本的な二歩検証', () => {
      it('同じ筋に歩がある場合はisValid=false、errorCode=DOUBLE_PAWNを返す', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        ];
        const position: Position = { file: 3, rank: 5 };
        const result = validateDoublePawn(pieces, position, '歩', 'sente');

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('DOUBLE_PAWN');
        expect(result.errorMessage).toBe('二歩は反則です');
      });

      it('異なる筋に歩がある場合はisValid=trueを返す', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        ];
        const position: Position = { file: 5, rank: 5 };
        const result = validateDoublePawn(pieces, position, '歩', 'sente');

        expect(result.isValid).toBe(true);
        expect(result.errorCode).toBeUndefined();
      });

      it('空の盤面の場合はisValid=trueを返す', () => {
        const pieces: Piece[] = [];
        const position: Position = { file: 3, rank: 5 };
        const result = validateDoublePawn(pieces, position, '歩', 'sente');

        expect(result.isValid).toBe(true);
      });
    });

    // T010: 成り駒の扱い
    describe('成り駒の扱い', () => {
      it('同じ筋に成り駒（と金）がある場合はisValid=trueを返す', () => {
        const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 4, promoted: true }];
        const position: Position = { file: 3, rank: 7 };
        const result = validateDoublePawn(pieces, position, '歩', 'sente');

        expect(result.isValid).toBe(true);
      });

      it('成り駒と未成の歩が混在する場合、未成の歩のみをカウント', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
          { type: '歩', player: 'sente', file: 3, rank: 4, promoted: true },
        ];
        const position: Position = { file: 3, rank: 5 };
        const result = validateDoublePawn(pieces, position, '歩', 'sente');

        expect(result.isValid).toBe(false);
        expect(result.errorCode).toBe('DOUBLE_PAWN');
      });
    });

    // T011: プレイヤー別の二歩判定
    describe('プレイヤー別の二歩判定', () => {
      it('先手の歩がある筋に後手は歩を打てる', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        ];
        const position: Position = { file: 3, rank: 4 };
        const result = validateDoublePawn(pieces, position, '歩', 'gote');

        expect(result.isValid).toBe(true);
      });

      it('全ての筋（1-9筋）で正しく判定される', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 1, rank: 7, promoted: false },
          { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
        ];

        // 1筋: 歩があるので打てない
        expect(validateDoublePawn(pieces, { file: 1, rank: 6 }, '歩', 'sente').isValid).toBe(false);
        // 2筋: 歩がないので打てる
        expect(validateDoublePawn(pieces, { file: 2, rank: 6 }, '歩', 'sente').isValid).toBe(true);
        // 5筋: 歩があるので打てない
        expect(validateDoublePawn(pieces, { file: 5, rank: 6 }, '歩', 'sente').isValid).toBe(false);
        // 9筋: 歩がないので打てる
        expect(validateDoublePawn(pieces, { file: 9, rank: 6 }, '歩', 'sente').isValid).toBe(true);
      });
    });

    // T012: 歩以外の駒のスキップ
    describe('歩以外の駒の処理', () => {
      it('歩以外の駒の場合、二歩チェックをスキップしてisValid=trueを返す', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        ];
        const position: Position = { file: 3, rank: 5 };

        // 飛車を打つ場合、同じ筋に歩があっても問題ない
        const result = validateDoublePawn(pieces, position, '飛', 'sente');
        expect(result.isValid).toBe(true);
      });

      it('角を打つ場合も二歩チェックをスキップ', () => {
        const pieces: Piece[] = [
          { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
        ];
        const result = validateDoublePawn(pieces, { file: 5, rank: 5 }, '角', 'sente');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('getValidPawnDropSquares', () => {
    it('歩がある筋を除外した空きマスのリストを返す', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 5, rank: 6, promoted: false },
        { type: '角', player: 'sente', file: 2, rank: 2, promoted: false },
      ];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      // 3筋と5筋には歩があるので除外される
      const hasFile3 = validSquares.some((pos) => pos.file === 3);
      const hasFile5 = validSquares.some((pos) => pos.file === 5);
      expect(hasFile3).toBe(false);
      expect(hasFile5).toBe(false);

      // 1筋、2筋、4筋、6筋、7筋、8筋、9筋には打てる（空きマスのみ）
      const hasFile1 = validSquares.some((pos) => pos.file === 1);
      const hasFile2 = validSquares.some((pos) => pos.file === 2);
      const hasFile4 = validSquares.some((pos) => pos.file === 4);
      expect(hasFile1).toBe(true);
      expect(hasFile2).toBe(true);
      expect(hasFile4).toBe(true);
    });

    it('成り駒がある筋は除外しない（打てる）', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 4, promoted: true }];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      // 3筋に成り駒があるが、未成の歩ではないので打てる
      const hasFile3 = validSquares.some((pos) => pos.file === 3);
      expect(hasFile3).toBe(true);
    });

    it('相手の歩がある筋は除外しない', () => {
      const pieces: Piece[] = [{ type: '歩', player: 'gote', file: 3, rank: 3, promoted: false }];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      // 3筋に後手の歩があるが、先手は打てる
      const hasFile3 = validSquares.some((pos) => pos.file === 3);
      expect(hasFile3).toBe(true);
    });

    it('駒が置かれているマスは除外される', () => {
      const pieces: Piece[] = [{ type: '角', player: 'sente', file: 5, rank: 5, promoted: false }];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      // (5, 5)には駒があるので含まれない
      const has5_5 = validSquares.some((pos) => pos.file === 5 && pos.rank === 5);
      expect(has5_5).toBe(false);

      // 5筋の他のマスは打てる
      const hasOther5 = validSquares.some((pos) => pos.file === 5 && pos.rank !== 5);
      expect(hasOther5).toBe(true);
    });

    it('空の盤面では全81マスが候補', () => {
      const pieces: Piece[] = [];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      expect(validSquares).toHaveLength(81);
    });

    it('全ての筋に歩がある場合は空配列を返す', () => {
      const pieces: Piece[] = [
        { type: '歩', player: 'sente', file: 1, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 2, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 4, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 6, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 7, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 8, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 9, rank: 7, promoted: false },
      ];

      const validSquares = getValidPawnDropSquares(pieces, 'sente');

      expect(validSquares).toHaveLength(0);
    });
  });

  describe('getErrorMessage', () => {
    // TODO: T014で実装確認テストを追加
    it('should return correct error messages', () => {
      expect(getErrorMessage('DOUBLE_PAWN')).toBe('二歩は反則です');
      expect(getErrorMessage('OUT_OF_BOARD')).toBe('盤面外には打てません');
      expect(getErrorMessage('SQUARE_OCCUPIED')).toBe('既に駒があるマスには打てません');
    });
  });

  // T029: エッジケースのテスト
  describe('エッジケース', () => {
    it('歩が移動した後、元の筋に歩を打てることを確認', () => {
      // 初期状態: 3筋7段に歩がある
      // 移動後: 3筋6段に歩が移動（3筋7段は空）
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 6, promoted: false }];

      // 3筋には歩が1つしかないので、別の段に打てる
      const result = validateDoublePawn(pieces, { file: 3, rank: 7 }, '歩', 'sente');
      expect(result.isValid).toBe(false); // 実際には二歩になる
      expect(result.errorCode).toBe('DOUBLE_PAWN');
    });

    it('歩が成ってと金になった後、同じ筋に歩を打てることを確認', () => {
      // 3筋に成り駒（と金）がある
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 4, promoted: true }];

      // 成り駒は歩としてカウントされないので、3筋に歩を打てる
      const result = validateDoublePawn(pieces, { file: 3, rank: 7 }, '歩', 'sente');
      expect(result.isValid).toBe(true);
      expect(result.errorCode).toBeUndefined();
    });

    it('履歴をナビゲートして過去の局面に戻った場合の二歩判定を確認', () => {
      // 現在の盤面: 3筋に歩がない（移動や取られた後）
      const currentPieces: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
      ];

      // 3筋に歩がないので打てる
      const result = validateDoublePawn(currentPieces, { file: 3, rank: 7 }, '歩', 'sente');
      expect(result.isValid).toBe(true);

      // 過去の局面: 3筋に歩があった状態に戻った
      const pastPieces: Piece[] = [
        { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
        { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false },
      ];

      // 過去の盤面では3筋に歩があるので打てない
      const pastResult = validateDoublePawn(pastPieces, { file: 3, rank: 5 }, '歩', 'sente');
      expect(pastResult.isValid).toBe(false);
      expect(pastResult.errorCode).toBe('DOUBLE_PAWN');
    });

    it('歩を移動後、同じ筋には依然として打てない', () => {
      // 3筋の歩が6段に移動
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 3, rank: 6, promoted: false }];

      // 3筋にはまだ歩があるので、別の段にも打てない
      const result = validateDoublePawn(pieces, { file: 3, rank: 8 }, '歩', 'sente');
      expect(result.isValid).toBe(false);
      expect(result.errorCode).toBe('DOUBLE_PAWN');
    });

    it('歩が取られた後、その筋に再度歩を打てる', () => {
      // 3筋に歩がない（取られた）
      const pieces: Piece[] = [{ type: '歩', player: 'sente', file: 5, rank: 7, promoted: false }];

      // 3筋に歩がないので打てる
      const result = validateDoublePawn(pieces, { file: 3, rank: 7 }, '歩', 'sente');
      expect(result.isValid).toBe(true);
    });
  });
});
