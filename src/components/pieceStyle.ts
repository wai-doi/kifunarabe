export const PENTAGON_CLIP_PATH = 'polygon(50% 0%, 90% 15%, 97% 100%, 3% 100%, 10% 15%)';

export const WOOD_GRADIENT = 'linear-gradient(145deg, #f3d9b7 0%, #e8c4a0 38%, #d4a574 100%)';
export const SELECTED_WOOD_GRADIENT =
  'linear-gradient(145deg, #f7e1c3 0%, #eecf9f 45%, #d8ab6d 100%)';
export const CAPTURED_SELECTED_GRADIENT =
  'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)';

export const BASE_SHADOW =
  'inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.15)';
export const SELECTED_SHADOW =
  'inset 0 1px 0 rgba(255, 255, 255, 0.7), inset 0 -2px 6px rgba(0, 0, 0, 0.25), 0 0 0 2px #facc15, 0 10px 20px rgba(0, 0, 0, 0.22)';
export const CAPTURED_BASE_SHADOW =
  'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.08)';
export const CAPTURED_SELECTED_SHADOW =
  'inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 0 0 3px #facc15, 0 4px 8px rgba(0, 0, 0, 0.2)';

export const TEXT_COLOR = '#000000';
export const PROMOTED_TEXT_COLOR = '#CC0000';

export const BOARD_FONT_SIZE = 'clamp(1.3rem, 1.8vw, 1.8rem)';
export const CAPTURED_FONT_SIZE = 'clamp(1.1rem, 2vw, 1.4rem)';

// 持ち駒の数字表示用スタイル定数
export const COUNT_FONT_SIZE_RATIO = 0.6; // 駒の文字の60%
export const COUNT_COLOR = '#5C4033'; // 濃い茶色（通常時）
export const COUNT_COLOR_SELECTED = '#3E2723'; // より濃い茶色（選択時）

export const PIECE_BASE_CLASS = 'shogi-piece shogi-piece-wood';
export const PIECE_TEXT_CLASS = 'shogi-piece-text';
export const CAPTURED_PIECE_CLASS = 'shogi-piece shogi-piece-wood shogi-piece-captured';

export const pentagonShapeStyle = {
  clipPath: PENTAGON_CLIP_PATH,
} as const;

export const baseSurfaceStyle = {
  background: WOOD_GRADIENT,
  boxShadow: BASE_SHADOW,
} as const;

export const selectedSurfaceStyle = {
  background: SELECTED_WOOD_GRADIENT,
  boxShadow: SELECTED_SHADOW,
} as const;

export const capturedBaseSurfaceStyle = {
  background: WOOD_GRADIENT,
  boxShadow: CAPTURED_BASE_SHADOW,
} as const;

export const capturedSelectedSurfaceStyle = {
  background: CAPTURED_SELECTED_GRADIENT,
  boxShadow: CAPTURED_SELECTED_SHADOW,
  transform: 'scale(1.08)',
} as const;
