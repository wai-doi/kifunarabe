import type { SquareProps } from '../types/board';
import Piece from './Piece';

/**
 * 将棋盤の1マス目を表すコンポーネント
 */
const Square = ({
  position,
  piece,
  isSelected,
  isValidDropSquare = false,
  onClick,
}: SquareProps) => {
  // T031: アクセシビリティ向上 - 日本語の座標表現
  const ariaLabel = `${position.file}筋${position.rank}段${
    piece ? ` ${piece.player === 'sente' ? '先手' : '後手'}の${piece.type}` : ''
  }${isSelected ? ' 選択中' : ''}${isValidDropSquare ? ' 打てる候補' : ''}`;

  return (
    <div
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      style={{ aspectRatio: '0.92' }}
      className={`border border-gray-800 ${
        isSelected ? 'outline-[3px] outline-amber-700 -outline-offset-[3px]' : ''
      } flex items-center justify-center relative cursor-pointer ${
        isValidDropSquare ? 'bg-green-100' : ''
      }`}
      onClick={onClick}
    >
      {piece && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
};

export default Square;
