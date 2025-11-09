import type { PieceType, Player } from './piece';

/**
 * 持ち駒のマップ構造
 * 駒の種類をキーとし、その数量を値とする
 *
 * 例:
 * {
 *   '歩': 3,
 *   '角': 1,
 *   '飛': 1
 * }
 *
 * バリデーションルール:
 * - 数量は0以上の整数
 * - 存在しない駒の種類はマップに含めない(undefinedまたはキーなし)
 * - 王/玉は持ち駒にならない(ゲーム終了条件)
 */
export type CapturedPiecesMap = Partial<Record<PieceType, number>>;

/**
 * 持ち駒の管理構造
 * 先手と後手それぞれの持ち駒を管理する
 */
export interface CapturedPieces {
  /** 先手(下側プレイヤー)の持ち駒 */
  sente: CapturedPiecesMap;
  /** 後手(上側プレイヤー)の持ち駒 */
  gote: CapturedPiecesMap;
}

/**
 * 空の持ち駒を作成する
 * @returns 初期状態の持ち駒(先手・後手とも空)
 */
export function createEmptyCapturedPieces(): CapturedPieces {
  return {
    sente: {},
    gote: {},
  };
}

/**
 * 特定のプレイヤーの持ち駒を取得する
 * @param capturedPieces - 持ち駒の管理構造
 * @param player - プレイヤー('sente' | 'gote')
 * @returns 指定されたプレイヤーの持ち駒マップ
 */
export function getCapturedPiecesForPlayer(
  capturedPieces: CapturedPieces,
  player: Player
): CapturedPiecesMap {
  return capturedPieces[player];
}
