import { useState } from 'react';
import Board from './Board';
import { INITIAL_POSITION } from '../data/initialPosition';
import type { Position } from '../types/position';
import type { Piece } from '../types/piece';
import { isValidMove } from '../logic/moveRules';
import { updateBoardAfterMove } from '../logic/boardState';

/**
 * 将棋盤と駒を統合して表示するコンポーネント
 */
const ShogiBoard = () => {
  // 盤面の状態管理
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_POSITION);
  // 選択中の駒の位置
  const [selected, setSelected] = useState<Position | null>(null);

  /**
   * マス目がクリックされた時のハンドラー
   */
  const handleSquareClick = (position: Position) => {
    // クリックされた位置に駒があるか確認
    const clickedPiece = pieces.find(
      (p) => p.file === position.file && p.rank === position.rank
    );

    if (clickedPiece) {
      // 駒がある場合
      if (
        selected &&
        selected.file === position.file &&
        selected.rank === position.rank
      ) {
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
        }
        // 移動不可能な場合は何もしない(選択状態を維持)
      }
    }
  };

  return <Board pieces={pieces} selected={selected} onSquareClick={handleSquareClick} />;
};

export default ShogiBoard;
