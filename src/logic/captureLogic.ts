import type { Piece, Player } from '../types/piece';
import type { Position } from '../types/position';
import type { CapturedPieces, CapturedPiecesMap } from '../types/capturedPieces';

/**
 * 指定された位置に相手の駒があるか判定し、あれば返す
 *
 * @param pieces - 盤面上の全ての駒
 * @param position - 確認する位置
 * @param currentPlayer - 現在のプレイヤー
 * @returns 相手の駒がある場合はその駒、ない場合はnull
 */
export function getTargetPiece(
  pieces: Piece[],
  position: Position,
  currentPlayer: Player
): Piece | null {
  // 位置の妥当性チェック
  if (position.file < 1 || position.file > 9 || position.rank < 1 || position.rank > 9) {
    return null;
  }

  // 指定された位置の駒を探す
  const targetPiece = pieces.find(
    (piece) => piece.file === position.file && piece.rank === position.rank
  );

  // 駒が見つからない場合
  if (!targetPiece) {
    return null;
  }

  // 自分の駒の場合
  if (targetPiece.player === currentPlayer) {
    return null;
  }

  // 相手の駒の場合
  return targetPiece;
}

/**
 * 取った駒を持ち駒に追加する(イミュータブル)
 *
 * @param capturedPieces - 現在の持ち駒
 * @param capturedPiece - 取った駒
 * @param capturingPlayer - 取ったプレイヤー
 * @returns 更新された持ち駒(新しいオブジェクト)
 */
export function addToCapturedPieces(
  capturedPieces: CapturedPieces,
  capturedPiece: Piece,
  capturingPlayer: Player
): CapturedPieces {
  const playerPieces = capturedPieces[capturingPlayer];
  const currentCount = playerPieces[capturedPiece.type] || 0;

  const updatedPlayerPieces: CapturedPiecesMap = {
    ...playerPieces,
    [capturedPiece.type]: currentCount + 1,
  };

  return {
    ...capturedPieces,
    [capturingPlayer]: updatedPlayerPieces,
  };
}

/**
 * 盤面から指定された駒を削除する(イミュータブル)
 *
 * @param pieces - 盤面上の全ての駒
 * @param pieceToRemove - 削除する駒
 * @returns 駒が削除された新しい盤面(新しい配列)
 */
export function removePieceFromBoard(pieces: Piece[], pieceToRemove: Piece): Piece[] {
  return pieces.filter(
    (piece) =>
      !(
        piece.file === pieceToRemove.file &&
        piece.rank === pieceToRemove.rank &&
        piece.type === pieceToRemove.type &&
        piece.player === pieceToRemove.player
      )
  );
}
