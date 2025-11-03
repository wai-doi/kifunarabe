import { useState } from 'react';
import Board from './Board';
import TurnDisplay from './TurnDisplay';
import { INITIAL_POSITION } from '../data/initialPosition';
import type { Position } from '../types/position';
import type { Piece } from '../types/piece';
import type { Turn } from '../types/turn';
import { isValidMove } from '../logic/moveRules';
import { updateBoardAfterMove } from '../logic/boardState';
import { switchTurn } from '../logic/turnControl';

/**
 * 将棋盤と駒を統合して表示するコンポーネント
 */
const ShogiBoard = () => {
  // 盤面の状態管理
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_POSITION);
  // 選択中の駒の位置
  const [selected, setSelected] = useState<Position | null>(null);
  // 現在のターン
  const [currentTurn, setCurrentTurn] = useState<Turn>('sente');
  // T032: 無効操作時のisHighlightedフラグ管理
  const [isHighlighted, setIsHighlighted] = useState(false);

  /**
   * マス目がクリックされた時のハンドラー
   */
  const handleSquareClick = (position: Position) => {
    // クリックされた位置に駒があるか確認
    const clickedPiece = pieces.find((p) => p.file === position.file && p.rank === position.rank);

    if (clickedPiece) {
      // 駒がある場合
      if (selected && selected.file === position.file && selected.rank === position.rank) {
        // 同じ駒をクリック → 選択解除
        setSelected(null);
      } else {
        // 別の駒をクリック → 選択を切り替え
        setSelected(position);
      }
    } else {
      // 駒がない場合
      if (selected) {
        // T022: 選択中の駒を移動 (ルール検証あり)
        const selectedPiece = pieces.find(
          (p) => p.file === selected.file && p.rank === selected.rank
        );

        if (selectedPiece && isValidMove(selected, position, selectedPiece, pieces)) {
          // T029: updateBoardAfterMoveを使用してイミュータブルに更新
          const movedPieces = updateBoardAfterMove(pieces, selected, position);
          setPieces(movedPieces);
          setSelected(null); // 移動後に選択解除

          // T020: 駒移動成功後にターンを切り替える
          setCurrentTurn(switchTurn(currentTurn));
        }
        // 移動不可能な場合は何もしない(選択状態を維持)
      }
    }
  };

  // T032: Board から無効操作の通知を受け取るコールバック
  const handleInvalidSelection = () => {
    setIsHighlighted(true);

    // フィードバックを短時間表示して自動的に消す
    setTimeout(() => {
      setIsHighlighted(false);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full p-4">
      {/* T031: ターン表示を盤面上部に配置 */}
      <TurnDisplay currentTurn={currentTurn} isHighlighted={isHighlighted} />

      <div className="flex justify-center items-center flex-1 w-full">
        <Board
          pieces={pieces}
          selected={selected}
          onSquareClick={handleSquareClick}
          currentTurn={currentTurn}
          onInvalidSelection={handleInvalidSelection}
        />
      </div>
    </div>
  );
};

export default ShogiBoard;
