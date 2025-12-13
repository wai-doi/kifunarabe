import type { CapturedPiecesMap } from '../types/capturedPieces';
import type { Player, PieceType } from '../types/piece';
import {
  CAPTURED_FONT_SIZE,
  CAPTURED_PIECE_CLASS,
  COUNT_COLOR,
  COUNT_COLOR_SELECTED,
  COUNT_FONT_SIZE_RATIO,
  PIECE_TEXT_CLASS,
  PROMOTED_TEXT_COLOR,
  TEXT_COLOR,
  capturedBaseSurfaceStyle,
  capturedSelectedSurfaceStyle,
  pentagonShapeStyle,
} from './pieceStyle';

interface CapturedPiecesProps {
  /** 表示する持ち駒のマップ */
  capturedPieces: CapturedPiecesMap;
  /** プレイヤー(先手/後手) */
  player: Player;
  /** 駒がクリックされた時のハンドラ */
  onPieceClick?: (pieceType: PieceType) => void;
  /** 現在選択中の駒の種類 */
  selectedPieceType?: PieceType;
  /** 持ち駒を選択可能かどうか（手番制御用） */
  isSelectable?: boolean;
}

/**
 * プレイヤーの持ち駒を視覚的に表示するコンポーネント
 */
const CapturedPieces = ({
  capturedPieces,
  player,
  onPieceClick,
  selectedPieceType,
  isSelectable = true,
}: CapturedPiecesProps) => {
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

  const handleClick = (pieceType: string) => {
    if (isSelectable && onPieceClick) {
      onPieceClick(pieceType as PieceType);
    }
  };

  return (
    <div
      data-testid={`captured-pieces-${player}`}
      className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100"
      role="region"
      aria-label={`${player === 'sente' ? '先手' : '後手'}の持ち駒`}
    >
      {pieces.map(([pieceType, count]) => {
        const isSelected = selectedPieceType === pieceType;
        const baseStyles =
          'flex items-center justify-center gap-1 transition-all duration-150 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 border-0';
        const selectableStyles = isSelectable ? 'cursor-pointer hover:shadow-lg' : 'cursor-default';
        const selectedStyles = isSelected ? 'shogi-piece-selected' : '';
        const surfaceStyle = isSelected ? capturedSelectedSurfaceStyle : capturedBaseSurfaceStyle;
        const textColor =
          pieceType === 'と' ||
          pieceType === '杏' ||
          pieceType === '圭' ||
          pieceType === '全' ||
          pieceType === '竜' ||
          pieceType === '馬'
            ? PROMOTED_TEXT_COLOR
            : TEXT_COLOR;

        return (
          <button
            key={pieceType}
            type="button"
            onClick={() => handleClick(pieceType)}
            className={`${baseStyles} ${selectableStyles} ${CAPTURED_PIECE_CLASS} ${selectedStyles}`}
            aria-label={`持ち駒の${pieceType}${count && count > 1 ? ` ${count}枚` : ''}`}
            aria-pressed={isSelected}
            style={{
              ...pentagonShapeStyle,
              ...surfaceStyle,
              fontSize: CAPTURED_FONT_SIZE,
              position: 'relative',
            }}
            data-font-size={CAPTURED_FONT_SIZE}
          >
            <span
              className={`${PIECE_TEXT_CLASS}`}
              style={{ fontSize: CAPTURED_FONT_SIZE, color: textColor }}
            >
              {pieceType}
            </span>
            {count !== undefined && count > 1 && (
              <span
                style={{
                  position: 'absolute',
                  right: '2px',
                  bottom: '2px',
                  fontSize: `calc(${CAPTURED_FONT_SIZE} * ${COUNT_FONT_SIZE_RATIO})`,
                  color: isSelected ? COUNT_COLOR_SELECTED : COUNT_COLOR,
                  fontWeight: 600,
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CapturedPieces;
