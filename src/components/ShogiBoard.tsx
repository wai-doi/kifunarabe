import Board from './Board';
import { INITIAL_POSITION } from '../data/initialPosition';

/**
 * 将棋盤と駒を統合して表示するコンポーネント
 */
const ShogiBoard = () => {
  return <Board pieces={INITIAL_POSITION} />;
};

export default ShogiBoard;
