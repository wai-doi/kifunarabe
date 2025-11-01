/**
 * 駒の移動パターンを定義する型
 */

/**
 * 移動方向を表すベクトル
 * - dFile: 筋の変化量 (正: 左方向, 負: 右方向)
 * - dRank: 段の変化量 (正: 後手側, 負: 先手側)
 */
export type Vector = {
  dFile: number;
  dRank: number;
};

/**
 * 駒種ごとの移動パターン
 * - vectors: 移動可能な方向のベクトル配列
 * - range: 移動可能な距離 (1: 1マスのみ, Infinity: 盤面の端まで)
 */
export type MovePattern = {
  vectors: Vector[];
  range: number; // 1 または Infinity
};
