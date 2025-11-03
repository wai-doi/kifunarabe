import type { Piece } from '../types/piece';
import type { Position } from '../types/position';
import type { Turn } from '../types/turn';
import { canSelectPiece } from '../logic/turnControl';
import Square from './Square';

interface BoardProps {
  pieces: Piece[];
  selected: Position | null;
  onSquareClick: (position: Position) => void;
  currentTurn: Turn;
  onInvalidSelection?: () => void;
}

/**
 * 9×9の将棋盤を表示するコンポーネント
 */
const Board = ({
  pieces,
  selected,
  onSquareClick,
  currentTurn,
  onInvalidSelection,
}: BoardProps) => {
  // T013: ターン検証を含むクリックハンドラー
  const handleSquareClick = (position: Position) => {
    const clickedPiece = pieces.find((p) => p.file === position.file && p.rank === position.rank);

    // 駒がクリックされた場合、ターン検証を実行
    if (clickedPiece) {
      if (!canSelectPiece(currentTurn, clickedPiece.player)) {
        // 無効な選択 - 親コンポーネントに通知
        onInvalidSelection?.();
        return; // 選択を拒否
      }
    }

    // 有効な選択 - 親コンポーネントのハンドラーを呼び出す
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

      squares.push(
        <Square
          key={`${file}-${rank}`}
          position={position}
          piece={piece}
          isSelected={isSelected}
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
