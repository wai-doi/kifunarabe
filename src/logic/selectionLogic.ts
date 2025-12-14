import type { Piece } from '../types/piece';
import type { Turn } from '../types/turn';

/**
 * 駒を選択可能かどうかを判定する
 * @param piece - 選択しようとしている駒（nullまたはundefinedの場合は空マス）
 * @param currentTurn - 現在の手番
 * @returns 選択可能な場合はtrue、それ以外はfalse
 */
export function canSelectPiece(piece: Piece | null | undefined, currentTurn: Turn): boolean {
  // 空マスは選択不可
  if (!piece) {
    return false;
  }

  // 現在の手番のプレイヤーの駒のみ選択可能
  return piece.player === currentTurn;
}
