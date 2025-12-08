import type { Piece } from './piece';
import type { CapturedPieces } from './capturedPieces';
import type { Turn } from './turn';

/**
 * 1手分の完全な盤面状態のスナップショット
 */
export interface HistoryEntry {
  /** 盤上の駒の配列 */
  pieces: Piece[];
  /** 先手・後手の持ち駒 */
  capturedPieces: CapturedPieces;
  /** 現在の手番 */
  currentTurn: Turn;
  /** 手数（0が初期配置、1以降が指した手） */
  moveNumber: number;
}

/**
 * HistoryEntry の順序付きコレクション
 */
export interface GameHistory {
  /** 履歴エントリの配列（0番目が初期配置） */
  entries: HistoryEntry[];
  /** 現在表示中の手のインデックス */
  currentIndex: number;
}

/**
 * UI のボタン有効/無効状態を決定するための状態情報
 */
export interface NavigationState {
  /** 「一手戻る」「初手に戻る」が有効か */
  canGoBack: boolean;
  /** 「一手進む」「最終手に進む」が有効か */
  canGoForward: boolean;
  /** 現在の手数 */
  currentMoveNumber: number;
  /** 総手数（entries.length - 1） */
  totalMoves: number;
}
