import type { Position } from './position';
import type { PieceType, Player, Piece } from './piece';

/**
 * 盤面上の駒を選択した状態
 */
export interface BoardSelection {
  /** 選択の種類: 盤面上の駒 */
  type: 'board';
  /** 盤面上の位置 */
  position: Position;
  /** 選択した駒の所有者 */
  player: Player;
}

/**
 * 持ち駒を選択した状態
 */
export interface CapturedSelection {
  /** 選択の種類: 持ち駒 */
  type: 'captured';
  /** 持ち駒の駒種 */
  pieceType: PieceType;
  /** 選択した駒の所有者 */
  player: Player;
}

/**
 * 選択状態の共用型
 * - null: 何も選択されていない
 * - BoardSelection: 盤面上の駒を選択中
 * - CapturedSelection: 持ち駒を選択中
 */
export type Selection = BoardSelection | CapturedSelection;

/**
 * BoardSelection型かどうかを判定するタイプガード
 */
export function isBoardSelection(selection: Selection): selection is BoardSelection {
  return selection.type === 'board';
}

/**
 * CapturedSelection型かどうかを判定するタイプガード
 */
export function isCapturedSelection(selection: Selection): selection is CapturedSelection {
  return selection.type === 'captured';
}

/**
 * 成り選択の状態
 * 駒が成り条件を満たした移動を行った際に、成る/成らないを選択するために使用
 */
export interface PromotionChoice {
  /** 成り選択が必要な駒 */
  piece: Piece;
  /** 移動元の位置 */
  from: Position;
  /** 移動先の位置 */
  to: Position;
}

/**
 * 成り選択状態（nullの場合は選択中でない）
 */
export type PromotionState = PromotionChoice | null;
