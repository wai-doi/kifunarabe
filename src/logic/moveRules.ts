/**
 * 駒の移動ルールを定義するモジュール
 */

import type { PieceType, Piece } from '../types/piece';
import type { MovePattern, Vector } from '../types/movePattern';
import type { Position } from '../types/position';
import { isValidPosition } from './boardState';

/**
 * 各駒種の移動パターン定義 (先手基準)
 *
 * 座標系:
 * - file: 1(右端) ～ 9(左端)
 * - rank: 1(先手側) ～ 9(後手側)
 *
 * ベクトル:
 * - dFile > 0: 左方向
 * - dFile < 0: 右方向
 * - dRank > 0: 後手側(前進)
 * - dRank < 0: 先手側(後退)
 */
export const MOVE_PATTERNS: Record<PieceType, MovePattern> = {
  // 歩: 前方1マス
  歩: {
    vectors: [{ dFile: 0, dRank: 1 }],
    range: 1,
  },

  // 香: 前方直進
  香: {
    vectors: [{ dFile: 0, dRank: 1 }],
    range: Infinity,
  },

  // 桂: 前方2マス+左右1マス (2箇所)
  桂: {
    vectors: [
      { dFile: -1, dRank: 2 },
      { dFile: 1, dRank: 2 },
    ],
    range: 1,
  },

  // 銀: 前方3方向+後方斜め2方向
  銀: {
    vectors: [
      { dFile: -1, dRank: 1 }, // 右前
      { dFile: 0, dRank: 1 },  // 前
      { dFile: 1, dRank: 1 },  // 左前
      { dFile: -1, dRank: -1 }, // 右後ろ
      { dFile: 1, dRank: -1 },  // 左後ろ
    ],
    range: 1,
  },

  // 金: 前方3方向+横2方向+真後ろ
  金: {
    vectors: [
      { dFile: -1, dRank: 1 }, // 右前
      { dFile: 0, dRank: 1 },  // 前
      { dFile: 1, dRank: 1 },  // 左前
      { dFile: -1, dRank: 0 }, // 右
      { dFile: 1, dRank: 0 },  // 左
      { dFile: 0, dRank: -1 }, // 後ろ
    ],
    range: 1,
  },

  // 飛: 縦横4方向直進
  飛: {
    vectors: [
      { dFile: 0, dRank: 1 },  // 前
      { dFile: 0, dRank: -1 }, // 後ろ
      { dFile: 1, dRank: 0 },  // 左
      { dFile: -1, dRank: 0 }, // 右
    ],
    range: Infinity,
  },

  // 角: 斜め4方向直進
  角: {
    vectors: [
      { dFile: 1, dRank: 1 },   // 左前
      { dFile: 1, dRank: -1 },  // 左後ろ
      { dFile: -1, dRank: 1 },  // 右前
      { dFile: -1, dRank: -1 }, // 右後ろ
    ],
    range: Infinity,
  },

  // 王/玉: 全方向1マス
  王: {
    vectors: [
      { dFile: -1, dRank: 1 },  // 右前
      { dFile: 0, dRank: 1 },   // 前
      { dFile: 1, dRank: 1 },   // 左前
      { dFile: -1, dRank: 0 },  // 右
      { dFile: 1, dRank: 0 },   // 左
      { dFile: -1, dRank: -1 }, // 右後ろ
      { dFile: 0, dRank: -1 },  // 後ろ
      { dFile: 1, dRank: -1 },  // 左後ろ
    ],
    range: 1,
  },

  // 玉: 王と同じ
  玉: {
    vectors: [
      { dFile: -1, dRank: 1 },
      { dFile: 0, dRank: 1 },
      { dFile: 1, dRank: 1 },
      { dFile: -1, dRank: 0 },
      { dFile: 1, dRank: 0 },
      { dFile: -1, dRank: -1 },
      { dFile: 0, dRank: -1 },
      { dFile: 1, dRank: -1 },
    ],
    range: 1,
  },
};

/**
 * 駒の所有者に応じて移動ベクトルを調整
 * @param piece - 駒
 * @param pattern - 移動パターン
 * @returns 調整された移動ベクトル配列
 */
export function getAdjustedVectors(piece: Piece, pattern: MovePattern): Vector[] {
  if (piece.player === 'sente') {
    // 先手: ベクトルをそのまま使用
    return pattern.vectors;
  } else {
    // 後手: ベクトルを反転
    // Note: -0を避けるため、0の場合は明示的に0を返す
    return pattern.vectors.map((v) => ({
      dFile: v.dFile === 0 ? 0 : -v.dFile,
      dRank: v.dRank === 0 ? 0 : -v.dRank,
    }));
  }
}

/**
 * T026: 移動経路上に障害物がないかチェック
 * @param from - 移動元の位置
 * @param to - 移動先の位置
 * @param board - 現在の盤面状態
 * @returns 経路上に駒がなければtrue
 */
export function isPathClear(from: Position, to: Position, board: Piece[]): boolean {
  const dFile = to.file - from.file;
  const dRank = to.rank - from.rank;

  // 1マス移動(歩、金、銀、王)または桂馬のジャンプは経路チェック不要
  if (Math.abs(dFile) <= 1 && Math.abs(dRank) <= 1) {
    return true;
  }

  // 桂馬のジャンプ(2マス前+1マス横)は経路チェック不要
  if (Math.abs(dFile) === 1 && Math.abs(dRank) === 2) {
    return true;
  }

  // 移動方向の単位ベクトルを計算
  const stepFile = dFile === 0 ? 0 : dFile > 0 ? 1 : -1;
  const stepRank = dRank === 0 ? 0 : dRank > 0 ? 1 : -1;

  // 移動元の次のマスから移動先の手前まで駒があるかチェック
  let currentFile = from.file + stepFile;
  let currentRank = from.rank + stepRank;

  while (currentFile !== to.file || currentRank !== to.rank) {
    // このマスに駒があるかチェック
    const pieceAtPosition = board.find(
      (p) => p.file === currentFile && p.rank === currentRank
    );

    if (pieceAtPosition) {
      return false; // 経路上に駒がある
    }

    currentFile += stepFile;
    currentRank += stepRank;
  }

  return true; // 経路上に駒がない
}

/**
 * 指定された駒の移動可能なマスを計算
 * @param piece - 移動する駒
 * @param position - 駒の現在位置
 * @param board - 現在の盤面状態
 * @returns 移動可能なマスの配列
 */
export function calculateValidMoves(
  piece: Piece,
  position: Position,
  board: Piece[]
): Position[] {
  const pattern = MOVE_PATTERNS[piece.type];
  const adjustedVectors = getAdjustedVectors(piece, pattern);
  const validMoves: Position[] = [];

  for (const vector of adjustedVectors) {
    // rangeに応じて移動可能なマスを探索
    for (let step = 1; step <= pattern.range; step++) {
      const targetFile = position.file + vector.dFile * step;
      const targetRank = position.rank + vector.dRank * step;
      const target: Position = {
        file: targetFile,
        rank: targetRank,
      };

      // 盤外チェック
      if (!isValidPosition(target)) {
        break; // この方向の探索を終了
      }

      // T027: 移動先に駒があるかチェック
      const pieceAtTarget = board.find(
        (p) => p.file === target.file && p.rank === target.rank
      );

      if (pieceAtTarget) {
        // 駒がある場合、この方向の探索を終了
        // (駒の取り合いは未実装のため、移動先に駒がある場合は移動不可)
        break;
      }

      validMoves.push(target);

      // range=1の場合は1マスのみ
      if (pattern.range === 1) {
        break;
      }
    }
  }

  return validMoves;
}

/**
 * 指定された移動が有効かどうかを判定
 * @param from - 移動元の位置
 * @param to - 移動先の位置
 * @param piece - 移動する駒
 * @param board - 現在の盤面状態
 * @returns 移動可能ならtrue
 */
export function isValidMove(
  from: Position,
  to: Position,
  piece: Piece,
  board: Piece[]
): boolean {
  // 移動先が盤内かチェック
  if (!isValidPosition(to)) {
    return false;
  }

  // 移動可能なマスの一覧を取得
  const validMoves = calculateValidMoves(piece, from, board);

  // toが移動可能なマスに含まれるかチェック
  return validMoves.some((move) => move.file === to.file && move.rank === to.rank);
}
