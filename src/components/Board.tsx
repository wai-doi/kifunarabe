import type { Piece } from '../types/piece';
import Square from './Square';

interface BoardProps {
  pieces: Piece[];
}

/**
 * 9×9の将棋盤を表示するコンポーネント
 */
const Board = ({ pieces }: BoardProps) => {
  // 9×9のマス目を生成
  const squares = [];
  for (let rank = 9; rank >= 1; rank--) {
    for (let file = 1; file <= 9; file++) {
      // この位置に駒があるか検索
      const piece = pieces.find(
        (p) => p.file === file && p.rank === rank
      );
      squares.push(
        <Square
          key={`${file}-${rank}`}
          position={{ file, rank }}
          piece={piece}
        />
      );
    }
  }

  return (
    <div
      role="grid"
      aria-label="将棋盤"
      className="grid grid-cols-9 gap-0"
      style={{
        backgroundColor: '#D4A574',
        width: 'min(70vmin, 100%)',
        height: 'min(70vmin, 100%)',
        minWidth: '300px',
        minHeight: '300px',
        aspectRatio: '1 / 1',
      }}
    >
      {squares}
    </div>
  );
};

export default Board;
