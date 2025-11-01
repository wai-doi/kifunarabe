# Quickstart: ターンベース駒移動制御

**Feature**: 004-turn-based-movement | **Date**: 2025-11-02

このガイドでは、ターンベース駒移動制御フェーチャーの開発環境をセットアップし、実装を開始するための手順を説明します。

## 前提条件

- Node.js 18.x 以上がインストールされている
- プロジェクトのリポジトリがクローン済み
- 既存のフェーチャー 002-shogi-board-display および 003-piece-movement が実装済み

## セットアップ手順

### 1. 依存関係のインストール

プロジェクトルートで以下を実行:

```bash
npm install
```

既存の依存関係(React、TypeScript、Tailwind CSS、Vitest等)がインストールされます。

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開き、将棋盤が表示されることを確認します。

### 3. フェーチャーブランチの確認

```bash
git branch
# 004-turn-based-movement ブランチにいることを確認
```

### 4. テストの実行

```bash
npm test
```

既存のテストがすべてパスすることを確認します。

## 開発フロー

### Phase 1: 型定義の作成

1. **Turn型の定義** (`src/types/turn.ts`):

```typescript
export type Turn = 'sente' | 'gote';
```

2. **Player型の確認** (`src/types/piece.ts`):

既存のコードで既に定義されています：

```typescript
export type Player = 'sente' | 'gote';

export interface Piece {
  type: PieceType;
  player: Player; // 既存
  // ...
}
```

3. **GameState型の拡張** (`src/types/board.ts`):

```typescript
import { Turn } from './turn';

export interface GameState {
  board: (Piece | null)[][];
  selectedSquare: Position | null;
  currentTurn: Turn; // 追加
}
```

**テスト**:
```bash
npm test src/types/
```

### Phase 2: ロジックの実装

1. **turnControl.ts の作成** (`src/logic/turnControl.ts`):

```typescript
import { Turn, Player } from '../types';

export function canSelectPiece(currentTurn: Turn, piecePlayer: Player): boolean {
  return currentTurn === piecePlayer;
}

export function switchTurn(currentTurn: Turn): Turn {
  return currentTurn === 'sente' ? 'gote' : 'sente';
}

export function getTurnDisplayName(turn: Turn): string {
  return turn === 'sente' ? '先手の番' : '後手の番';
}
```

**テスト**:
```bash
npm test src/logic/turnControl.test.ts
```

### Phase 3: TurnDisplay コンポーネントの実装

1. **TurnDisplay.tsx の作成** (`src/components/TurnDisplay.tsx`):

```typescript
import { Turn } from '../types/turn';
import { getTurnDisplayName } from '../logic/turnControl';

interface TurnDisplayProps {
  currentTurn: Turn;
  isHighlighted: boolean;
}

export function TurnDisplay({ currentTurn, isHighlighted }: TurnDisplayProps) {
  return (
    <div 
      className={`
        text-2xl font-bold text-center py-4
        ${isHighlighted ? 'animate-pulse' : ''}
        ${currentTurn === 'sente' ? 'text-gray-800' : 'text-gray-400'}
      `}
    >
      {getTurnDisplayName(currentTurn)}
    </div>
  );
}
```

**テスト**:
```bash
npm test src/components/TurnDisplay.test.tsx
```

### Phase 4: 既存コンポーネントの統合

1. **boardState.ts の拡張** (`src/logic/boardState.ts`):

```typescript
export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    selectedSquare: null,
    currentTurn: 'sente' // 追加
  };
}

export function movePieceAndSwitchTurn(
  gameState: GameState,
  from: Position,
  to: Position
): GameState {
  const newBoard = movePiece(gameState.board, from, to);
  return {
    ...gameState,
    board: newBoard,
    selectedSquare: null,
    currentTurn: switchTurn(gameState.currentTurn) // ターン切り替え
  };
}
```

2. **Board.tsx の拡張** (`src/components/Board.tsx`):

```typescript
// Props に currentTurn を追加
interface BoardProps {
  // ... 既存のprops
  currentTurn: Turn;
  onInvalidSelection: () => void; // 追加
}

// handleSquareClick 内にターン検証を追加
function handleSquareClick(position: Position) {
  const piece = board[position.row][position.col];
  
  if (piece && !canSelectPiece(currentTurn, piece.player)) {
    onInvalidSelection(); // 無効な選択時のコールバック
    return;
  }
  
  // 既存の選択ロジック
  // ...
}
```

3. **ShogiBoard.tsx の拡張** (`src/components/ShogiBoard.tsx`):

```typescript
export function ShogiBoard() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleInvalidSelection = () => {
    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 500);
  };

  const handleMove = (from: Position, to: Position) => {
    const newState = movePieceAndSwitchTurn(gameState, from, to);
    setGameState(newState);
  };

  return (
    <div className="flex flex-col items-center">
      <TurnDisplay 
        currentTurn={gameState.currentTurn} 
        isHighlighted={isHighlighted} 
      />
      <Board 
        board={gameState.board}
        selectedSquare={gameState.selectedSquare}
        currentTurn={gameState.currentTurn}
        onMove={handleMove}
        onInvalidSelection={handleInvalidSelection}
      />
    </div>
  );
}
```

**統合テスト**:
```bash
npm test src/components/ShogiBoard.test.tsx
```

### Phase 5: CSSアニメーションの追加

1. **index.css にカスタムアニメーションを追加** (`src/index.css`):

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 0.5s ease-in-out;
}

/* アクセシビリティ: アニメーション無効化の設定 */
@media (prefers-reduced-motion: reduce) {
  .animate-shake,
  .animate-pulse {
    animation: none;
  }
}
```

2. **TurnDisplay.tsx のアニメーション適用**:

```typescript
<div 
  className={`
    text-2xl font-bold text-center py-4
    ${isHighlighted ? 'animate-shake' : ''}
    ${currentTurn === 'sente' ? 'text-gray-800' : 'text-gray-400'}
  `}
>
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm test` | 全テストを実行 |
| `npm test -- --ui` | テストUIを起動 |
| `npm test -- --coverage` | カバレッジレポートを生成 |
| `npm run lint` | ESLintでコードチェック |
| `npm run format` | Prettierでコード整形 |
| `npm run format:check` | コード整形チェック |
| `npm run check` | lint + format:check を実行 |
| `npm run build` | 本番ビルド |

## TDD サイクル

1. **Red**: テストを書く(失敗を確認)
   ```bash
   npm test src/logic/turnControl.test.ts
   ```

2. **Green**: 最小限の実装でテストを通す
   ```bash
   npm test src/logic/turnControl.test.ts
   ```

3. **Refactor**: コードをリファクタリング
   ```bash
   npm run check  # lint + format をチェック
   npm test       # すべてのテストを再実行
   ```

## デバッグ

### 開発ツール

- **React DevTools**: ブラウザの拡張機能でコンポーネント階層を確認
- **Console logging**: `console.log` でターン状態やイベントを確認
- **Vitest UI**: `npm test -- --ui` でテストをインタラクティブに実行

### よくある問題

**問題**: ターンが切り替わらない
- **確認**: `movePieceAndSwitchTurn` が呼ばれているか
- **確認**: `switchTurn` 関数が正しく実装されているか

**問題**: アニメーションが表示されない
- **確認**: `isHighlighted` フラグが正しく設定されているか
- **確認**: CSSアニメーションが正しく定義されているか
- **確認**: Tailwind CSSのビルドが最新か

**問題**: テストが失敗する
- **確認**: 型定義が正しいか
- **確認**: モックが適切に設定されているか
- **確認**: 既存のテストとの競合がないか

## 次のステップ

1. すべてのテストがパスすることを確認
2. ブラウザで実際の動作を確認
3. エッジケースをテスト
4. コード品質チェック(`npm run check`)を実行
5. コミット前に全テストを再実行

## 参考リソース

- [React Hooks ドキュメント](https://ja.react.dev/reference/react)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [Vitest ドキュメント](https://vitest.dev/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs/)
