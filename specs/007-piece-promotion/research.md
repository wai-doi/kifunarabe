# Research: 駒の成り機能

**Feature**: 007-piece-promotion
**Date**: 2025-11-30

## 調査項目

### 1. 成り条件の判定ロジック

**Decision**: 移動元と移動先の両方をチェックして成り条件を判定する

**Rationale**: 
将棋の正式ルールでは以下の3つの条件で成りが可能:
1. 敵陣外から敵陣内への移動（敵陣に入る）
2. 敵陣内から敵陣外への移動（敵陣から出る）
3. 敵陣内での移動（敵陣内で動く）

これらすべてをカバーするため、移動元と移動先の両方が敵陣かどうかをチェックする必要がある。

**Alternatives considered**:
- 移動先のみチェック → 敵陣から出る場合を検出できない
- 移動元のみチェック → 敵陣に入る場合を検出できない

### 2. 敵陣の定義

**Decision**: プレイヤーに応じて敵陣の段を動的に判定する

**Rationale**:
- 先手の敵陣: 7〜9段目（rank >= 7）
- 後手の敵陣: 1〜3段目（rank <= 3）

シンプルな関数で判定可能:
```typescript
function isInEnemyTerritory(rank: number, player: Player): boolean {
  return player === 'sente' ? rank >= 7 : rank <= 3;
}
```

**Alternatives considered**:
- 定数配列で定義 → 不要な複雑性
- オブジェクトマッピング → シンプルな条件式で十分

### 3. 強制成りの判定

**Decision**: 駒種と移動先の段で強制成りを判定する

**Rationale**:
行き場所がなくなる駒は強制的に成る必要がある:
- 歩・香: 最奥段（先手は9段目、後手は1段目）
- 桂馬: 最奥2段（先手は8-9段目、後手は1-2段目）

**Implementation**:
```typescript
function mustPromote(piece: Piece, toRank: number): boolean {
  const isSente = piece.player === 'sente';
  const lastRank = isSente ? 9 : 1;
  const secondLastRank = isSente ? 8 : 2;
  
  if (piece.type === '歩' || piece.type === '香') {
    return toRank === lastRank;
  }
  if (piece.type === '桂') {
    return isSente ? toRank >= secondLastRank : toRank <= secondLastRank;
  }
  return false;
}
```

**Alternatives considered**:
- 移動可能マスが0になったら強制成り → 計算コストが高い
- テーブル参照 → 動的計算で十分シンプル

### 4. 成れない駒の判定

**Decision**: 成れない駒種をセットで管理する

**Rationale**:
金将と王将/玉将は成れない。シンプルなセットで判定:

```typescript
const NON_PROMOTABLE_TYPES: Set<PieceType> = new Set(['金', '王', '玉']);

function canPromote(piece: Piece): boolean {
  return !piece.promoted && !NON_PROMOTABLE_TYPES.has(piece.type);
}
```

**Alternatives considered**:
- 成れる駒種のセット → 成れる駒の方が多いので非効率
- switch文 → Setの方が拡張性が高い

### 5. 成り駒の移動パターン

**Decision**: 既存のMOVE_PATTERNS定数を拡張して成り駒パターンを追加

**Rationale**:
成り駒の移動パターン:
- と金（歩）、杏（香）、圭（桂）、全（銀）: 金将と同じ動き
- 竜（飛車）: 飛車の動き + 斜め1マス
- 馬（角）: 角の動き + 縦横1マス

既存のcalculateValidMoves関数を修正し、promotedフラグに応じて適切なパターンを使用する。

**Implementation approach**:
```typescript
const PROMOTED_MOVE_PATTERNS: Record<PieceType, MovePattern> = {
  歩: MOVE_PATTERNS.金,
  香: MOVE_PATTERNS.金,
  桂: MOVE_PATTERNS.金,
  銀: MOVE_PATTERNS.金,
  飛: { /* 飛車 + 斜め1マス */ },
  角: { /* 角 + 縦横1マス */ },
  // 金、王、玉は成れないのでN/A
};
```

**Alternatives considered**:
- 新しいPieceTypeを追加（'と', '杏'等）→ 持ち駒時の元駒種管理が複雑化
- 別の型で管理 → 既存コードへの影響が大きい

### 6. 成り選択UIの実装方法

**Decision**: Reactのポータルを使用してマス目付近にポップアップ表示

**Rationale**:
- 移動先のマス目の位置を基準にポップアップを配置
- z-indexで他の要素より前面に表示
- 成る/成らないの2ボタンを配置
- 選択されるまで他の操作をブロック

**Implementation approach**:
```typescript
interface PromotionDialogProps {
  position: Position;        // 移動先のマス目
  onPromote: () => void;     // 成るを選択
  onDecline: () => void;     // 成らないを選択
}
```

**Alternatives considered**:
- モーダルダイアログ（中央表示）→ 視線移動が大きくなる
- 固定位置バナー → 直感的でない

### 7. 成り駒の表示文字マッピング

**Decision**: 駒種と成り状態から表示文字を導出する関数を作成

**Rationale**:
一文字表示で統一（Clarificationsで決定済み）:

```typescript
const PROMOTED_DISPLAY: Record<PieceType, string> = {
  歩: 'と',
  香: '杏',
  桂: '圭',
  銀: '全',
  飛: '竜',
  角: '馬',
};

function getPieceDisplay(piece: Piece): string {
  if (piece.promoted && PROMOTED_DISPLAY[piece.type]) {
    return PROMOTED_DISPLAY[piece.type];
  }
  return piece.type;
}
```

**Alternatives considered**:
- 二文字表示 → UIの一貫性のため却下
- PieceTypeに成り駒を追加 → 持ち駒管理が複雑化

### 8. 成り駒が取られた場合の処理

**Decision**: 持ち駒に追加する際にpromotedフラグをfalseにリセット

**Rationale**:
将棋のルールでは、成り駒が取られると元の駒種に戻る。データ構造上は同じPieceTypeを使用しているので、promotedフラグをfalseにするだけで実現可能。

既存のcaptureLogicを修正:
```typescript
function capturePiece(piece: Piece): Piece {
  return {
    ...piece,
    promoted: false,  // 成り状態をリセット
    player: opponent(piece.player),
  };
}
```

**Alternatives considered**:
- 新しい駒インスタンスを作成 → 現在のアプローチで十分

## 結論

すべての調査項目で明確な方針が決定された。NEEDS CLARIFICATIONは存在しない。
既存のコード構造を最大限活用し、シンプルな拡張アプローチで実装可能。
