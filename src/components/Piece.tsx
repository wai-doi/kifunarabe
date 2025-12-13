import type { Piece as PieceType, PromotablePieceType } from '../types/piece';
import { PROMOTED_PIECE_DISPLAY } from '../types/piece';
import {
  BASE_SHADOW,
  BOARD_FONT_SIZE,
  PIECE_BASE_CLASS,
  PIECE_TEXT_CLASS,
  PROMOTED_TEXT_COLOR,
  PENTAGON_CLIP_PATH,
  SELECTED_SHADOW,
  SELECTED_WOOD_GRADIENT,
  TEXT_COLOR,
  WOOD_GRADIENT,
} from './pieceStyle';

interface PieceProps {
  piece: PieceType;
  isSelected?: boolean;
}

/**
 * 駒の表示テキストを取得する
 * 成り駒の場合は対応する成り駒文字を返す
 */
function getPieceDisplayText(piece: PieceType): string {
  if (piece.promoted && piece.type in PROMOTED_PIECE_DISPLAY) {
    return PROMOTED_PIECE_DISPLAY[piece.type as PromotablePieceType];
  }
  return piece.type;
}

/**
 * 駒を表示するコンポーネント
 */
const Piece = ({ piece, isSelected = false }: PieceProps) => {
  const displayText = getPieceDisplayText(piece);
  const playerLabel = piece.player === 'sente' ? '先手' : '後手';
  const promotedLabel = piece.promoted ? '成り' : '';

  const baseClass = 'flex items-center justify-center m-1.5';
  const textColor = piece.promoted ? PROMOTED_TEXT_COLOR : TEXT_COLOR;
  const background = isSelected ? SELECTED_WOOD_GRADIENT : WOOD_GRADIENT;
  const boxShadow = isSelected ? SELECTED_SHADOW : BASE_SHADOW;

  return (
    <div
      aria-label={`${playerLabel}の${promotedLabel}${piece.type}`}
      className={`${baseClass} ${PIECE_BASE_CLASS} ${isSelected ? 'shogi-piece-selected' : ''}`}
      style={{
        clipPath: PENTAGON_CLIP_PATH,
        background,
        boxShadow,
        color: textColor,
        fontSize: BOARD_FONT_SIZE,
        fontWeight: 'bold',
        transform: piece.player === 'gote' ? 'rotate(180deg)' : 'none',
        width: 'calc(100% - 0.75rem)',
        height: 'calc(100% - 0.75rem)',
      }}
      data-font-size={BOARD_FONT_SIZE}
    >
      <span
        className={PIECE_TEXT_CLASS}
        style={{ color: textColor, fontSize: BOARD_FONT_SIZE }}
        data-font-size={BOARD_FONT_SIZE}
      >
        {displayText}
      </span>
    </div>
  );
};

export default Piece;
