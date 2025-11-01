import type { Piece } from './piece';
import type { Position } from './position';

/**
 * 将棋盤の状態
 */
export interface BoardState {
  /** 盤上の駒の配列 */
  pieces: Piece[];
}

/**
 * Squareコンポーネントのプロパティ
 */
export interface SquareProps {
  /** マス目の位置 */
  position: Position;
  /** このマス目に配置される駒(オプション) */
  piece?: Piece;
}
