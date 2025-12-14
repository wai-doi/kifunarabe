import type { NavigationState } from '../types/history';

/**
 * NavigationControls のプロパティ
 */
export interface NavigationControlsProps {
  /** ナビゲーション状態 */
  navigationState: NavigationState;
  /** 一手戻るハンドラー */
  onGoBack: () => void;
  /** 一手進むハンドラー */
  onGoForward: () => void;
  /** 初手に戻るハンドラー */
  onGoFirst: () => void;
  /** 最終手に進むハンドラー */
  onGoLast: () => void;
}

/**
 * 履歴ナビゲーションコントロールコンポーネント
 * 「初手に戻る」「一手戻る」「一手進む」「最終手に進む」の4つのボタンを提供
 */
export function NavigationControls({
  navigationState,
  onGoBack,
  onGoForward,
  onGoFirst,
  onGoLast,
}: NavigationControlsProps) {
  const { canGoBack, canGoForward, currentMoveNumber, totalMoves } = navigationState;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2">
      <button
        type="button"
        onClick={onGoFirst}
        disabled={!canGoBack}
        className="rounded bg-blue-500 px-3 py-2 text-sm sm:text-base text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="初手に戻る"
      >
        初手に戻る
      </button>

      <button
        type="button"
        onClick={onGoBack}
        disabled={!canGoBack}
        className="rounded bg-blue-500 px-3 py-2 text-sm sm:text-base text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="一手戻る"
      >
        ← 一手戻る
      </button>

      <span className="px-3 text-sm sm:text-base text-gray-700">
        {currentMoveNumber}手目 / {totalMoves}手
      </span>

      <button
        type="button"
        onClick={onGoForward}
        disabled={!canGoForward}
        className="rounded bg-blue-500 px-3 py-2 text-sm sm:text-base text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="一手進む"
      >
        一手進む →
      </button>

      <button
        type="button"
        onClick={onGoLast}
        disabled={!canGoForward}
        className="rounded bg-blue-500 px-3 py-2 text-sm sm:text-base text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-label="最終手に進む"
      >
        最終手に進む
      </button>
    </div>
  );
}
