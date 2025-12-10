/**
 * 検証エラーコード
 */
export type ValidationErrorCode =
  | 'DOUBLE_PAWN' // 二歩
  | 'OUT_OF_BOARD' // 盤面外
  | 'SQUARE_OCCUPIED'; // マスが既に占有されている

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
