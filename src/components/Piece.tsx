import type { Piece as PieceType } from '../types/piece';

interface PieceProps {
  piece: PieceType;
  isSelected?: boolean;
}

/**
 * 駒を表示するコンポーネント
 */
const Piece = ({ piece, isSelected = false }: PieceProps) => {
  const playerLabel = piece.player === 'sente' ? '先手' : '後手';

  // 選択状態に応じたスタイルクラス
  const baseClass = 'flex items-center justify-center w-full h-full';
  const bgClass = isSelected ? 'bg-yellow-200' : 'bg-amber-100';
  const ringClass = isSelected ? 'ring-4 ring-yellow-500' : '';

  return (
    <div
      aria-label={`${playerLabel}の${piece.type}`}
      className={`${baseClass} ${bgClass} ${ringClass}`}
      style={{
        color: '#8B4513',
        fontSize: '2rem',
        fontWeight: 'bold',
        transform: piece.player === 'gote' ? 'rotate(180deg)' : 'none',
      }}
    >
      {piece.type}
    </div>
  );
};

export default Piece;
