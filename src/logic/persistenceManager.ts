import type { GameStateInput, PersistedGameState } from '../types/persistence';
import type { Turn } from '../types/turn';

/**
 * localStorageのキー名
 * プレフィックス（kifunarabe:）でアプリ固有の名前空間を確保
 */
const STORAGE_KEY = 'kifunarabe:gameState' as const;

/**
 * データ形式の現在のバージョン
 * セマンティックバージョニングで管理
 */
const CURRENT_VERSION = '1.0.0' as const;

/**
 * ゲーム状態をlocalStorageに保存する
 *
 * 駒を動かすたび、手番が変わるたびに自動的に呼び出され、
 * ユーザーの操作を意識させずに状態を永続化します。
 *
 * @param state - 保存するゲーム状態（versionとtimestampは自動付与）
 * @returns 保存成功時はtrue、失敗時はfalse
 *
 * @example
 * ```typescript
 * const success = saveGameState({
 *   pieces: currentPieces,
 *   capturedPieces: currentCapturedPieces,
 *   currentTurn: 'sente',
 *   history: moveHistory,
 *   currentIndex: 5
 * });
 * ```
 */
export function saveGameState(state: GameStateInput): boolean {
  try {
    // localStorageが利用可能かチェック
    if (typeof localStorage === 'undefined' || localStorage === null) {
      console.warn('[persistenceManager] localStorage is not available');
      return false;
    }

    // versionとtimestampを付与してPersistedGameStateを構築
    const persistedState: PersistedGameState = {
      ...state,
      version: CURRENT_VERSION,
      timestamp: Date.now(),
    };

    // JSON文字列に変換
    const jsonString = JSON.stringify(persistedState);

    // localStorageに保存
    localStorage.setItem(STORAGE_KEY, jsonString);

    return true;
  } catch (error) {
    // 容量超過やその他のエラー
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('[persistenceManager] localStorage quota exceeded');
      } else {
        console.warn('[persistenceManager] Failed to save game state:', error.message);
      }
    } else {
      console.warn('[persistenceManager] Failed to save game state:', error);
    }
    return false;
  }
}

/**
 * localStorageからゲーム状態を復元する
 *
 * アプリ起動時に一度だけ呼び出され、前回のセッションで
 * 保存された状態を復元します。データがない場合や無効な
 * データの場合はnullを返し、初期配置から開始します。
 *
 * @returns 復元成功時はPersistedGameState、失敗時はnull
 *
 * @example
 * ```typescript
 * const savedState = loadGameState();
 * if (savedState) {
 *   // 状態を復元
 *   setPieces(savedState.pieces);
 *   setHistory(savedState.history);
 * }
 * ```
 */
export function loadGameState(): PersistedGameState | null {
  try {
    // localStorageが利用可能かチェック
    if (typeof localStorage === 'undefined' || localStorage === null) {
      console.warn('[persistenceManager] localStorage is not available');
      return null;
    }

    // localStorageから読み取り
    const jsonString = localStorage.getItem(STORAGE_KEY);

    // データが存在しない場合（正常ケース）
    if (jsonString === null) {
      return null;
    }

    // JSON文字列をパース
    const data = JSON.parse(jsonString);

    // バリデーション
    if (!validatePersistedGameState(data)) {
      console.warn('[persistenceManager] Invalid persisted game state');
      return null;
    }

    return data;
  } catch (error) {
    // パースエラーやその他のエラー
    if (error instanceof Error) {
      console.warn('[persistenceManager] Failed to load game state:', error.message);
    } else {
      console.warn('[persistenceManager] Failed to load game state:', error);
    }
    return null;
  }
}

/**
 * localStorageからゲーム状態を削除する
 *
 * ゲームをリセットする際などに使用します。
 * 現在は手動での使用を想定していますが、将来的には
 * リセットボタンなどのUI機能と連携する可能性があります。
 */
export function clearGameState(): void {
  try {
    // localStorageが利用可能かチェック
    if (typeof localStorage === 'undefined' || localStorage === null) {
      console.warn('[persistenceManager] localStorage is not available');
      return;
    }

    // localStorageから削除
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // エラー時は警告ログを出力
    if (error instanceof Error) {
      console.warn('[persistenceManager] Failed to clear game state:', error.message);
    } else {
      console.warn('[persistenceManager] Failed to clear game state:', error);
    }
  }
}

/**
 * 復元したデータがPersistedGameState型に準拠しているか検証する
 *
 * localStorageから読み込んだデータが正しい形式かを厳密にチェックし、
 * 破損したデータや古いバージョンのデータを弾きます。
 * TypeScriptの型ガードとして機能し、検証後は型安全に使用できます。
 *
 * @param data - 検証対象のデータ（any型）
 * @returns データが有効な場合はtrue、無効な場合はfalse
 *
 * 検証項目:
 * - 必須フィールドの存在（7フィールド）
 * - 各フィールドの型チェック
 * - currentIndexが範囲内（0 <= currentIndex <= history.length）
 * - currentTurnが"sente"または"gote"
 */
export function validatePersistedGameState(data: unknown): data is PersistedGameState {
  // nullまたはundefinedチェック
  if (data === null || data === undefined) {
    return false;
  }

  // オブジェクトであることを確認
  if (typeof data !== 'object') {
    return false;
  }

  // 必須フィールドの存在確認
  const requiredFields = [
    'pieces',
    'capturedPieces',
    'currentTurn',
    'history',
    'currentIndex',
    'version',
    'timestamp',
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      return false;
    }
  }

  // 型アサーションで一時的に Record<string, unknown> として扱う
  const record = data as Record<string, unknown>;

  // 型チェック: pieces は配列
  if (!Array.isArray(record.pieces)) {
    return false;
  }

  // 型チェック: capturedPieces は sente と gote プロパティを持つオブジェクト
  if (
    typeof record.capturedPieces !== 'object' ||
    record.capturedPieces === null ||
    !('sente' in record.capturedPieces) ||
    !('gote' in record.capturedPieces)
  ) {
    return false;
  }

  // 型チェック: currentTurn は "sente" または "gote"
  const validTurns: Turn[] = ['sente', 'gote'];
  if (!validTurns.includes(record.currentTurn as Turn)) {
    return false;
  }

  // 型チェック: history は配列
  if (!Array.isArray(record.history)) {
    return false;
  }

  // 型チェック: currentIndex は数値
  if (typeof record.currentIndex !== 'number') {
    return false;
  }

  // ビジネスルール: currentIndex は 0 以上かつ history.length 以下
  if (record.currentIndex < 0 || record.currentIndex > record.history.length) {
    return false;
  }

  // 型チェック: version は文字列
  if (typeof record.version !== 'string') {
    return false;
  }

  // 型チェック: timestamp は数値
  if (typeof record.timestamp !== 'number') {
    return false;
  }

  return true;
}
