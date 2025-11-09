/**
 * 盤面状態管理のヘルパー関数
 */

import type { Position } from '../types/position';
import type { Piece } from '../types/piece';
import type { GameState } from '../types/board';
import { INITIAL_POSITION } from '../data/initialPosition';
import { createEmptyCapturedPieces } from '../types/capturedPieces';

/**
 * 座標が盤面内の有効な位置かどうかを判定
 * @param pos - 判定する座標
 * @returns 有効な座標の場合true
 */
export function isValidPosition(pos: Position): boolean {
  return pos.file >= 1 && pos.file <= 9 && pos.rank >= 1 && pos.rank <= 9;
}

/**
 * 初期ゲーム状態を作成(ターン情報と持ち駒を含む)
 * @returns 初期ゲーム状態
 */
export function createInitialGameState(): GameState {
  return {
    pieces: INITIAL_POSITION,
    selectedSquare: null,
    currentTurn: 'sente',
    capturedPieces: createEmptyCapturedPieces(),
  };
}

/**
 * T029: 駒の移動後の盤面状態を生成(イミュータブル更新)
 * @param board - 現在の盤面状態
 * @param from - 移動元の位置
 * @param to - 移動先の位置
 * @returns 新しい盤面状態
 */
export function updateBoardAfterMove(board: Piece[], from: Position, to: Position): Piece[] {
  return board.map((piece) => {
    // 移動する駒を見つけて新しい位置に更新
    if (piece.file === from.file && piece.rank === from.rank) {
      return { ...piece, file: to.file, rank: to.rank };
    }
    return piece;
  });
}
