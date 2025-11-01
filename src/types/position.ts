/**
 * 盤上の位置情報
 */
export interface Position {
  /** 筋 (1-9の数値、1が右端、9が左端) */
  file: number;
  /** 段 (1-9の数値、1が先手側、9が後手側) */
  rank: number;
}
