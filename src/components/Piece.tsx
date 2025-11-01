import type { Piece as PieceType } from '../types/piece';

interface PieceProps {
  piece: PieceType;
}

/**
 * 駒を表示するコンポーネント
 */
const Piece = ({ piece }: PieceProps) => {
  const playerLabel = piece.player === 'sente' ? '先手' : '後手';

  return (
    <div
      aria-label={`${playerLabel}の${piece.type}`}
      style={{
        color: '#8B4513',
        fontSize: '2rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        transform: piece.player === 'gote' ? 'rotate(180deg)' : 'none',
      }}
    >
      {piece.type}
    </div>
  );
};

export default Piece;
