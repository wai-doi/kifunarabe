import type { Piece, PieceType, Player } from '../types/piece';
import type { Position } from '../types/position';

/**
 * 成れない駒種のセット
 */
const NON_PROMOTABLE_TYPES: Set<PieceType> = new Set(['金', '王', '玉']);

/**
 * 指定された段がプレイヤーにとって敵陣かどうかを判定する
 * @param rank 段 (1-9)
 * @param player プレイヤー
 * @returns 敵陣の場合true
 */
export function isInEnemyTerritory(rank: number, player: Player): boolean {
  // 先手の敵陣: 7〜9段目
  // 後手の敵陣: 1〜3段目
  return player === 'sente' ? rank >= 7 : rank <= 3;
}

/**
 * 指定された駒種が成れる駒種かどうかを判定する
 * @param type 駒種
 * @returns 成れる駒種の場合true
 */
export function isPromotablePieceType(type: PieceType): boolean {
  return !NON_PROMOTABLE_TYPES.has(type);
}

/**
 * 移動によって成りを選択できるかどうかを判定する
 * 条件:
 * 1. 駒が成れる種類である（金、王、玉以外）
 * 2. 駒がまだ成っていない
 * 3. 移動元または移動先のいずれかが敵陣である
 *
 * @param piece 移動する駒
 * @param from 移動元の位置
 * @param to 移動先の位置
 * @returns 成りを選択できる場合true
 */
export function canPromoteMove(piece: Piece, from: Position, to: Position): boolean {
  // 成れない駒種は成れない
  if (!isPromotablePieceType(piece.type)) {
    return false;
  }

  // 既に成っている駒は成れない
  if (piece.promoted) {
    return false;
  }

  // 移動元または移動先のいずれかが敵陣であれば成れる
  const fromInEnemy = isInEnemyTerritory(from.rank, piece.player);
  const toInEnemy = isInEnemyTerritory(to.rank, piece.player);

  return fromInEnemy || toInEnemy;
}

/**
 * 移動後に強制的に成らなければならないかどうかを判定する
 * 行き場所がなくなる駒は強制的に成る:
 * - 歩・香: 最奥段（先手は9段目、後手は1段目）
 * - 桂馬: 最奥2段（先手は8-9段目、後手は1-2段目）
 *
 * @param piece 移動する駒
 * @param toRank 移動先の段
 * @returns 強制的に成らなければならない場合true
 */
export function mustPromote(piece: Piece, toRank: number): boolean {
  // 既に成っている駒は考慮不要
  if (piece.promoted) {
    return false;
  }

  const isSente = piece.player === 'sente';
  const lastRank = isSente ? 9 : 1;
  const secondLastRank = isSente ? 8 : 2;

  // 歩・香は最奥段で強制成り
  if (piece.type === '歩' || piece.type === '香') {
    return toRank === lastRank;
  }

  // 桂馬は最奥2段で強制成り
  if (piece.type === '桂') {
    return isSente ? toRank >= secondLastRank : toRank <= secondLastRank;
  }

  return false;
}
