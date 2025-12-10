# Data Model: 二歩禁止ルール

**Feature**: 010-prevent-double-pawn
**Date**: 2025-12-10
**Status**: Draft

## Overview

このドキュメントは二歩禁止ルールの実装に関連するデータモデルを定義します。既存の型定義を活用しつつ、検証結果とエラー情報を表現する新しい型を導入します。

## 既存のエンティティ（参照のみ）

### Piece（駒）

```typescript
interface Piece {
  type: PieceType;      // 駒の種類（'歩', '角', etc.）
  player: Player;       // 所有プレイヤー（'sente' | 'gote'）
  file: number;         // 筋（1-9）
  rank: number;         // 段（1-9）
  promoted: boolean;    // 成り状態
}
```

**役割**: 盤面上の駒を表現。二歩判定では`type`、`player`、`file`、`promoted`を使用。

### Position（位置）

```typescript
interface Position {
  file: number;  // 筋（1-9）
  rank: number;  // 段（1-9）
}
```

**役割**: 盤面上の位置を表現。駒を打とうとする位置の指定に使用。

### PieceType（駒種）

```typescript
type PieceType = '王' | '玉' | '飛' | '角' | '金' | '銀' | '桂' | '香' | '歩';
```

**役割**: 駒の種類を定義。二歩判定では`'歩'`のみが対象。

### Player（プレイヤー）

```typescript
type Player = 'sente' | 'gote';
```

**役割**: 先手または後手を表現。二歩判定はプレイヤーごとに独立して行う。

## 新規エンティティ

### ValidationResult（検証結果）

```typescript
interface ValidationResult {
  /** 検証が成功したか（trueなら打てる、falseなら打てない） */
  isValid: boolean;
  
  /** 検証失敗時のエラーコード（成功時はundefined） */
  errorCode?: ValidationErrorCode;
  
  /** エラーメッセージ（成功時はundefined） */
  errorMessage?: string;
}
```

**役割**: 二歩検証の結果を構造化して返す。成功・失敗の判定とエラー情報を含む。

**フィールド詳細**:
- `isValid`: 検証結果の真偽値。UIレイヤーでの分岐に使用
- `errorCode`: エラーの種類を識別するコード。ログ記録や将来の多言語対応に使用
- `errorMessage`: ユーザーに表示する日本語のエラーメッセージ

**使用例**:
```typescript
// 成功ケース
{ isValid: true }

// 失敗ケース
{
  isValid: false,
  errorCode: 'DOUBLE_PAWN',
  errorMessage: '二歩は反則です'
}
```

### ValidationErrorCode（検証エラーコード）

```typescript
type ValidationErrorCode = 
  | 'DOUBLE_PAWN'          // 二歩
  | 'OUT_OF_BOARD'         // 盤面外
  | 'SQUARE_OCCUPIED';     // マスが既に占有されている
```

**役割**: エラーの種類を識別するための列挙型。

**値の定義**:
- `DOUBLE_PAWN`: 同じ筋に未成の歩が既に存在する
- `OUT_OF_BOARD`: 打とうとした位置が盤面外
- `SQUARE_OCCUPIED`: 打とうとした位置に既に駒がある

**Rationale**: 
- 文字列リテラル型で定義することで、タイプセーフなエラーハンドリングが可能
- 将来的に他の反則ルール（打ち歩詰めなど）を追加する際に拡張しやすい

### DoublePawnCheckParams（二歩チェックパラメータ）

```typescript
interface DoublePawnCheckParams {
  /** 盤面上の全ての駒 */
  pieces: Piece[];
  
  /** 打とうとしている筋（1-9） */
  file: number;
  
  /** 打とうとしているプレイヤー */
  player: Player;
}
```

**役割**: 二歩判定関数への入力パラメータを構造化。

**フィールド詳細**:
- `pieces`: 現在の盤面状態。履歴ナビゲーション時は過去の盤面が渡される
- `file`: 打とうとしている筋（1-9）
- `player`: 打とうとしているプレイヤー（先手または後手）

**Rationale**: 
- パラメータをオブジェクトにまとめることで、将来的な拡張が容易
- 関数呼び出し時の可読性が向上

## エンティティ間の関係

```text
┌─────────────────┐
│  Piece[]        │  盤面上の全ての駒
└────────┬────────┘
         │
         ├─ filter by file ─────┐
         ├─ filter by player ───┤
         └─ filter by type='歩'─┤
                                 ▼
                    ┌────────────────────────┐
                    │ DoublePawnCheckParams  │
                    └────────┬───────────────┘
                             │
                             ▼
                   hasUnpromotedPawnInFile()
                             │
                             ▼
                    ┌────────────────────┐
                    │ ValidationResult   │
                    │  - isValid         │
                    │  - errorCode       │
                    │  - errorMessage    │
                    └────────────────────┘
```

**関係の説明**:
1. `Piece[]`（盤面の駒リスト）が入力
2. 筋、プレイヤー、駒種でフィルタリング
3. `DoublePawnCheckParams`として構造化
4. `hasUnpromotedPawnInFile()`関数で判定
5. `ValidationResult`として結果を返す

## 状態遷移

### 二歩判定の状態フロー

```text
[持ち駒の歩を選択]
         │
         ▼
  ┌──────────────┐
  │ 全ての空き   │
  │ マスを取得   │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ 各マスで     │◄── for each square
  │ 二歩判定     │
  └──────┬───────┘
         │
         ├─ isValid=true ─┐
         │                 │
         └─ isValid=false ─┤
                           ▼
              ┌────────────────────┐
              │ 打てるマスのリスト │
              └────────┬───────────┘
                       │
                       ▼
              [ハイライト表示]
```

### 駒を打つ際の検証フロー

```text
[マスをクリック]
         │
         ▼
  ┌──────────────┐
  │ canDropPiece │
  │ (拡張版)     │
  └──────┬───────┘
         │
         ├─ 盤面外チェック
         ├─ 占有チェック
         └─ 二歩チェック（歩の場合のみ）
                 │
                 ├─ isValid=true ──┐
                 │                  │
                 └─ isValid=false ─┤
                                    ▼
                        ┌───────────────────┐
                        │ ValidationResult  │
                        └────────┬──────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              isValid=true              isValid=false
                    │                         │
                    ▼                         ▼
            [駒を配置]              [エラーメッセージ表示]
            [手番交代]              [手番維持]
```

## データの永続化

**該当なし**: このフィーチャーではデータの永続化は行いません。全ての検証は現在のメモリ内の盤面状態に対して実行されます。

**理由**: 
- 二歩判定は現在の盤面状態から導出可能
- 履歴機能（008-move-history-navigation）により、過去の盤面状態は既に保存されている
- 追加の永続化層を導入する必要はない

## バリデーションルール

### 筋（file）の範囲

- **値**: 1 から 9 までの整数
- **検証**: `file >= 1 && file <= 9`
- **エラー時**: `OUT_OF_BOARD`エラー

### プレイヤー（player）

- **値**: `'sente'` または `'gote'`
- **検証**: TypeScriptの型システムで保証
- **エラー時**: コンパイルエラー

### 駒種（type）

- **値**: PieceType型に定義された値のみ
- **検証**: TypeScriptの型システムで保証
- **二歩判定対象**: `type === '歩'` のみ

### 成り状態（promoted）

- **値**: `boolean`
- **二歩判定**: `promoted === false` の歩のみをカウント
- **ルール**: 成り駒（と金など）は歩としてカウントしない

## パフォーマンス考慮事項

### 計算量

- **二歩判定**: O(n)、nは盤面の駒数（最大40個程度）
- **打てるマスの計算**: O(m × n)、mは空きマスの数（最大81個）

### 最適化戦略

1. **早期リターン**: 歩以外の駒を打つ場合は二歩判定をスキップ
2. **メモ化**: Reactの`useMemo`を使用して、不要な再計算を防ぐ
3. **フィルタリング最適化**: `Array.some()`を使用し、最初のマッチで即座にリターン

### 性能要件

- **目標**: 二歩検証は50ミリ秒以内で完了（成功基準SC-004）
- **実測予想**: 1-5ミリ秒程度（モダンブラウザ、40駒の場合）

## まとめ

このデータモデルは、既存の型定義を最大限活用しつつ、二歩検証に必要な最小限の新しい型を導入します。`ValidationResult`により検証結果を構造化し、エラーハンドリングを一貫性のある方法で実装できます。全てのエンティティはイミュータブルなデータ構造として扱われ、Reactの状態管理パターンと自然に統合されます。
