# Quickstart Guide: 状態の自動保存

**Feature**: 009-auto-save-state
**Version**: 1.0.0
**Date**: 2025-12-09

## 概要

この機能は、ブラウザを閉じて再度開いたときに、閉じる前の盤面、持ち駒、手番、履歴を自動的に復元します。ユーザーは保存ボタンなどの操作を一切せずに、シームレスに対局を再開できます。

## 前提条件

- モダンブラウザ（localStorage対応）
- 既存の将棋アプリが動作している状態
- TypeScript + React環境

## アーキテクチャ概要

```
┌─────────────────┐
│  ShogiBoard.tsx │  ← Reactコンポーネント（状態管理）
└────────┬────────┘
         │
         │ useEffect で自動保存・復元
         │
┌────────▼────────────────┐
│ persistenceManager.ts   │  ← 永続化ロジック
│ - saveGameState()       │
│ - loadGameState()       │
│ - validateGameState()   │
└────────┬────────────────┘
         │
         │ localStorage API
         │
┌────────▼────────┐
│  localStorage   │  ← ブラウザ標準ストレージ
│  キー:          │
│  kifunarabe:    │
│  gameState      │
└─────────────────┘
```

## ファイル構成

### 新規ファイル

```
src/
├── logic/
│   └── persistenceManager.ts    # 永続化ロジック（新規）
└── types/
    └── persistence.ts            # 永続化データの型定義（新規）

tests/
└── logic/
    └── persistenceManager.test.ts  # ユニットテスト（新規）
```

### 変更ファイル

```
src/
└── components/
    └── ShogiBoard.tsx           # useEffectで保存・復元を統合（変更）

tests/
└── components/
    └── ShogiBoard.test.tsx      # 統合テストを追加（変更）
```

## 実装ステップ

### Phase 1: 型定義の作成

**ファイル**: `src/types/persistence.ts`

```typescript
import type { Board } from './board';
import type { CapturedPieces } from './capturedPieces';
import type { Turn } from './turn';
import type { MoveHistoryEntry } from './history';

/**
 * localStorageに保存されるゲーム状態全体の型
 */
export interface PersistedGameState {
  /** 盤面の状態 */
  board: Board;
  /** 持ち駒 */
  capturedPieces: CapturedPieces;
  /** 現在の手番 */
  currentTurn: Turn;
  /** 手順履歴 */
  history: MoveHistoryEntry[];
  /** 履歴上の現在位置 */
  currentIndex: number;
  /** データ形式のバージョン */
  version: string;
  /** 保存時のタイムスタンプ（ミリ秒） */
  timestamp: number;
}

/**
 * 保存時に渡すデータ（versionとtimestampは自動付与）
 */
export interface GameStateInput {
  board: Board;
  capturedPieces: CapturedPieces;
  currentTurn: Turn;
  history: MoveHistoryEntry[];
  currentIndex: number;
}
```

### Phase 2: 永続化マネージャーの作成

**ファイル**: `src/logic/persistenceManager.ts`

```typescript
import type { PersistedGameState, GameStateInput } from '../types/persistence';

const STORAGE_KEY = 'kifunarabe:gameState';
const CURRENT_VERSION = '1.0.0';

/**
 * ゲーム状態をlocalStorageに保存
 * @returns 保存成功時はtrue、失敗時はfalse
 */
export function saveGameState(state: GameStateInput): boolean {
  try {
    const persistedState: PersistedGameState = {
      ...state,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    };
    
    const json = JSON.stringify(persistedState);
    localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (error) {
    console.warn('ゲーム状態の保存に失敗しました:', error);
    return false;
  }
}

/**
 * localStorageからゲーム状態を復元
 * @returns 復元成功時はPersistedGameState、失敗時はnull
 */
export function loadGameState(): PersistedGameState | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null; // データなし（正常ケース）
    }
    
    const data = JSON.parse(json);
    
    if (!validatePersistedGameState(data)) {
      console.warn('保存されたゲーム状態が不正です');
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('ゲーム状態の復元に失敗しました:', error);
    return null;
  }
}

/**
 * localStorageからゲーム状態を削除
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('ゲーム状態の削除に失敗しました:', error);
  }
}

/**
 * データがPersistedGameState型に準拠しているか検証
 */
export function validatePersistedGameState(data: any): data is PersistedGameState {
  if (!data || typeof data !== 'object') return false;
  
  // 必須フィールドの存在確認
  if (!data.board || !data.capturedPieces || !data.currentTurn ||
      !data.history || typeof data.currentIndex !== 'number' ||
      typeof data.version !== 'string' || typeof data.timestamp !== 'number') {
    return false;
  }
  
  // 型チェック
  if (!Array.isArray(data.board) || data.board.length !== 9) return false;
  if (!Array.isArray(data.history)) return false;
  if (data.currentTurn !== 'sente' && data.currentTurn !== 'gote') return false;
  
  // ビジネスルール
  if (data.currentIndex < 0 || data.currentIndex > data.history.length) return false;
  
  return true;
}
```

### Phase 3: ShogiBoard.tsx への統合

**ファイル**: `src/components/ShogiBoard.tsx`（変更箇所のみ）

```typescript
import { saveGameState, loadGameState } from '../logic/persistenceManager';

export function ShogiBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>(initialCapturedPieces);
  const [currentTurn, setCurrentTurn] = useState<Turn>('sente');
  const [history, setHistory] = useState<MoveHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 初回マウント時に状態を復元
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState.board);
      setCapturedPieces(savedState.capturedPieces);
      setCurrentTurn(savedState.currentTurn);
      setHistory(savedState.history);
      setCurrentIndex(savedState.currentIndex);
    }
  }, []); // 空の依存配列 = マウント時のみ実行

  // 状態変更時に自動保存
  useEffect(() => {
    // 初回マウント時の保存をスキップ
    if (history.length === 0) return;
    
    saveGameState({
      board,
      capturedPieces,
      currentTurn,
      history,
      currentIndex,
    });
  }, [board, capturedPieces, currentTurn, history, currentIndex]);

  // ... 残りのコンポーネントロジック
}
```

### Phase 4: テストの作成

**ファイル**: `tests/logic/persistenceManager.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveGameState, loadGameState, clearGameState, validatePersistedGameState } from '../../src/logic/persistenceManager';
import type { GameStateInput } from '../../src/types/persistence';

// テスト用のヘルパー関数
function createValidGameState(): GameStateInput {
  return {
    board: Array(9).fill(null).map(() => Array(9).fill(null)),
    capturedPieces: { sente: [], gote: [] },
    currentTurn: 'sente',
    history: [],
    currentIndex: 0,
  };
}

describe('persistenceManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveGameState', () => {
    it('正常に保存できる', () => {
      const state = createValidGameState();
      expect(saveGameState(state)).toBe(true);
      
      const saved = localStorage.getItem('kifunarabe:gameState');
      expect(saved).not.toBeNull();
    });
  });

  describe('loadGameState', () => {
    it('正常に復元できる', () => {
      const state = createValidGameState();
      saveGameState(state);
      
      const loaded = loadGameState();
      expect(loaded).not.toBeNull();
      expect(loaded?.board).toEqual(state.board);
    });

    it('データがない場合はnullを返す', () => {
      expect(loadGameState()).toBeNull();
    });
  });
  
  // 他のテストケース...
});
```

## テストの実行

```bash
# すべてのテストを実行
npm test

# 特定のファイルのみ
npm test persistenceManager.test.ts

# カバレッジ付き
npm test -- --coverage
```

## 動作確認

### 1. 基本的な保存・復元

1. アプリを開く
2. 駒を数手動かす
3. ブラウザの開発者ツール（F12）を開く
4. Application → Local Storage → `kifunarabe:gameState` を確認
5. ブラウザタブを閉じる
6. 再度アプリを開く
7. 閉じる前の盤面が復元されることを確認

### 2. 履歴ナビゲーション後の復元

1. アプリを開く
2. 駒を10手進める
3. 「戻る」ボタンで5手戻る
4. ブラウザタブを閉じる
5. 再度アプリを開く
6. 5手戻った局面が表示されることを確認
7. 「進む」ボタンで手を進められることを確認

### 3. エラーケース

1. ブラウザの開発者ツールを開く
2. Local Storageを手動で削除
3. ページをリロード
4. 初期配置が表示されることを確認（エラーなし）

## トラブルシューティング

### 状態が保存されない

**原因**: localStorage が無効化されている（プライベートモードなど）

**確認方法**:
```javascript
// ブラウザのコンソールで実行
console.log(typeof localStorage); // "object" なら有効
```

**対処**: 通常モードでブラウザを開く

### 状態が復元されない

**原因1**: 保存データが破損している

**確認方法**:
```javascript
// ブラウザのコンソールで実行
console.log(localStorage.getItem('kifunarabe:gameState'));
```

**対処**: Local Storageを手動でクリアして再度保存

**原因2**: バリデーションエラー

**確認方法**: ブラウザのコンソールで警告メッセージを確認

**対処**: データ構造を確認し、必要に応じて clearGameState() で削除

## パフォーマンス最適化（将来の拡張）

現時点では不要ですが、将来的に以下の最適化が可能です：

### デバウンスの追加

頻繁な保存による性能問題を避けるため、デバウンスを追加:

```typescript
import { useEffect, useRef } from 'react';

function useDebounce(callback: () => void, delay: number, deps: any[]) {
  const timeoutRef = useRef<number>();
  
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(callback, delay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);
}

// 使用例
useDebounce(() => {
  saveGameState({ board, capturedPieces, currentTurn, history, currentIndex });
}, 100, [board, capturedPieces, currentTurn, history, currentIndex]);
```

## まとめ

この機能により、ユーザーはブラウザを閉じても作業を失うことなく、シームレスに将棋アプリを使用できます。実装は既存のコードベースへの影響が最小限で、テストも容易です。
