import type { Piece } from './piece';
import type { Position } from './position';
import type { Turn } from './turn';
import type { CapturedPieces } from './capturedPieces';

/**
 * 将棋盤の状態
 */
export interface BoardState {
  /** 盤上の駒の配列 */
  pieces: Piece[];
}

/**
 * ゲーム全体の状態
 */
export interface GameState {
  /** 盤上の駒の配列 */
  pieces: Piece[];
  /** 選択中のマスの位置 */
  selectedSquare: Position | null;
  /** 現在のターン */
  currentTurn: Turn;
  /** 持ち駒(先手・後手それぞれ) */
  capturedPieces: CapturedPieces;
}

/**
 * Squareコンポーネントのプロパティ
 */
export interface SquareProps {
  /** マス目の位置 */
  position: Position;
  /** このマス目に配置される駒(オプション) */
  piece?: Piece;
  /** このマス目が選択されているか */
  isSelected?: boolean;
  /** クリックハンドラー */
  onClick?: () => void;
}
