import type { Piece as PieceType, PromotablePieceType } from '../types/piece';
import { PROMOTED_PIECE_DISPLAY } from '../types/piece';

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

  // 選択状態に応じたスタイルクラス
  const baseClass = 'flex items-center justify-center w-full h-full';
  const bgClass = isSelected ? 'bg-yellow-200' : 'bg-amber-100';
  const ringClass = isSelected ? 'ring-4 ring-yellow-500' : '';

  // 成り駒は赤色で表示
  const textColor = piece.promoted ? '#CC0000' : '#8B4513';

  return (
    <div
      aria-label={`${playerLabel}の${promotedLabel}${piece.type}`}
      className={`${baseClass} ${bgClass} ${ringClass}`}
      style={{
        color: textColor,
        fontSize: '2rem',
        fontWeight: 'bold',
        transform: piece.player === 'gote' ? 'rotate(180deg)' : 'none',
      }}
    >
      {displayText}
    </div>
  );
};

export default Piece;
