/**
 * 駒の移動ルールを定義するモジュール
 */

import type { PieceType, Piece, PromotablePieceType } from '../types/piece';
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
      { dFile: 0, dRank: 1 }, // 前
      { dFile: 1, dRank: 1 }, // 左前
      { dFile: -1, dRank: -1 }, // 右後ろ
      { dFile: 1, dRank: -1 }, // 左後ろ
    ],
    range: 1,
  },

  // 金: 前方3方向+横2方向+真後ろ
  金: {
    vectors: [
      { dFile: -1, dRank: 1 }, // 右前
      { dFile: 0, dRank: 1 }, // 前
      { dFile: 1, dRank: 1 }, // 左前
      { dFile: -1, dRank: 0 }, // 右
      { dFile: 1, dRank: 0 }, // 左
      { dFile: 0, dRank: -1 }, // 後ろ
    ],
    range: 1,
  },

  // 飛: 縦横4方向直進
  飛: {
    vectors: [
      { dFile: 0, dRank: 1 }, // 前
      { dFile: 0, dRank: -1 }, // 後ろ
      { dFile: 1, dRank: 0 }, // 左
      { dFile: -1, dRank: 0 }, // 右
    ],
    range: Infinity,
  },

  // 角: 斜め4方向直進
  角: {
    vectors: [
      { dFile: 1, dRank: 1 }, // 左前
      { dFile: 1, dRank: -1 }, // 左後ろ
      { dFile: -1, dRank: 1 }, // 右前
      { dFile: -1, dRank: -1 }, // 右後ろ
    ],
    range: Infinity,
  },

  // 王/玉: 全方向1マス
  王: {
    vectors: [
      { dFile: -1, dRank: 1 }, // 右前
      { dFile: 0, dRank: 1 }, // 前
      { dFile: 1, dRank: 1 }, // 左前
      { dFile: -1, dRank: 0 }, // 右
      { dFile: 1, dRank: 0 }, // 左
      { dFile: -1, dRank: -1 }, // 右後ろ
      { dFile: 0, dRank: -1 }, // 後ろ
      { dFile: 1, dRank: -1 }, // 左後ろ
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
 * 成り駒の移動パターン定義
 * - と金(歩)、杏(香)、圭(桂)、全(銀): 金と同じ動き
 * - 竜(飛車): 飛車の動き + 斜め1マス
 * - 馬(角): 角の動き + 縦横1マス
 */
export const PROMOTED_MOVE_PATTERNS: Record<PromotablePieceType, MovePattern> = {
  // と金: 金と同じ動き
  歩: MOVE_PATTERNS.金,

  // 成香: 金と同じ動き
  香: MOVE_PATTERNS.金,

  // 成桂: 金と同じ動き
  桂: MOVE_PATTERNS.金,

  // 成銀: 金と同じ動き
  銀: MOVE_PATTERNS.金,

  // 竜王: 飛車の動き + 斜め1マス
  飛: {
    vectors: [
      // 飛車の動き（縦横直進）
      { dFile: 0, dRank: 1 },
      { dFile: 0, dRank: -1 },
      { dFile: 1, dRank: 0 },
      { dFile: -1, dRank: 0 },
      // 追加: 斜め1マス
      { dFile: 1, dRank: 1 },
      { dFile: 1, dRank: -1 },
      { dFile: -1, dRank: 1 },
      { dFile: -1, dRank: -1 },
    ],
    // 複合range: 縦横は無限、斜めは1マス
    // これを実現するため、rangeは無限にして斜め方向の探索は別途処理
    range: Infinity,
  },

  // 龍馬: 角の動き + 縦横1マス
  角: {
    vectors: [
      // 角の動き（斜め直進）
      { dFile: 1, dRank: 1 },
      { dFile: 1, dRank: -1 },
      { dFile: -1, dRank: 1 },
      { dFile: -1, dRank: -1 },
      // 追加: 縦横1マス
      { dFile: 0, dRank: 1 },
      { dFile: 0, dRank: -1 },
      { dFile: 1, dRank: 0 },
      { dFile: -1, dRank: 0 },
    ],
    // 複合range: 斜めは無限、縦横は1マス
    range: Infinity,
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
    const pieceAtPosition = board.find((p) => p.file === currentFile && p.rank === currentRank);

    if (pieceAtPosition) {
      return false; // 経路上に駒がある
    }

    currentFile += stepFile;
    currentRank += stepRank;
  }

  return true; // 経路上に駒がない
}

/**
 * 駒の移動パターンを取得する
 * 成り駒の場合は成り駒用のパターンを返す
 * @param piece - 駒
 * @returns 移動パターン
 */
function getMovePattern(piece: Piece): MovePattern {
  if (piece.promoted && piece.type in PROMOTED_MOVE_PATTERNS) {
    return PROMOTED_MOVE_PATTERNS[piece.type as PromotablePieceType];
  }
  return MOVE_PATTERNS[piece.type];
}

/**
 * 成り駒（竜・馬）の特殊な移動範囲を計算するためのヘルパー
 * - 竜: 縦横は無限、斜めは1マス
 * - 馬: 斜めは無限、縦横は1マス
 */
function getRangeForVector(piece: Piece, vector: Vector, defaultRange: number): number {
  if (!piece.promoted) {
    return defaultRange;
  }

  // 斜め方向かどうかを判定
  const isDiagonal = vector.dFile !== 0 && vector.dRank !== 0;

  if (piece.type === '飛') {
    // 竜: 斜めは1マス、縦横は無限
    return isDiagonal ? 1 : defaultRange;
  }

  if (piece.type === '角') {
    // 馬: 縦横は1マス、斜めは無限
    return isDiagonal ? defaultRange : 1;
  }

  return defaultRange;
}

/**
 * 指定された駒の移動可能なマスを計算
 * @param piece - 移動する駒
 * @param position - 駒の現在位置
 * @param board - 現在の盤面状態
 * @returns 移動可能なマスの配列
 */
export function calculateValidMoves(piece: Piece, position: Position, board: Piece[]): Position[] {
  const pattern = getMovePattern(piece);
  const adjustedVectors = getAdjustedVectors(piece, pattern);
  const validMoves: Position[] = [];

  for (const vector of adjustedVectors) {
    // 成り駒（竜・馬）の場合は方向に応じてrangeを調整
    const effectiveRange = getRangeForVector(piece, vector, pattern.range);

    // rangeに応じて移動可能なマスを探索
    for (let step = 1; step <= effectiveRange; step++) {
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
      const pieceAtTarget = board.find((p) => p.file === target.file && p.rank === target.rank);

      if (pieceAtTarget) {
        // 味方の駒がある場合は移動不可、この方向の探索を終了
        if (pieceAtTarget.player === piece.player) {
          break;
        }
        // 相手の駒がある場合は捕獲可能なので移動可能マスに追加してから終了
        validMoves.push(target);
        break;
      }

      validMoves.push(target);

      // range=1の場合は1マスのみ
      if (effectiveRange === 1) {
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
export function isValidMove(from: Position, to: Position, piece: Piece, board: Piece[]): boolean {
  // 移動先が盤内かチェック
  if (!isValidPosition(to)) {
    return false;
  }

  // 移動可能なマスの一覧を取得
  const validMoves = calculateValidMoves(piece, from, board);

  // toが移動可能なマスに含まれるかチェック
  return validMoves.some((move) => move.file === to.file && move.rank === to.rank);
}
