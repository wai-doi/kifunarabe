import type { Turn } from '../types/turn';
import { getTurnDisplayName } from '../logic/turnControl';

/**
 * TurnDisplay コンポーネントのプロパティ
 */
interface TurnDisplayProps {
  /** 現在のターン */
  currentTurn: Turn;
  /** アニメーション強調表示フラグ */
  isHighlighted: boolean;
}

/**
 * 現在のターンを表示するコンポーネント
 * T028: ターン表示コンポーネント
 */
const TurnDisplay = ({ currentTurn, isHighlighted }: TurnDisplayProps) => {
  // T029: スタイリング - 盤面上部中央配置、大きめフォント
  const baseClass = 'text-center py-4 px-8 text-3xl font-bold';

  // T030: アニメーション - isHighlightedの時にshakeアニメーションを適用
  const animationClass = isHighlighted ? 'animate-shake' : '';

  // ターンによって色を変える
  const colorClass = currentTurn === 'sente' ? 'text-gray-800' : 'text-gray-600';

  return (
    <div
      data-testid="turn-display"
      className={`${baseClass} ${colorClass} ${animationClass}`}
      role="status"
      aria-live="polite"
    >
      {getTurnDisplayName(currentTurn)}
    </div>
  );
};

export default TurnDisplay;
