import type { Turn } from '../types/turn';
import type { Player } from '../types/piece';

/**
 * 現在のターンと駒の所有者が一致するかを検証
 * @param currentTurn - 現在のターン
 * @param piecePlayer - 選択された駒の所有者
 * @returns true: 有効, false: 無効
 */
export function canSelectPiece(currentTurn: Turn, piecePlayer: Player): boolean {
  return currentTurn === piecePlayer;
}

/**
 * ターンを切り替える
 * @param currentTurn - 現在のターン
 * @returns 次のターン ('sente' → 'gote' または 'gote' → 'sente')
 */
export function switchTurn(currentTurn: Turn): Turn {
  return currentTurn === 'sente' ? 'gote' : 'sente';
}

/**
 * ターンの表示名を取得
 * @param turn - ターン ('sente' | 'gote')
 * @returns 表示名 (例: "先手の番")
 */
export function getTurnDisplayName(turn: Turn): string {
  return turn === 'sente' ? '先手の番' : '後手の番';
}
