import type { Piece } from '../types/piece';

/**
 * 将棋の初期配置
 * 40枚の駒を配置
 */
export const INITIAL_POSITION: Piece[] = [
  // 先手(sente)の駒
  // 1段目(最下段)
  { type: '香', player: 'sente', file: 1, rank: 1, promoted: false },
  { type: '桂', player: 'sente', file: 2, rank: 1, promoted: false },
  { type: '銀', player: 'sente', file: 3, rank: 1, promoted: false },
  { type: '金', player: 'sente', file: 4, rank: 1, promoted: false },
  { type: '王', player: 'sente', file: 5, rank: 1, promoted: false },
  { type: '金', player: 'sente', file: 6, rank: 1, promoted: false },
  { type: '銀', player: 'sente', file: 7, rank: 1, promoted: false },
  { type: '桂', player: 'sente', file: 8, rank: 1, promoted: false },
  { type: '香', player: 'sente', file: 9, rank: 1, promoted: false },
  // 2段目
  { type: '角', player: 'sente', file: 2, rank: 2, promoted: false },
  { type: '飛', player: 'sente', file: 8, rank: 2, promoted: false },
  // 3段目(歩兵)
  { type: '歩', player: 'sente', file: 1, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 2, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 3, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 4, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 5, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 6, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 7, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 8, rank: 3, promoted: false },
  { type: '歩', player: 'sente', file: 9, rank: 3, promoted: false },

  // 後手(gote)の駒
  // 9段目(最上段)
  { type: '香', player: 'gote', file: 1, rank: 9, promoted: false },
  { type: '桂', player: 'gote', file: 2, rank: 9, promoted: false },
  { type: '銀', player: 'gote', file: 3, rank: 9, promoted: false },
  { type: '金', player: 'gote', file: 4, rank: 9, promoted: false },
  { type: '玉', player: 'gote', file: 5, rank: 9, promoted: false },
  { type: '金', player: 'gote', file: 6, rank: 9, promoted: false },
  { type: '銀', player: 'gote', file: 7, rank: 9, promoted: false },
  { type: '桂', player: 'gote', file: 8, rank: 9, promoted: false },
  { type: '香', player: 'gote', file: 9, rank: 9, promoted: false },
  // 8段目
  { type: '飛', player: 'gote', file: 2, rank: 8, promoted: false },
  { type: '角', player: 'gote', file: 8, rank: 8, promoted: false },
  // 7段目(歩兵)
  { type: '歩', player: 'gote', file: 1, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 2, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 3, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 4, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 5, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 6, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 7, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 8, rank: 7, promoted: false },
  { type: '歩', player: 'gote', file: 9, rank: 7, promoted: false },
];
