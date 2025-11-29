import type { Position } from '../types/position';

interface PromotionDialogProps {
  /** 移動先の位置（ダイアログの表示位置の基準） */
  position: Position;
  /** 成るを選択した時のコールバック */
  onPromote: () => void;
  /** 成らないを選択した時のコールバック */
  onDecline: () => void;
}

/**
 * 成り選択ダイアログ
 * 駒が成り条件を満たした移動を行った際に、成る/成らないを選択するためのポップアップUI
 */
const PromotionDialog = ({ position, onPromote, onDecline }: PromotionDialogProps) => {
  // Board.tsxのマス目生成順序に合わせた位置計算:
  // - file: 1→9 が 左→右 なので (file - 1) / 9
  // - rank: 9→1 が 上→下 なので (9 - rank) / 9
  // マスの中心に配置するため、0.5マス分オフセット
  const leftPercent = ((position.file - 1 + 0.5) / 9) * 100;
  const topPercent = ((9 - position.rank + 0.5) / 9) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="成り選択"
      className="absolute z-50"
      style={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      <div className="bg-white border-2 border-gray-800 rounded-lg shadow-lg p-2 flex gap-2 whitespace-nowrap">
        <button
          type="button"
          onClick={onPromote}
          className="px-4 py-2 bg-amber-600 text-white font-bold rounded hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="成る"
        >
          成る
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="成らない"
        >
          不成
        </button>
      </div>
    </div>
  );
};

export default PromotionDialog;
