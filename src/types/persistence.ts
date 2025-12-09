import type { Piece } from './piece';
import type { CapturedPieces } from './capturedPieces';
import type { Turn } from './turn';
import type { HistoryEntry } from './history';

/**
 * localStorageに永続化されるゲーム状態の完全なスナップショット
 */
export interface PersistedGameState {
  /** 盤上の駒の配列 */
  pieces: Piece[];
  /** 先手・後手の持ち駒 */
  capturedPieces: CapturedPieces;
  /** 現在の手番 */
  currentTurn: Turn;
  /** 手順履歴の配列 */
  history: HistoryEntry[];
  /** 履歴上の現在位置 */
  currentIndex: number;
  /** データ形式のバージョン番号（セマンティックバージョニング） */
  version: string;
  /** 保存時のUnixタイムスタンプ（ミリ秒） */
  timestamp: number;
}

/**
 * 保存時に渡すゲーム状態（versionとtimestampは自動付与）
 */
export interface GameStateInput {
  /** 盤上の駒の配列 */
  pieces: Piece[];
  /** 先手・後手の持ち駒 */
  capturedPieces: CapturedPieces;
  /** 現在の手番 */
  currentTurn: Turn;
  /** 手順履歴の配列 */
  history: HistoryEntry[];
  /** 履歴上の現在位置 */
  currentIndex: number;
}
