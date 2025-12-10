/**
 * 二歩禁止ルールの契約仕様
 * 
 * このファイルは、二歩検証ロジックの関数シグネチャと契約を定義します。
 * 実装前にインターフェースを確定し、テスト駆動開発を可能にします。
 */

import type { Piece, PieceType, Player } from '../../../src/types/piece';
import type { Position } from '../../../src/types/position';

/**
 * 検証エラーコード
 */
export type ValidationErrorCode = 
  | 'DOUBLE_PAWN'          // 二歩
  | 'OUT_OF_BOARD'         // 盤面外
  | 'SQUARE_OCCUPIED';     // マスが既に占有されている

/**
 * 検証結果
 */
export interface ValidationResult {
  /** 検証が成功したか（trueなら打てる、falseなら打てない） */
  isValid: boolean;
  
  /** 検証失敗時のエラーコード（成功時はundefined） */
  errorCode?: ValidationErrorCode;
  
  /** エラーメッセージ（成功時はundefined） */
  errorMessage?: string;
}

/**
 * 指定された筋に未成の歩が存在するかチェックする
 * 
 * @param pieces - 盤面上の全ての駒
 * @param file - チェックする筋（1-9）
 * @param player - チェックするプレイヤー
 * @returns 未成の歩が存在する場合はtrue
 * 
 * @example
 * ```typescript
 * const pieces = [
 *   { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
 *   { type: '歩', player: 'sente', file: 5, rank: 6, promoted: true }  // 成り駒
 * ];
 * 
 * hasUnpromotedPawnInFile(pieces, 3, 'sente'); // true (3筋に歩がある)
 * hasUnpromotedPawnInFile(pieces, 5, 'sente'); // false (5筋の歩は成っている)
 * hasUnpromotedPawnInFile(pieces, 7, 'sente'); // false (7筋に歩はない)
 * ```
 */
export function hasUnpromotedPawnInFile(
  pieces: Piece[],
  file: number,
  player: Player
): boolean;

/**
 * 二歩にならないか検証する
 * 
 * @param pieces - 盤面上の全ての駒
 * @param position - 打とうとしている位置
 * @param pieceType - 打とうとしている駒の種類
 * @param player - 打とうとしているプレイヤー
 * @returns 検証結果（打てる場合isValid=true、二歩の場合isValid=false）
 * 
 * @example
 * ```typescript
 * const pieces = [
 *   { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }
 * ];
 * 
 * // 3筋には既に歩があるので二歩
 * validateDoublePawn(pieces, { file: 3, rank: 5 }, '歩', 'sente');
 * // => { isValid: false, errorCode: 'DOUBLE_PAWN', errorMessage: '二歩は反則です' }
 * 
 * // 4筋には歩がないのでOK
 * validateDoublePawn(pieces, { file: 4, rank: 5 }, '歩', 'sente');
 * // => { isValid: true }
 * 
 * // 角を打つ場合は二歩チェック不要
 * validateDoublePawn(pieces, { file: 3, rank: 5 }, '角', 'sente');
 * // => { isValid: true }
 * ```
 */
export function validateDoublePawn(
  pieces: Piece[],
  position: Position,
  pieceType: PieceType,
  player: Player
): ValidationResult;

/**
 * 駒を打てるかチェックする（拡張版）
 * 
 * 既存の`canDropPiece`関数を拡張し、二歩検証を含めた包括的なチェックを行います。
 * 
 * @param pieces - 盤面上の全ての駒
 * @param position - 打とうとしている位置
 * @param pieceType - 打とうとしている駒の種類（オプション、歩の場合は二歩チェックを実行）
 * @param player - 打とうとしているプレイヤー（オプション、歩の場合は必須）
 * @returns 打てる場合はtrue、打てない場合はfalse
 * 
 * @remarks
 * - pieceTypeとplayerが両方指定されている場合、二歩チェックを実行
 * - どちらかが指定されていない場合、既存の動作（位置と占有のみチェック）
 * - これにより既存コードとの後方互換性を維持
 * 
 * @example
 * ```typescript
 * const pieces = [
 *   { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false }
 * ];
 * 
 * // 既存の使い方（後方互換性）
 * canDropPiece(pieces, { file: 5, rank: 5 }); // true
 * 
 * // 新しい使い方（二歩チェック含む）
 * canDropPiece(pieces, { file: 3, rank: 5 }, '歩', 'sente'); // false (二歩)
 * canDropPiece(pieces, { file: 4, rank: 5 }, '歩', 'sente'); // true
 * ```
 */
export function canDropPiece(
  pieces: Piece[],
  position: Position,
  pieceType?: PieceType,
  player?: Player
): boolean;

/**
 * 指定プレイヤーの歩を打てる全てのマスを取得する
 * 
 * @param pieces - 盤面上の全ての駒
 * @param player - チェックするプレイヤー
 * @returns 歩を打てる位置の配列
 * 
 * @remarks
 * このヘルパー関数は、UIで歩を選択した際にハイライト表示するマスを
 * 効率的に計算するために使用されます。
 * 
 * @example
 * ```typescript
 * const pieces = [
 *   { type: '歩', player: 'sente', file: 1, rank: 7, promoted: false },
 *   { type: '歩', player: 'sente', file: 3, rank: 7, promoted: false },
 *   { type: '角', player: 'gote', file: 5, rank: 5, promoted: false }
 * ];
 * 
 * const validSquares = getValidPawnDropSquares(pieces, 'sente');
 * // 1筋と3筋以外の空きマスが返される
 * // 5筋も含まれる（相手の駒は影響しない、また角なので二歩ルール対象外）
 * ```
 */
export function getValidPawnDropSquares(
  pieces: Piece[],
  player: Player
): Position[];

/**
 * エラーコードに対応する日本語メッセージを取得する
 * 
 * @param errorCode - エラーコード
 * @returns 日本語のエラーメッセージ
 * 
 * @example
 * ```typescript
 * getErrorMessage('DOUBLE_PAWN'); // "二歩は反則です"
 * getErrorMessage('OUT_OF_BOARD'); // "盤面外には打てません"
 * getErrorMessage('SQUARE_OCCUPIED'); // "既に駒があるマスには打てません"
 * ```
 */
export function getErrorMessage(errorCode: ValidationErrorCode): string;
