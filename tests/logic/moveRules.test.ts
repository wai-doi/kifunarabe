import { describe, it, expect } from 'vitest';
import {
  calculateValidMoves,
  isValidMove,
  getAdjustedVectors,
  MOVE_PATTERNS,
  PROMOTED_MOVE_PATTERNS,
} from '../../src/logic/moveRules';
import type { Piece } from '../../src/types/piece';
import type { Position } from '../../src/types/position';

describe('moveRules', () => {
  // T016: calculateValidMoves関数のテスト
  describe('calculateValidMoves', () => {
    const emptyBoard: Piece[] = [];

    it('先手の歩は前方1マスのみ移動可能', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7 };
      const position: Position = { file: 5, rank: 7 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(1);
      expect(validMoves).toContainEqual({ file: 5, rank: 8 });
    });

    it('後手の歩は前方1マスのみ移動可能(rank減少方向)', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };
      const position: Position = { file: 5, rank: 3 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(1);
      expect(validMoves).toContainEqual({ file: 5, rank: 2 });
    });

    it('先手の香は前方直進(盤面の端まで)', () => {
      const piece: Piece = { type: '香', player: 'sente', file: 1, rank: 1 };
      const position: Position = { file: 1, rank: 1 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(8); // rank 2-9
      expect(validMoves).toContainEqual({ file: 1, rank: 2 });
      expect(validMoves).toContainEqual({ file: 1, rank: 9 });
    });

    it('先手の桂は前方2マス+左右1マスの2箇所', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 5, rank: 1 };
      const position: Position = { file: 5, rank: 1 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(2);
      expect(validMoves).toContainEqual({ file: 4, rank: 3 });
      expect(validMoves).toContainEqual({ file: 6, rank: 3 });
    });

    it('先手の銀は前方3方向+後方斜め2方向の5箇所', () => {
      const piece: Piece = { type: '銀', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(5);
      expect(validMoves).toContainEqual({ file: 4, rank: 6 }); // 右前
      expect(validMoves).toContainEqual({ file: 5, rank: 6 }); // 前
      expect(validMoves).toContainEqual({ file: 6, rank: 6 }); // 左前
      expect(validMoves).toContainEqual({ file: 4, rank: 4 }); // 右後ろ
      expect(validMoves).toContainEqual({ file: 6, rank: 4 }); // 左後ろ
    });

    it('先手の金は前方3方向+横2方向+真後ろの6箇所', () => {
      const piece: Piece = { type: '金', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(6);
      expect(validMoves).toContainEqual({ file: 4, rank: 6 }); // 右前
      expect(validMoves).toContainEqual({ file: 5, rank: 6 }); // 前
      expect(validMoves).toContainEqual({ file: 6, rank: 6 }); // 左前
      expect(validMoves).toContainEqual({ file: 4, rank: 5 }); // 右
      expect(validMoves).toContainEqual({ file: 6, rank: 5 }); // 左
      expect(validMoves).toContainEqual({ file: 5, rank: 4 }); // 後ろ
    });

    it('先手の飛車は縦横4方向直進', () => {
      const piece: Piece = { type: '飛', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves.length).toBe(16); // 上4 + 下4 + 左4 + 右4
      // 前方
      expect(validMoves).toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).toContainEqual({ file: 5, rank: 9 });
      // 後方
      expect(validMoves).toContainEqual({ file: 5, rank: 4 });
      expect(validMoves).toContainEqual({ file: 5, rank: 1 });
      // 左
      expect(validMoves).toContainEqual({ file: 6, rank: 5 });
      expect(validMoves).toContainEqual({ file: 9, rank: 5 });
      // 右
      expect(validMoves).toContainEqual({ file: 4, rank: 5 });
      expect(validMoves).toContainEqual({ file: 1, rank: 5 });
    });

    it('先手の角は斜め4方向直進', () => {
      const piece: Piece = { type: '角', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves.length).toBe(16); // 右前4 + 左前4 + 右後4 + 左後4
      expect(validMoves).toContainEqual({ file: 6, rank: 6 }); // 左前
      expect(validMoves).toContainEqual({ file: 4, rank: 6 }); // 右前
      expect(validMoves).toContainEqual({ file: 6, rank: 4 }); // 左後
      expect(validMoves).toContainEqual({ file: 4, rank: 4 }); // 右後
    });

    it('先手の王は全方向1マス', () => {
      const piece: Piece = { type: '王', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(8);
      // 前方3方向
      expect(validMoves).toContainEqual({ file: 4, rank: 6 });
      expect(validMoves).toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).toContainEqual({ file: 6, rank: 6 });
      // 横2方向
      expect(validMoves).toContainEqual({ file: 4, rank: 5 });
      expect(validMoves).toContainEqual({ file: 6, rank: 5 });
      // 後方3方向
      expect(validMoves).toContainEqual({ file: 4, rank: 4 });
      expect(validMoves).toContainEqual({ file: 5, rank: 4 });
      expect(validMoves).toContainEqual({ file: 6, rank: 4 });
    });

    it('盤外のマスは移動可能マスに含まれない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 9 };
      const position: Position = { file: 5, rank: 9 };
      const validMoves = calculateValidMoves(piece, position, emptyBoard);

      expect(validMoves).toHaveLength(0); // rank 10は盤外
    });
  });

  // T017: isValidMove関数のテスト
  describe('isValidMove', () => {
    const emptyBoard: Piece[] = [];

    it('移動パターンに合致する移動はtrue', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7 };
      const from: Position = { file: 5, rank: 7 };
      const to: Position = { file: 5, rank: 8 };

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(true);
    });

    it('移動パターンに合致しない移動はfalse', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7 };
      const from: Position = { file: 5, rank: 7 };
      const to: Position = { file: 6, rank: 7 }; // 横移動は不可

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });

    it('盤外への移動はfalse', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 9 };
      const from: Position = { file: 5, rank: 9 };
      const to: Position = { file: 5, rank: 10 }; // rank 10は盤外

      expect(isValidMove(from, to, piece, emptyBoard)).toBe(false);
    });
  });

  // T018: getAdjustedVectors関数のテスト
  describe('getAdjustedVectors', () => {
    it('先手の場合、ベクトルはそのまま', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7 };
      const pattern = MOVE_PATTERNS['歩'];
      const adjustedVectors = getAdjustedVectors(piece, pattern);

      expect(adjustedVectors).toEqual([{ dFile: 0, dRank: 1 }]);
    });

    it('後手の場合、ベクトルが反転される', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3 };
      const pattern = MOVE_PATTERNS['歩'];
      const adjustedVectors = getAdjustedVectors(piece, pattern);

      expect(adjustedVectors).toEqual([{ dFile: 0, dRank: -1 }]);
    });

    it('後手の金のベクトルが正しく反転される', () => {
      const piece: Piece = { type: '金', player: 'gote', file: 5, rank: 5 };
      const pattern = MOVE_PATTERNS['金'];
      const adjustedVectors = getAdjustedVectors(piece, pattern);

      expect(adjustedVectors).toHaveLength(6);
      expect(adjustedVectors).toContainEqual({ dFile: 1, dRank: -1 }); // 元: { dFile: -1, dRank: 1 }
      expect(adjustedVectors).toContainEqual({ dFile: 0, dRank: -1 }); // 元: { dFile: 0, dRank: 1 }
    });
  });

  describe('collision detection integration', () => {
    it('飛車: 経路上に駒がある場合、その先のマスは移動可能マスに含まれない', () => {
      const piece: Piece = { type: '飛', player: 'sente', file: 5, rank: 1 };
      const position: Position = { file: 5, rank: 1 };
      const board: Piece[] = [
        { type: '飛', player: 'sente', file: 5, rank: 1 },
        { type: '歩', player: 'sente', file: 5, rank: 3 }, // 経路上に駒
      ];
      const validMoves = calculateValidMoves(piece, position, board);

      // rank 2までは移動可能、3以降は不可
      expect(validMoves).toContainEqual({ file: 5, rank: 2 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 3 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 4 });
    });

    it('角: 経路上に駒がある場合、その先のマスは移動可能マスに含まれない', () => {
      const piece: Piece = { type: '角', player: 'sente', file: 2, rank: 2 };
      const position: Position = { file: 2, rank: 2 };
      const board: Piece[] = [
        { type: '角', player: 'sente', file: 2, rank: 2 },
        { type: '銀', player: 'sente', file: 4, rank: 4 }, // 経路上に駒
      ];
      const validMoves = calculateValidMoves(piece, position, board);

      // (3,3)までは移動可能、(4,4)以降は不可
      expect(validMoves).toContainEqual({ file: 3, rank: 3 });
      expect(validMoves).not.toContainEqual({ file: 4, rank: 4 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 5 });
    });

    it('1マス移動の駒: 移動先に駒がある場合は移動不可', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 5 };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [
        { type: '歩', player: 'sente', file: 5, rank: 5 },
        { type: '金', player: 'sente', file: 5, rank: 6 }, // 移動先に駒
      ];
      const validMoves = calculateValidMoves(piece, position, board);

      expect(validMoves).not.toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).toHaveLength(0);
    });

    it('桂馬: 移動先に駒がある場合は移動不可(経路上の駒は無視)', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 5, rank: 1 };
      const position: Position = { file: 5, rank: 1 };
      const board: Piece[] = [
        { type: '桂', player: 'sente', file: 5, rank: 1 },
        { type: '歩', player: 'sente', file: 5, rank: 2 }, // 経路上に駒(無視)
        { type: '金', player: 'sente', file: 4, rank: 3 }, // 移動先に駒
      ];
      const validMoves = calculateValidMoves(piece, position, board);

      // 右前方は駒があるため不可
      expect(validMoves).not.toContainEqual({ file: 4, rank: 3 });
      // 左前方は可能
      expect(validMoves).toContainEqual({ file: 6, rank: 3 });
    });
  });
});

describe('成り駒の移動パターン', () => {
  describe('PROMOTED_MOVE_PATTERNS定義', () => {
    it('と金（成り歩）は金の動きパターンを持つ', () => {
      expect(PROMOTED_MOVE_PATTERNS['歩']).toEqual(MOVE_PATTERNS['金']);
    });

    it('成香は金の動きパターンを持つ', () => {
      expect(PROMOTED_MOVE_PATTERNS['香']).toEqual(MOVE_PATTERNS['金']);
    });

    it('成桂は金の動きパターンを持つ', () => {
      expect(PROMOTED_MOVE_PATTERNS['桂']).toEqual(MOVE_PATTERNS['金']);
    });

    it('成銀は金の動きパターンを持つ', () => {
      expect(PROMOTED_MOVE_PATTERNS['銀']).toEqual(MOVE_PATTERNS['金']);
    });

    it('竜は飛車の直線移動+斜め移動のパターンを持つ', () => {
      const dragonPattern = PROMOTED_MOVE_PATTERNS['飛'];
      // 飛車の直線移動（4方向）
      expect(dragonPattern.vectors).toContainEqual({ dFile: 0, dRank: 1 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: 0, dRank: -1 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: 1, dRank: 0 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: -1, dRank: 0 });
      // 斜め（4方向）
      expect(dragonPattern.vectors).toContainEqual({ dFile: 1, dRank: 1 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: -1, dRank: 1 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: 1, dRank: -1 });
      expect(dragonPattern.vectors).toContainEqual({ dFile: -1, dRank: -1 });
      // 8方向すべて
      expect(dragonPattern.vectors).toHaveLength(8);
    });

    it('馬は角の斜め移動+縦横移動のパターンを持つ', () => {
      const horsePattern = PROMOTED_MOVE_PATTERNS['角'];
      // 角の斜め移動（4方向）
      expect(horsePattern.vectors).toContainEqual({ dFile: 1, dRank: 1 });
      expect(horsePattern.vectors).toContainEqual({ dFile: -1, dRank: 1 });
      expect(horsePattern.vectors).toContainEqual({ dFile: 1, dRank: -1 });
      expect(horsePattern.vectors).toContainEqual({ dFile: -1, dRank: -1 });
      // 縦横（4方向）
      expect(horsePattern.vectors).toContainEqual({ dFile: 0, dRank: 1 });
      expect(horsePattern.vectors).toContainEqual({ dFile: 0, dRank: -1 });
      expect(horsePattern.vectors).toContainEqual({ dFile: 1, dRank: 0 });
      expect(horsePattern.vectors).toContainEqual({ dFile: -1, dRank: 0 });
      // 8方向すべて
      expect(horsePattern.vectors).toHaveLength(8);
    });
  });

  describe('成った歩（と金）の移動', () => {
    it('と金は金と同じ6方向に移動できる（先手）', () => {
      const tokin: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [tokin];
      const validMoves = calculateValidMoves(tokin, position, board);

      // 金の動き: 前、斜め前2方向、横2方向、後ろ1方向
      expect(validMoves).toContainEqual({ file: 5, rank: 6 }); // 前
      expect(validMoves).toContainEqual({ file: 4, rank: 6 }); // 右斜め前
      expect(validMoves).toContainEqual({ file: 6, rank: 6 }); // 左斜め前
      expect(validMoves).toContainEqual({ file: 4, rank: 5 }); // 右
      expect(validMoves).toContainEqual({ file: 6, rank: 5 }); // 左
      expect(validMoves).toContainEqual({ file: 5, rank: 4 }); // 後ろ
      // 斜め後ろは不可
      expect(validMoves).not.toContainEqual({ file: 4, rank: 4 });
      expect(validMoves).not.toContainEqual({ file: 6, rank: 4 });

      expect(validMoves).toHaveLength(6);
    });

    it('と金は金と同じ6方向に移動できる（後手）', () => {
      const tokin: Piece = {
        type: '歩',
        player: 'gote',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [tokin];
      const validMoves = calculateValidMoves(tokin, position, board);

      // 後手の前は-1方向
      expect(validMoves).toContainEqual({ file: 5, rank: 4 }); // 前
      expect(validMoves).toContainEqual({ file: 4, rank: 4 }); // 右斜め前
      expect(validMoves).toContainEqual({ file: 6, rank: 4 }); // 左斜め前
      expect(validMoves).toContainEqual({ file: 4, rank: 5 }); // 右
      expect(validMoves).toContainEqual({ file: 6, rank: 5 }); // 左
      expect(validMoves).toContainEqual({ file: 5, rank: 6 }); // 後ろ

      expect(validMoves).toHaveLength(6);
    });
  });

  describe('成った香車（成香）の移動', () => {
    it('成香は金と同じ6方向に移動できる', () => {
      const narikyou: Piece = {
        type: '香',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [narikyou];
      const validMoves = calculateValidMoves(narikyou, position, board);

      expect(validMoves).toHaveLength(6);
    });
  });

  describe('成った桂馬（成桂）の移動', () => {
    it('成桂は金と同じ6方向に移動できる', () => {
      const narikei: Piece = {
        type: '桂',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [narikei];
      const validMoves = calculateValidMoves(narikei, position, board);

      expect(validMoves).toHaveLength(6);
    });
  });

  describe('成った銀（成銀）の移動', () => {
    it('成銀は金と同じ6方向に移動できる', () => {
      const narigin: Piece = {
        type: '銀',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [narigin];
      const validMoves = calculateValidMoves(narigin, position, board);

      expect(validMoves).toHaveLength(6);
    });
  });

  describe('竜（成り飛車）の移動', () => {
    it('竜は飛車の直線移動に加えて斜め1マスに移動できる', () => {
      const ryu: Piece = {
        type: '飛',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [ryu];
      const validMoves = calculateValidMoves(ryu, position, board);

      // 飛車の直線移動
      // 前方向 (rank 6-9)
      expect(validMoves).toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).toContainEqual({ file: 5, rank: 9 });
      // 後ろ方向 (rank 1-4)
      expect(validMoves).toContainEqual({ file: 5, rank: 4 });
      expect(validMoves).toContainEqual({ file: 5, rank: 1 });
      // 右方向 (file 1-4)
      expect(validMoves).toContainEqual({ file: 4, rank: 5 });
      expect(validMoves).toContainEqual({ file: 1, rank: 5 });
      // 左方向 (file 6-9)
      expect(validMoves).toContainEqual({ file: 6, rank: 5 });
      expect(validMoves).toContainEqual({ file: 9, rank: 5 });

      // 斜め1マス
      expect(validMoves).toContainEqual({ file: 4, rank: 6 }); // 右斜め前
      expect(validMoves).toContainEqual({ file: 6, rank: 6 }); // 左斜め前
      expect(validMoves).toContainEqual({ file: 4, rank: 4 }); // 右斜め後ろ
      expect(validMoves).toContainEqual({ file: 6, rank: 4 }); // 左斜め後ろ

      // 斜め2マス以上は不可
      expect(validMoves).not.toContainEqual({ file: 3, rank: 7 });
      expect(validMoves).not.toContainEqual({ file: 7, rank: 7 });
    });

    it('竜の直線移動は駒にブロックされる', () => {
      const ryu: Piece = {
        type: '飛',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const blocker: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 7,
        promoted: false,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [ryu, blocker];
      const validMoves = calculateValidMoves(ryu, position, board);

      // rank 7に味方駒があるため、rank 7以降は移動不可
      expect(validMoves).toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 7 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 8 });
    });
  });

  describe('馬（成り角）の移動', () => {
    it('馬は角の斜め移動に加えて縦横1マスに移動できる', () => {
      const uma: Piece = {
        type: '角',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [uma];
      const validMoves = calculateValidMoves(uma, position, board);

      // 角の斜め移動
      // 右斜め前方向
      expect(validMoves).toContainEqual({ file: 4, rank: 6 });
      expect(validMoves).toContainEqual({ file: 1, rank: 9 });
      // 左斜め前方向
      expect(validMoves).toContainEqual({ file: 6, rank: 6 });
      expect(validMoves).toContainEqual({ file: 9, rank: 9 });
      // 右斜め後ろ方向
      expect(validMoves).toContainEqual({ file: 4, rank: 4 });
      expect(validMoves).toContainEqual({ file: 1, rank: 1 });
      // 左斜め後ろ方向
      expect(validMoves).toContainEqual({ file: 6, rank: 4 });
      expect(validMoves).toContainEqual({ file: 9, rank: 1 });

      // 縦横1マス
      expect(validMoves).toContainEqual({ file: 5, rank: 6 }); // 前
      expect(validMoves).toContainEqual({ file: 5, rank: 4 }); // 後ろ
      expect(validMoves).toContainEqual({ file: 4, rank: 5 }); // 右
      expect(validMoves).toContainEqual({ file: 6, rank: 5 }); // 左

      // 縦横2マス以上は不可
      expect(validMoves).not.toContainEqual({ file: 5, rank: 7 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 3 });
      expect(validMoves).not.toContainEqual({ file: 3, rank: 5 });
      expect(validMoves).not.toContainEqual({ file: 7, rank: 5 });
    });

    it('馬の斜め移動は駒にブロックされる', () => {
      const uma: Piece = {
        type: '角',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: true,
      };
      const blocker: Piece = {
        type: '歩',
        player: 'sente',
        file: 3,
        rank: 7,
        promoted: false,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [uma, blocker];
      const validMoves = calculateValidMoves(uma, position, board);

      // 右斜め前に味方駒があるため、それ以降は移動不可
      expect(validMoves).toContainEqual({ file: 4, rank: 6 });
      expect(validMoves).not.toContainEqual({ file: 3, rank: 7 });
      expect(validMoves).not.toContainEqual({ file: 2, rank: 8 });
    });
  });

  describe('成っていない駒の確認', () => {
    it('成っていない歩は1マス前のみ移動できる', () => {
      const fu: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: false,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [fu];
      const validMoves = calculateValidMoves(fu, position, board);

      expect(validMoves).toHaveLength(1);
      expect(validMoves).toContainEqual({ file: 5, rank: 6 });
    });

    it('成っていない飛車は斜めに移動できない', () => {
      const hisha: Piece = {
        type: '飛',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: false,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [hisha];
      const validMoves = calculateValidMoves(hisha, position, board);

      // 斜め移動は不可
      expect(validMoves).not.toContainEqual({ file: 4, rank: 6 });
      expect(validMoves).not.toContainEqual({ file: 6, rank: 6 });
      expect(validMoves).not.toContainEqual({ file: 4, rank: 4 });
      expect(validMoves).not.toContainEqual({ file: 6, rank: 4 });
    });

    it('成っていない角は縦横に移動できない', () => {
      const kaku: Piece = {
        type: '角',
        player: 'sente',
        file: 5,
        rank: 5,
        promoted: false,
      };
      const position: Position = { file: 5, rank: 5 };
      const board: Piece[] = [kaku];
      const validMoves = calculateValidMoves(kaku, position, board);

      // 縦横移動は不可
      expect(validMoves).not.toContainEqual({ file: 5, rank: 6 });
      expect(validMoves).not.toContainEqual({ file: 5, rank: 4 });
      expect(validMoves).not.toContainEqual({ file: 4, rank: 5 });
      expect(validMoves).not.toContainEqual({ file: 6, rank: 5 });
    });
  });
});
