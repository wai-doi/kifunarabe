import type { SquareProps } from '../types/board';
import Piece from './Piece';

/**
 * 将棋盤の1マス目を表すコンポーネント
 */
const Square = ({ position, piece, isSelected, onClick }: SquareProps) => {
  // T031: アクセシビリティ向上 - 日本語の座標表現
  const ariaLabel = `${position.file}筋${position.rank}段${
    piece ? ` ${piece.player === 'sente' ? '先手' : '後手'}の${piece.type}` : ''
  }${isSelected ? ' 選択中' : ''}`;

  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      tabIndex={0}
      className="border border-gray-800 aspect-square flex items-center justify-center relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {piece && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
};

export default Square;
