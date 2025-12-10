import type { Piece, PieceType, Player } from '../types/piece';
import type { Position } from '../types/position';
import { hasUnpromotedPawnInFile } from './doublePawnValidation';

/**
 * 位置が盤面内かどうかを判定する
 */
function isWithinBoard(position: Position): boolean {
  return position.file >= 1 && position.file <= 9 && position.rank >= 1 && position.rank <= 9;
}

/**
 * 指定位置に駒を打てるか判定する
 *
 * @param pieces - 盤面上の駒配列
 * @param position - 打ちたい位置
 * @param pieceType - 駒の種類（オプショナル、二歩チェックに必要）
 * @param player - プレイヤー（オプショナル、二歩チェックに必要）
 * @returns 打てる場合 true
 */
export function canDropPiece(
  pieces: Piece[],
  position: Position,
  pieceType?: PieceType,
  player?: Player
): boolean {
  // 盤面外の場合は打てない
  if (!isWithinBoard(position)) {
    return false;
  }

  // 指定位置に駒があるか確認
  const isOccupied = pieces.some(
    (piece) => piece.file === position.file && piece.rank === position.rank
  );

  if (isOccupied) {
    return false;
  }

  // 歩の二歩チェック（pieceTypeとplayerが指定されている場合のみ）
  if (pieceType === '歩' && player) {
    const hasDoublePawn = hasUnpromotedPawnInFile(pieces, position.file, player);
    if (hasDoublePawn) {
      return false;
    }
  }

  return true;
}

/**
 * 盤面に駒を打つ（イミュータブル）
 *
 * @param pieces - 盤面上の駒配列
 * @param position - 打つ位置
 * @param pieceType - 駒の種類
 * @param player - プレイヤー
 * @returns 駒が追加された新しい盤面
 */
export function dropPiece(
  pieces: Piece[],
  position: Position,
  pieceType: PieceType,
  player: Player
): Piece[] {
  const newPiece: Piece = {
    type: pieceType,
    player: player,
    file: position.file,
    rank: position.rank,
    promoted: false, // 打った駒は必ず成っていない状態
  };

  return [...pieces, newPiece];
}
