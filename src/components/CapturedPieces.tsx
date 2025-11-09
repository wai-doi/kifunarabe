import type { CapturedPiecesMap } from '../types/capturedPieces';
import type { Player } from '../types/piece';

interface CapturedPiecesProps {
  /** 表示する持ち駒のマップ */
  capturedPieces: CapturedPiecesMap;
  /** プレイヤー(先手/後手) */
  player: Player;
}

/**
 * プレイヤーの持ち駒を視覚的に表示するコンポーネント
 */
const CapturedPieces = ({ capturedPieces, player }: CapturedPiecesProps) => {
  // 駒の種類の順序（将棋の標準的な順序）
  const pieceOrder = ['飛', '角', '金', '銀', '桂', '香', '歩'];

  // 持ち駒を配列に変換し、駒の種類順にソート
  const pieces = Object.entries(capturedPieces)
    .filter(([, count]) => count && count > 0)
    .sort(([a], [b]) => {
      const indexA = pieceOrder.indexOf(a);
      const indexB = pieceOrder.indexOf(b);
      // 順序リストにない駒は最後に配置
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  return (
    <div
      data-testid={`captured-pieces-${player}`}
      className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 shadow-md"
      role="region"
      aria-label={`${player === 'sente' ? '先手' : '後手'}の持ち駒`}
    >
      {pieces.map(([pieceType, count]) => (
        <div
          key={pieceType}
          className="flex items-center gap-1 px-3 py-2 bg-white rounded-md shadow-sm hover:shadow transition-shadow"
        >
          <span className="text-xl font-bold text-amber-900">{pieceType}</span>
          {count !== undefined && count > 1 && (
            <span className="text-sm font-medium text-amber-700">×{count}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CapturedPieces;
