/**
 * 二歩検証ロジック
 *
 * 同じ筋に未成の歩が既に存在するかを判定し、二歩を防ぐための関数群
 */

import type { Piece, Player } from '../types/piece';
import type { Position } from '../types/position';
import type { ValidationResult, ValidationErrorCode } from '../types/validation';

/**
 * 指定された筋に、指定されたプレイヤーの未成の歩が存在するかを判定
 *
 * @param pieces - 盤面上の全ての駒
 * @param file - 筋（1-9）
 * @param player - プレイヤー（'sente' | 'gote'）
 * @returns 未成の歩が存在する場合true
 */
export function hasUnpromotedPawnInFile(pieces: Piece[], file: number, player: Player): boolean {
  return pieces.some(
    (piece) =>
      piece.type === '歩' && piece.player === player && piece.file === file && !piece.promoted
  );
}

/**
 * 駒を打つ位置が二歩になるかを検証
 *
 * @param pieces - 盤面上の全ての駒
 * @param position - 打とうとしている位置
 * @param pieceType - 駒の種類
 * @param player - プレイヤー
 * @returns 検証結果
 */
export function validateDoublePawn(
  pieces: Piece[],
  position: Position,
  pieceType: string,
  player: Player
): ValidationResult {
  // 歩以外の駒の場合は二歩チェックをスキップ
  if (pieceType !== '歩') {
    return { isValid: true };
  }

  // 同じ筋に未成の歩が存在するか確認
  const hasDoublePawn = hasUnpromotedPawnInFile(pieces, position.file, player);

  if (hasDoublePawn) {
    return {
      isValid: false,
      errorCode: 'DOUBLE_PAWN',
      errorMessage: getErrorMessage('DOUBLE_PAWN'),
    };
  }

  return { isValid: true };
}

/**
 * 歩を打てる有効なマスのリストを取得
 *
 * @param pieces - 盤面上の全ての駒
 * @param player - プレイヤー
 * @returns 打てる位置のリスト
 */
export function getValidPawnDropSquares(pieces: Piece[], player: Player): Position[] {
  const validSquares: Position[] = [];

  // 全てのマス（1-9筋、1-9段）を走査
  for (let file = 1; file <= 9; file++) {
    for (let rank = 1; rank <= 9; rank++) {
      const position: Position = { file, rank };

      // 駒が既に置かれているマスはスキップ
      const isOccupied = pieces.some(
        (piece) => piece.file === position.file && piece.rank === position.rank
      );
      if (isOccupied) {
        continue;
      }

      // 二歩チェック: この筋に未成の歩が既に存在する場合はスキップ
      const hasDoublePawn = hasUnpromotedPawnInFile(pieces, file, player);
      if (hasDoublePawn) {
        continue;
      }

      // 条件を満たすマスを追加
      validSquares.push(position);
    }
  }

  return validSquares;
}

/**
 * エラーコードから日本語のエラーメッセージを取得
 *
 * @param errorCode - エラーコード
 * @returns エラーメッセージ
 */
export function getErrorMessage(errorCode: ValidationErrorCode): string {
  // TODO: T014で実装
  switch (errorCode) {
    case 'DOUBLE_PAWN':
      return '二歩は反則です';
    case 'OUT_OF_BOARD':
      return '盤面外には打てません';
    case 'SQUARE_OCCUPIED':
      return '既に駒があるマスには打てません';
  }
}
