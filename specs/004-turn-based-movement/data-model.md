# Data Model: ターンベース駒移動制御

**Feature**: 004-turn-based-movement | **Date**: 2025-11-02

## エンティティ定義

### 1. Turn (ターン)

現在のプレイヤーのターン状態を表す列挙型。

**属性**:
- **値**: `'sente'` (先手) または `'gote'` (後手)

**型定義** (`src/types/turn.ts`):
```typescript
export type Turn = 'sente' | 'gote';
```

**検証ルール**:
- 値は必ず `'sente'` または `'gote'` のいずれか
- null や undefined は許可しない

**状態遷移**:
- 初期状態: `'sente'` (先手から開始)
- 駒の移動成功時: `'sente'` ↔ `'gote'` の切り替え
- ページリロード時: `'sente'` にリセット

### 2. Player (プレイヤー)

駒の所有者を表す列挙型。Turn型と同じ値を持ち、既存のコードで定義済み。

**属性**:
- **値**: `'sente'` (先手の駒) または `'gote'` (後手の駒)

**型定義** (`src/types/piece.ts` - 既存):
```typescript
export type Player = 'sente' | 'gote';
```

**検証ルール**:
- 値は必ず `'sente'` または `'gote'` のいずれか
- 各駒は必ず一人のプレイヤーに所属

**関係性**:
- `Piece` エンティティには既に `player: Player` フィールドが存在
- `Turn` と `Player` は同じ値空間を持ち、意味的にも同じ概念を表す

### 3. GameState (ゲーム状態) - 拡張

既存の `GameState` 型にターン情報を追加。

**既存属性** (`src/types/board.ts`):
- `board`: `(Piece | null)[][]` - 9x9の盤面配列
- `selectedSquare`: `Position | null` - 選択中のマスの位置

**追加属性**:
- `currentTurn`: `Turn` - 現在のターン

**型定義** (`src/types/board.ts` を拡張):
```typescript
import { Turn } from './turn';

export interface GameState {
  board: (Piece | null)[][];
  selectedSquare: Position | null;
  currentTurn: Turn; // 追加
}
```

**初期値**:
```typescript
{
  board: initialBoard,
  selectedSquare: null,
  currentTurn: 'sente'
}
```

**検証ルール**:
- `currentTurn` は必須フィールド
- 駒の移動前後で `currentTurn` の値が正しく切り替わる
- 選択可能な駒は `currentTurn` と一致する `player` を持つもののみ

### 4. TurnDisplayProps (ターン表示プロパティ)

`TurnDisplay` コンポーネントのプロパティ。

**属性**:
- `currentTurn`: `Turn` - 表示するターン
- `isHighlighted`: `boolean` - 無効操作時のアニメーション強調表示フラグ

**型定義** (`src/components/TurnDisplay.tsx` 内):
```typescript
interface TurnDisplayProps {
  currentTurn: Turn;
  isHighlighted: boolean;
}
```

**検証ルール**:
- `currentTurn` は必須
- `isHighlighted` はデフォルトで `false`
- アニメーション終了後に `isHighlighted` を `false` にリセット

## エンティティ関係図

```
GameState
├── board: (Piece | null)[][]
│   └── Piece
│       └── player: Player ('sente' | 'gote')
├── selectedSquare: Position | null
└── currentTurn: Turn ('sente' | 'gote')

TurnDisplay
└── props: TurnDisplayProps
    ├── currentTurn: Turn
    └── isHighlighted: boolean
```

## 状態管理フロー

### 1. 初期化
```
ゲーム開始 / ページリロード
  ↓
GameState.currentTurn = 'sente'
GameState.selectedSquare = null
```

### 2. 駒選択時のターン検証
```
ユーザーが駒を選択
  ↓
選択された駒の player を取得
  ↓
player === GameState.currentTurn?
  ├── Yes: 駒を選択、移動可能マスをハイライト
  └── No: 選択を拒否、視覚的フィードバック + ターン表示を強調
```

### 3. 駒移動成功時のターン切り替え
```
駒の移動が完了
  ↓
GameState.currentTurn を切り替え
  'sente' → 'gote' または 'gote' → 'sente'
  ↓
GameState.selectedSquare = null
  ↓
TurnDisplay を更新
```

### 4. 無効操作時のフィードバック
```
currentTurn と異なる player の駒を選択
  ↓
isHighlighted = true (0.5秒間)
  ↓
アニメーション実行(shake または pulse)
  ↓
isHighlighted = false
```

## データ永続化

- **スコープ**: ページリロード時は初期状態にリセット(明確化セッションでの決定)
- **永続化不要**: `currentTurn` はセッション中のメモリ上でのみ管理
- **将来の拡張**: ブラウザストレージ(localStorage)での状態保存は将来のフェーズで検討可能

## バリデーションルールまとめ

| エンティティ | フィールド | ルール |
|------------|----------|--------|
| Turn | 値 | 'sente' または 'gote' のみ |
| Player | 値 | 'sente' または 'gote' のみ |
| GameState | currentTurn | 必須、Turn型 |
| GameState | board | 各Pieceは有効なPlayerを持つ |
| TurnDisplayProps | currentTurn | 必須、Turn型 |
| TurnDisplayProps | isHighlighted | boolean、デフォルトfalse |

## 型安全性

TypeScriptの厳格モードを活用し、以下を保証:
- Turn と Player は型として明確に定義され、文字列リテラルの誤用を防ぐ
- GameState.currentTurn は必須フィールドとして型チェックされる
- コンポーネントのpropsは型定義により保証される
- null/undefined の安全な取り扱い
