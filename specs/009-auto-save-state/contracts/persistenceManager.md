# Persistence Manager API Contract

**Feature**: 009-auto-save-state
**Version**: 1.0.0
**Date**: 2025-12-09

## 概要

この契約仕様は、ゲーム状態の永続化を担当する `persistenceManager` モジュールのAPIを定義します。このモジュールはlocalStorageとのやり取りをカプセル化し、型安全な保存・復元機能を提供します。

## 型定義

### PersistedGameState

```typescript
interface PersistedGameState {
  board: Board;
  capturedPieces: CapturedPieces;
  currentTurn: Turn;
  history: MoveHistoryEntry[];
  currentIndex: number;
  version: string;
  timestamp: number;
}
```

### GameStateInput

```typescript
interface GameStateInput {
  board: Board;
  capturedPieces: CapturedPieces;
  currentTurn: Turn;
  history: MoveHistoryEntry[];
  currentIndex: number;
}
```

**説明**: 保存時に渡すデータ。versionとtimestampは自動的に付与されます。

## API仕様

### saveGameState

**シグネチャ**:
```typescript
function saveGameState(state: GameStateInput): boolean
```

**説明**: ゲーム状態をlocalStorageに保存します。

**パラメータ**:
- `state`: 保存するゲーム状態（versionとtimestampは不要）

**戻り値**:
- `true`: 保存成功
- `false`: 保存失敗（容量超過、localStorage無効など）

**副作用**:
- localStorageの `kifunarabe:gameState` キーに JSON 文字列を保存
- エラー発生時は `console.warn()` でログ出力

**エラーハンドリング**:
- `QuotaExceededError`: 容量超過 → falseを返す、警告ログ
- `localStorage無効`: アクセス不可 → falseを返す、警告ログ
- `JSON.stringify失敗`: シリアライズエラー → falseを返す、警告ログ

**例**:
```typescript
const success = saveGameState({
  board: currentBoard,
  capturedPieces: currentCapturedPieces,
  currentTurn: 'sente',
  history: moveHistory,
  currentIndex: 5
});

if (!success) {
  // 保存失敗（ユーザーには通知しない）
}
```

---

### loadGameState

**シグネチャ**:
```typescript
function loadGameState(): PersistedGameState | null
```

**説明**: localStorageからゲーム状態を復元します。

**パラメータ**: なし

**戻り値**:
- `PersistedGameState`: 復元成功時、バリデーション済みのゲーム状態
- `null`: 復元失敗時（データなし、パースエラー、バリデーション失敗）

**副作用**:
- localStorageから読み取り
- エラー発生時は `console.warn()` でログ出力

**エラーハンドリング**:
- データなし: nullを返す（警告ログなし、正常ケース）
- `JSON.parse失敗`: パースエラー → nullを返す、警告ログ
- バリデーション失敗: 型不一致 → nullを返す、警告ログ
- `localStorage無効`: アクセス不可 → nullを返す、警告ログ

**例**:
```typescript
const savedState = loadGameState();

if (savedState) {
  // 状態を復元
  setBoard(savedState.board);
  setCapturedPieces(savedState.capturedPieces);
  setCurrentTurn(savedState.currentTurn);
  setHistory(savedState.history);
  setCurrentIndex(savedState.currentIndex);
} else {
  // 初期配置を使用（データなしまたはエラー）
}
```

---

### clearGameState

**シグネチャ**:
```typescript
function clearGameState(): void
```

**説明**: localStorageからゲーム状態を削除します。

**パラメータ**: なし

**戻り値**: なし

**副作用**:
- localStorageの `kifunarabe:gameState` キーを削除
- エラー発生時は `console.warn()` でログ出力

**エラーハンドリング**:
- `localStorage無効`: アクセス不可 → 何もしない、警告ログ

**例**:
```typescript
// ゲームをリセットする場合
clearGameState();
```

---

### validatePersistedGameState

**シグネチャ**:
```typescript
function validatePersistedGameState(data: any): data is PersistedGameState
```

**説明**: 復元したデータが `PersistedGameState` 型に準拠しているか検証します（内部使用、エクスポートされる可能性あり）。

**パラメータ**:
- `data`: 検証対象のデータ（any型）

**戻り値**:
- `true`: データが有効
- `false`: データが無効

**検証項目**:
1. 必須フィールドの存在確認（7フィールド）
2. 型チェック:
   - `board`: 9×9の二次元配列
   - `capturedPieces`: オブジェクトで `sente` と `gote` プロパティを持つ
   - `currentTurn`: "sente" または "gote"
   - `history`: 配列
   - `currentIndex`: 数値、0以上かつ `history.length` 以下
   - `version`: 文字列
   - `timestamp`: 数値
3. ビジネスルール:
   - `currentIndex` が範囲内

**例**:
```typescript
const data = JSON.parse(localStorage.getItem('kifunarabe:gameState') || '{}');

if (validatePersistedGameState(data)) {
  // dataはPersistedGameState型として使用可能
  return data;
} else {
  return null;
}
```

## 定数

### STORAGE_KEY

```typescript
const STORAGE_KEY = 'kifunarabe:gameState' as const;
```

**説明**: localStorageのキー名

### CURRENT_VERSION

```typescript
const CURRENT_VERSION = '1.0.0' as const;
```

**説明**: データ形式の現在のバージョン

## 使用例（統合）

### ShogiBoard.tsx での使用

```typescript
import { saveGameState, loadGameState } from '../logic/persistenceManager';

function ShogiBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>(initialCapturedPieces);
  const [currentTurn, setCurrentTurn] = useState<Turn>('sente');
  const [history, setHistory] = useState<MoveHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 初回マウント時に復元
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState.board);
      setCapturedPieces(savedState.capturedPieces);
      setCurrentTurn(savedState.currentTurn);
      setHistory(savedState.history);
      setCurrentIndex(savedState.currentIndex);
    }
  }, []); // 依存配列が空 = マウント時のみ実行

  // 状態変更時に自動保存
  useEffect(() => {
    // 初回マウント時の保存をスキップ（historyが空の場合は保存しない）
    if (history.length === 0) return;

    saveGameState({
      board,
      capturedPieces,
      currentTurn,
      history,
      currentIndex
    });
  }, [board, capturedPieces, currentTurn, history, currentIndex]);

  // ... 残りのコンポーネントロジック
}
```

## テストケース

### saveGameState のテスト

```typescript
describe('saveGameState', () => {
  it('正常に保存できる', () => {
    const state = createValidGameState();
    expect(saveGameState(state)).toBe(true);
    
    const saved = localStorage.getItem('kifunarabe:gameState');
    expect(saved).not.toBeNull();
    
    const parsed = JSON.parse(saved!);
    expect(parsed.board).toEqual(state.board);
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.timestamp).toBeGreaterThan(0);
  });

  it('容量超過時はfalseを返す', () => {
    // localStorageをモックして容量超過を再現
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    
    const state = createValidGameState();
    expect(saveGameState(state)).toBe(false);
  });

  it('localStorage無効時はfalseを返す', () => {
    // localStorageをnullに設定
    Object.defineProperty(window, 'localStorage', {
      value: null,
      writable: true
    });
    
    const state = createValidGameState();
    expect(saveGameState(state)).toBe(false);
  });
});
```

### loadGameState のテスト

```typescript
describe('loadGameState', () => {
  it('正常に復元できる', () => {
    const state = createValidPersistedGameState();
    localStorage.setItem('kifunarabe:gameState', JSON.stringify(state));
    
    const loaded = loadGameState();
    expect(loaded).toEqual(state);
  });

  it('データがない場合はnullを返す', () => {
    localStorage.clear();
    expect(loadGameState()).toBeNull();
  });

  it('パースエラー時はnullを返す', () => {
    localStorage.setItem('kifunarabe:gameState', 'invalid json');
    expect(loadGameState()).toBeNull();
  });

  it('バリデーション失敗時はnullを返す', () => {
    const invalidState = { board: 'not an array' };
    localStorage.setItem('kifunarabe:gameState', JSON.stringify(invalidState));
    expect(loadGameState()).toBeNull();
  });
});
```

### validatePersistedGameState のテスト

```typescript
describe('validatePersistedGameState', () => {
  it('有効なデータはtrueを返す', () => {
    const validData = createValidPersistedGameState();
    expect(validatePersistedGameState(validData)).toBe(true);
  });

  it('必須フィールドが欠けている場合はfalseを返す', () => {
    const invalidData = { board: [], capturedPieces: {} };
    expect(validatePersistedGameState(invalidData)).toBe(false);
  });

  it('currentIndexが範囲外の場合はfalseを返す', () => {
    const invalidData = {
      ...createValidPersistedGameState(),
      currentIndex: 100 // historyの長さより大きい
    };
    expect(validatePersistedGameState(invalidData)).toBe(false);
  });

  it('currentTurnが不正な値の場合はfalseを返す', () => {
    const invalidData = {
      ...createValidPersistedGameState(),
      currentTurn: 'invalid'
    };
    expect(validatePersistedGameState(invalidData)).toBe(false);
  });
});
```

## 非機能要件

| 項目 | 要件 | 実装方法 |
|-----|------|---------|
| パフォーマンス | 保存・復元は100ms以内 | 同期APIの使用、最適化不要 |
| エラーハンドリング | エラー時も動作を継続 | try-catchで例外をキャッチ、警告ログのみ |
| 型安全性 | TypeScriptの型システムを活用 | 厳格な型定義とバリデーション |
| テスタビリティ | ユニットテスト可能 | 純粋関数、依存性注入不要（localStorage直接使用） |
| 保守性 | シンプルで理解しやすい | 1ファイル、明確な関数分割 |

## 変更履歴

- 2025-12-09: v1.0.0 初版作成
