import type { Piece } from '../types/piece';
import type { Position } from '../types/position';
import type { Turn } from '../types/turn';
import type { CapturedPieces } from '../types/capturedPieces';
import Square from './Square';

interface BoardProps {
  pieces: Piece[];
  selected: Position | null;
  onSquareClick: (position: Position) => void;
  currentTurn: Turn;
  capturedPieces: CapturedPieces;
  onInvalidSelection?: () => void;
  validDropSquares?: Position[];
}

/**
 * 9×9の将棋盤を表示するコンポーネント
 */
const Board = ({ pieces, selected, onSquareClick, validDropSquares = [] }: BoardProps) => {
  // クリックハンドラー（選択ロジックは親コンポーネントで処理）
  const handleSquareClick = (position: Position) => {
    onSquareClick(position);
  };
  // 9×9のマス目を生成
  const squares = [];
  for (let rank = 9; rank >= 1; rank--) {
    for (let file = 1; file <= 9; file++) {
      const position = { file, rank };
      // この位置に駒があるか検索
      const piece = pieces.find((p) => p.file === file && p.rank === rank);
      // この位置が選択されているか
      const isSelected = selected !== null && selected.file === file && selected.rank === rank;
      // T026: この位置が打てる候補マスか
      const isValidDropSquare = validDropSquares.some(
        (pos) => pos.file === file && pos.rank === rank
      );

      squares.push(
        <Square
          key={`${file}-${rank}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
          isValidDropSquare={isValidDropSquare}
          onClick={() => handleSquareClick(position)}
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
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '1 / 1.087',
      }}
    >
      {squares}
    </div>
  );
};

export default Board;
