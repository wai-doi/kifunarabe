/**
 * 駒の種類
 * '王': 先手の王
 * '玉': 後手の玉
 * '飛': 飛車
 * '角': 角行
 * '金': 金将
 * '銀': 銀将
 * '桂': 桂馬
 * '香': 香車
 * '歩': 歩兵
 */
export type PieceType = '王' | '玉' | '飛' | '角' | '金' | '銀' | '桂' | '香' | '歩';

/**
 * プレイヤー
 * 'sente': 先手 (下側、手前)
 * 'gote': 後手 (上側、奥)
 */
export type Player = 'sente' | 'gote';

/**
 * 駒の情報
 */
export interface Piece {
  /** 駒の種類 */
  type: PieceType;
  /** プレイヤー */
  player: Player;
  /** 筋 (1-9の数値、1が右端、9が左端) */
  file: number;
  /** 段 (1-9の数値、1が先手側、9が後手側) */
  rank: number;
}
