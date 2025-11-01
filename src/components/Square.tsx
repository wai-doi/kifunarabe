import type { SquareProps } from '../types/board';
import Piece from './Piece';

/**
 * 将棋盤の1マス目を表すコンポーネント
 */
const Square = ({ position, piece }: SquareProps) => {
  return (
    <div
      role="gridcell"
      aria-label={`${position.file}-${position.rank}`}
      className="border border-gray-800 aspect-square flex items-center justify-center relative"
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;
