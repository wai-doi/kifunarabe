import { describe, it, expect } from 'vitest';
import {
  isInEnemyTerritory,
  isPromotablePieceType,
  canPromoteMove,
  mustPromote,
} from '../../src/logic/promotionLogic';
import type { Piece } from '../../src/types/piece';

describe('isInEnemyTerritory', () => {
  describe('先手の敵陣', () => {
    it('7段目は敵陣', () => {
      expect(isInEnemyTerritory(7, 'sente')).toBe(true);
    });

    it('8段目は敵陣', () => {
      expect(isInEnemyTerritory(8, 'sente')).toBe(true);
    });

    it('9段目は敵陣', () => {
      expect(isInEnemyTerritory(9, 'sente')).toBe(true);
    });

    it('6段目は敵陣ではない', () => {
      expect(isInEnemyTerritory(6, 'sente')).toBe(false);
    });

    it('1段目は敵陣ではない', () => {
      expect(isInEnemyTerritory(1, 'sente')).toBe(false);
    });
  });

  describe('後手の敵陣', () => {
    it('1段目は敵陣', () => {
      expect(isInEnemyTerritory(1, 'gote')).toBe(true);
    });

    it('2段目は敵陣', () => {
      expect(isInEnemyTerritory(2, 'gote')).toBe(true);
    });

    it('3段目は敵陣', () => {
      expect(isInEnemyTerritory(3, 'gote')).toBe(true);
    });

    it('4段目は敵陣ではない', () => {
      expect(isInEnemyTerritory(4, 'gote')).toBe(false);
    });

    it('9段目は敵陣ではない', () => {
      expect(isInEnemyTerritory(9, 'gote')).toBe(false);
    });
  });
});

describe('isPromotablePieceType', () => {
  it('歩は成れる', () => {
    expect(isPromotablePieceType('歩')).toBe(true);
  });

  it('香は成れる', () => {
    expect(isPromotablePieceType('香')).toBe(true);
  });

  it('桂は成れる', () => {
    expect(isPromotablePieceType('桂')).toBe(true);
  });

  it('銀は成れる', () => {
    expect(isPromotablePieceType('銀')).toBe(true);
  });

  it('飛は成れる', () => {
    expect(isPromotablePieceType('飛')).toBe(true);
  });

  it('角は成れる', () => {
    expect(isPromotablePieceType('角')).toBe(true);
  });

  it('金は成れない', () => {
    expect(isPromotablePieceType('金')).toBe(false);
  });

  it('王は成れない', () => {
    expect(isPromotablePieceType('王')).toBe(false);
  });

  it('玉は成れない', () => {
    expect(isPromotablePieceType('玉')).toBe(false);
  });
});

describe('canPromoteMove', () => {
  describe('敵陣に入る移動', () => {
    it('先手の歩が6段目から7段目に移動すると成れる', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 6, promoted: false };
      const from = { file: 5, rank: 6 };
      const to = { file: 5, rank: 7 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });

    it('後手の歩が4段目から3段目に移動すると成れる', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 4, promoted: false };
      const from = { file: 5, rank: 4 };
      const to = { file: 5, rank: 3 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });
  });

  describe('敵陣から出る移動', () => {
    it('先手の銀が7段目から6段目に移動すると成れる', () => {
      const piece: Piece = { type: '銀', player: 'sente', file: 5, rank: 7, promoted: false };
      const from = { file: 5, rank: 7 };
      const to = { file: 5, rank: 6 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });

    it('後手の飛車が3段目から4段目に移動すると成れる', () => {
      const piece: Piece = { type: '飛', player: 'gote', file: 2, rank: 3, promoted: false };
      const from = { file: 2, rank: 3 };
      const to = { file: 2, rank: 4 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });
  });

  describe('敵陣内での移動', () => {
    it('先手の歩が8段目から9段目に移動すると成れる', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 8, promoted: false };
      const from = { file: 5, rank: 8 };
      const to = { file: 5, rank: 9 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });

    it('先手の角が7段目から9段目に移動すると成れる', () => {
      const piece: Piece = { type: '角', player: 'sente', file: 2, rank: 7, promoted: false };
      const from = { file: 2, rank: 7 };
      const to = { file: 4, rank: 9 };
      expect(canPromoteMove(piece, from, to)).toBe(true);
    });
  });

  describe('敵陣外での移動', () => {
    it('先手の歩が3段目から4段目に移動しても成れない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 3, promoted: false };
      const from = { file: 5, rank: 3 };
      const to = { file: 5, rank: 4 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });

    it('後手の歩が7段目から6段目に移動しても成れない', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 7, promoted: false };
      const from = { file: 5, rank: 7 };
      const to = { file: 5, rank: 6 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });
  });

  describe('成れない駒', () => {
    it('金将は敵陣に入っても成れない', () => {
      const piece: Piece = { type: '金', player: 'sente', file: 5, rank: 6, promoted: false };
      const from = { file: 5, rank: 6 };
      const to = { file: 5, rank: 7 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });

    it('王将は敵陣に入っても成れない', () => {
      const piece: Piece = { type: '王', player: 'sente', file: 5, rank: 6, promoted: false };
      const from = { file: 5, rank: 6 };
      const to = { file: 5, rank: 7 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });

    it('玉将は敵陣に入っても成れない', () => {
      const piece: Piece = { type: '玉', player: 'gote', file: 5, rank: 4, promoted: false };
      const from = { file: 5, rank: 4 };
      const to = { file: 5, rank: 3 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });
  });

  describe('既に成っている駒', () => {
    it('成り駒は再度成れない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 8, promoted: true };
      const from = { file: 5, rank: 8 };
      const to = { file: 5, rank: 9 };
      expect(canPromoteMove(piece, from, to)).toBe(false);
    });
  });
});

describe('mustPromote', () => {
  describe('先手の強制成り', () => {
    it('歩が9段目に移動すると強制成り', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 8, promoted: false };
      expect(mustPromote(piece, 9)).toBe(true);
    });

    it('歩が8段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 7, promoted: false };
      expect(mustPromote(piece, 8)).toBe(false);
    });

    it('香が9段目に移動すると強制成り', () => {
      const piece: Piece = { type: '香', player: 'sente', file: 1, rank: 8, promoted: false };
      expect(mustPromote(piece, 9)).toBe(true);
    });

    it('香が8段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '香', player: 'sente', file: 1, rank: 7, promoted: false };
      expect(mustPromote(piece, 8)).toBe(false);
    });

    it('桂が9段目に移動すると強制成り', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 2, rank: 7, promoted: false };
      expect(mustPromote(piece, 9)).toBe(true);
    });

    it('桂が8段目に移動すると強制成り', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 2, rank: 6, promoted: false };
      expect(mustPromote(piece, 8)).toBe(true);
    });

    it('桂が7段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '桂', player: 'sente', file: 2, rank: 5, promoted: false };
      expect(mustPromote(piece, 7)).toBe(false);
    });
  });

  describe('後手の強制成り', () => {
    it('歩が1段目に移動すると強制成り', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 2, promoted: false };
      expect(mustPromote(piece, 1)).toBe(true);
    });

    it('歩が2段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '歩', player: 'gote', file: 5, rank: 3, promoted: false };
      expect(mustPromote(piece, 2)).toBe(false);
    });

    it('香が1段目に移動すると強制成り', () => {
      const piece: Piece = { type: '香', player: 'gote', file: 1, rank: 2, promoted: false };
      expect(mustPromote(piece, 1)).toBe(true);
    });

    it('桂が1段目に移動すると強制成り', () => {
      const piece: Piece = { type: '桂', player: 'gote', file: 2, rank: 3, promoted: false };
      expect(mustPromote(piece, 1)).toBe(true);
    });

    it('桂が2段目に移動すると強制成り', () => {
      const piece: Piece = { type: '桂', player: 'gote', file: 2, rank: 4, promoted: false };
      expect(mustPromote(piece, 2)).toBe(true);
    });

    it('桂が3段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '桂', player: 'gote', file: 2, rank: 5, promoted: false };
      expect(mustPromote(piece, 3)).toBe(false);
    });
  });

  describe('強制成りの対象外', () => {
    it('銀は9段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '銀', player: 'sente', file: 3, rank: 8, promoted: false };
      expect(mustPromote(piece, 9)).toBe(false);
    });

    it('飛車は9段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '飛', player: 'sente', file: 8, rank: 2, promoted: false };
      expect(mustPromote(piece, 9)).toBe(false);
    });

    it('角は9段目に移動しても強制成りではない', () => {
      const piece: Piece = { type: '角', player: 'sente', file: 2, rank: 2, promoted: false };
      expect(mustPromote(piece, 9)).toBe(false);
    });

    it('既に成っている歩は強制成りの対象外', () => {
      const piece: Piece = { type: '歩', player: 'sente', file: 5, rank: 8, promoted: true };
      expect(mustPromote(piece, 9)).toBe(false);
    });
  });
});
