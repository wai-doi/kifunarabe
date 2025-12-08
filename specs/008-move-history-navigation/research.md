# Research: 手順の巻き戻し・再生機能

**Feature**: 008-move-history-navigation
**Date**: 2025-12-08
**Phase**: 0 (Outline & Research)

## 技術的決定事項

### 1. 履歴管理の実装方式

**Decision**: React の useState を使用した配列ベースの履歴管理

**Rationale**:
- シンプルで理解しやすい実装
- React の標準的なパターンに準拠
- 追加ライブラリ不要で依存関係を増やさない
- 数百手程度の履歴であればメモリ効率も問題なし
- 既存のコードベースとの整合性が高い

**Alternatives Considered**:
1. **Redux/Zustand等の状態管理ライブラリ**
   - 却下理由: 現在のプロジェクト規模では過剰、新しい依存関係の追加は憲法の「シンプルさの追求」に反する
   - 将来的に複数コンポーネント間で複雑な状態共有が必要になれば検討

2. **Immer.js によるイミュータブル管理**
   - 却下理由: 現状の浅いコピーで十分、追加ライブラリは不要
   - React の標準的な spread operator で対応可能

3. **Command パターンによる Undo/Redo**
   - 却下理由: 将棋の手は完全な盤面スナップショットで管理する方がシンプル
   - 差分管理はバグの温床になりやすく、テストも複雑化

### 2. 履歴データ構造

**Decision**: 各手の完全な盤面状態をスナップショットとして保存

**Rationale**:
- 任意の手数への移動が O(1) で高速
- 実装がシンプルで、バグが入りにくい
- 盤面の復元ロジックが不要
- テストが容易（期待する盤面と比較するだけ）
- メモリ効率: 1手あたり約 1-2KB、100手でも 100-200KB 程度

**Alternatives Considered**:
1. **差分（Delta）管理**
   - 却下理由: 実装が複雑化、復元処理でバグが混入しやすい
   - メモリ節約効果は限定的（差分オブジェクトも構造を持つため）
   
2. **最初の状態 + 手順のみ記録して再計算**
   - 却下理由: 任意の手数への移動が O(n) になり遅い
   - SC-001（1秒以内の移動）を満たせない可能性

### 3. 履歴の途中から新手を指した場合の処理

**Decision**: それ以降の履歴を削除（分岐は作成しない）

**Rationale**:
- 仕様書 FR-012 で明示的に要求されている
- 実装がシンプル（配列の slice 操作のみ）
- ユーザーの期待動作と一致（一般的な Undo/Redo の挙動）
- 分岐管理は複雑性が大幅に増加

**Alternatives Considered**:
1. **分岐履歴の作成（ツリー構造）**
   - 却下理由: 仕様に含まれていない、UI の複雑化、憲法の YAGNI 原則に反する
   - 将来的な拡張として検討可能

### 4. パフォーマンス最適化

**Decision**: 基本実装で最適化は行わない、必要に応じて後から追加

**Rationale**:
- SC-003: 100手以上でも遅延なし → 基本的な配列操作で十分達成可能
- 深いコピーは不要（盤面状態は新しいオブジェクトとして管理）
- React の標準的な再レンダリング最適化（React.memo）で対応
- 憲法の「シンプルさの追求」に準拠

**Alternatives Considered**:
1. **メモ化・キャッシング**
   - 現時点では不要、パフォーマンス問題が実際に発生してから検討

2. **Virtual Scrolling（履歴リスト表示時）**
   - 現フェーズでは履歴リスト表示は含まれていない
   - 将来のフェーズで検討

### 5. ボタンの有効/無効化

**Decision**: React の状態に基づいた disabled 属性の制御

**Rationale**:
- シンプルで標準的なアプローチ
- アクセシビリティ対応が容易
- 視覚的なフィードバックが明確

**Implementation Pattern**:
```typescript
disabled={currentIndex === 0}  // 初手に戻る・一手戻る
disabled={currentIndex === history.length - 1}  // 最終手に進む・一手進む
```

### 6. テスト戦略

**Decision**: Vitest + Testing Library による単体テスト + コンポーネントテスト

**Test Coverage**:
1. **historyManager.ts の単体テスト**
   - 手の追加、ナビゲーション操作、履歴削除のロジック
   - エッジケース（空の履歴、境界値）

2. **NavigationControls.tsx のコンポーネントテスト**
   - ボタンのレンダリング
   - 有効/無効状態の切り替え
   - クリックイベントのハンドリング

3. **ShogiBoard.tsx の統合テスト**
   - 手を指した後の履歴記録
   - ナビゲーション操作後の盤面復元
   - 履歴途中からの新手による履歴削除

**Rationale**:
- TDD（テスト駆動開発）の憲法原則に準拠
- 仕様書の Acceptance Scenarios を直接テストケースに変換
- リグレッション防止

## ベストプラクティス

### React での Undo/Redo パターン

**参考**: React 公式ドキュメント - State Management Patterns

**Key Points**:
1. 状態の履歴は配列で管理
2. 現在位置はインデックスで追跡
3. 新しいアクションは現在位置以降を削除してから追加
4. イミュータブルな更新パターンを使用

### TypeScript 型定義

**参考**: TypeScript Handbook - Utility Types

**Key Points**:
1. 履歴エントリの型を明確に定義
2. readonly 修飾子で意図しない変更を防止
3. Omit や Pick などのユーティリティ型を活用

### アクセシビリティ

**参考**: ARIA Authoring Practices Guide - Button

**Key Points**:
1. ボタンには適切な aria-label を設定
2. キーボード操作（矢印キーなど）のサポート（将来の拡張）
3. disabled 状態の視覚的・論理的な一貫性

## 統合パターン

### 既存コードとの統合

**ShogiBoard.tsx の変更**:
1. 履歴状態の追加（useState）
2. 手を指すハンドラーの修正（履歴記録）
3. ナビゲーションハンドラーの追加
4. 現在の盤面状態を履歴から復元

**最小限の変更で既存機能への影響を抑える**:
- 既存の駒移動・取り合い・成り・持ち駒打ちのロジックは変更不要
- 盤面状態を履歴に記録するだけの薄いラッパー
- 既存のテストが引き続き動作することを確認

## リスクと対策

| リスク | 影響度 | 対策 |
|--------|--------|------|
| メモリ使用量の増加 | 低 | 100手程度では問題なし、将来的に上限設定を検討 |
| 履歴途中からの新手による意図しない履歴削除 | 中 | 確認ダイアログは現フェーズでは不要（仕様に含まれていない） |
| 盤面復元時の状態不整合 | 高 | 完全なスナップショット保存で防止、テストで検証 |

## 実装順序（推奨）

1. **型定義の追加** (`types/history.ts`)
2. **履歴管理ロジックの実装とテスト** (`logic/historyManager.ts`)
3. **NavigationControls コンポーネントの実装とテスト**
4. **ShogiBoard への統合**
5. **エンドツーエンドの動作確認**

## 参考資料

- React 公式ドキュメント: https://react.dev/learn/managing-state
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- 既存実装: `specs/003-piece-movement/`, `specs/005-piece-capture/`, `specs/007-piece-promotion/`
