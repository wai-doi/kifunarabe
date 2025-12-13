# Quickstart: 駒クリック時の選択ハイライト表示

**Feature**: 013-piece-click-highlight
**Date**: 2025年12月14日
**想定時間**: 2-3時間

## 概要

盤上の駒をクリックしたときに、現在の手番で動かせる駒のみオレンジ色の枠を表示する機能を実装します。このガイドでは、TDD（テスト駆動開発）に従って実装を進めます。

## 前提条件

- Node.js 18以上がインストールされている
- プロジェクトのクローンと依存関係のインストールが完了している
- ブランチ `013-piece-click-highlight` にチェックアウト済み

```bash
git checkout 013-piece-click-highlight
npm install
```

## 実装ステップ

### ステップ1: 選択可否判定ロジックのテスト作成（Red）

**目的**: `canSelectPiece` 関数のテストを作成し、失敗することを確認

**ファイル**: `tests/logic/selectionLogic.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { canSelectPiece } from '../../src/logic/selectionLogic';
import type { Piece } from '../../src/types/piece';
import type { Turn } from '../../src/types/turn';

describe('selectionLogic', () => {
  describe('canSelectPiece', () => {
    it('空マス（null）の場合はfalseを返す', () => {
      const result = canSelectPiece(null, 'sente');
      expect(result).toBe(false);
    });

    it('先手の手番で先手の駒の場合はtrueを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 7,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'sente');
      expect(result).toBe(true);
    });

    it('先手の手番で後手の駒の場合はfalseを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'gote',
        file: 5,
        rank: 3,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'sente');
      expect(result).toBe(false);
    });

    it('後手の手番で後手の駒の場合はtrueを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'gote',
        file: 5,
        rank: 3,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'gote');
      expect(result).toBe(true);
    });

    it('後手の手番で先手の駒の場合はfalseを返す', () => {
      const piece: Piece = {
        type: '歩',
        player: 'sente',
        file: 5,
        rank: 7,
        promoted: false,
      };
      const result = canSelectPiece(piece, 'gote');
      expect(result).toBe(false);
    });
  });
});
```

**実行**:

```bash
npm test -- selectionLogic.test.ts
```

**期待される結果**: テストが失敗する（ファイルが存在しないため）

---

### ステップ2: 選択可否判定ロジックの実装（Green）

**目的**: テストを通すための最小限の実装

**ファイル**: `src/logic/selectionLogic.ts`

```typescript
import type { Piece } from '../types/piece';
import type { Turn } from '../types/turn';

/**
 * 駒が現在の手番で選択可能かを判定
 * @param piece - 判定対象の駒（nullの場合は空マス）
 * @param currentTurn - 現在の手番
 * @returns 選択可能な場合true
 */
export function canSelectPiece(piece: Piece | null, currentTurn: Turn): boolean {
  if (piece === null) {
    return false; // 空マスは選択不可
  }
  return piece.player === currentTurn; // 手番のプレイヤーの駒のみ選択可能
}
```

**実行**:

```bash
npm test -- selectionLogic.test.ts
```

**期待される結果**: すべてのテストが通る ✓

---

### ステップ3: Squareコンポーネントのスタイル変更テスト作成（Red）

**目的**: 選択時の枠色がオレンジになることをテストで確認

**ファイル**: `tests/components/Square.test.tsx`（既存ファイルに追加）

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Square from '../../src/components/Square';

describe('Square - 選択枠のスタイル', () => {
  it('選択状態のときオレンジの枠が表示される', () => {
    const piece = {
      type: '歩' as const,
      player: 'sente' as const,
      file: 5,
      rank: 7,
      promoted: false,
    };

    render(
      <Square
        piece={piece}
        position={{ file: 5, rank: 7 }}
        isSelected={true}
        onClick={() => {}}
      />
    );

    const square = screen.getByRole('button');
    expect(square).toHaveClass('border-4');
    expect(square).toHaveClass('border-orange-600');
  });

  it('非選択状態のときオレンジの枠は表示されない', () => {
    const piece = {
      type: '歩' as const,
      player: 'sente' as const,
      file: 5,
      rank: 7,
      promoted: false,
    };

    render(
      <Square
        piece={piece}
        position={{ file: 5, rank: 7 }}
        isSelected={false}
        onClick={() => {}}
      />
    );

    const square = screen.getByRole('button');
    expect(square).not.toHaveClass('border-orange-600');
  });
});
```

**実行**:

```bash
npm test -- Square.test.tsx
```

**期待される結果**: テストが失敗する（まだ実装していないため）

---

### ステップ4: Squareコンポーネントのスタイル変更実装（Green）

**目的**: 選択時の枠色をオレンジに変更

**ファイル**: `src/components/Square.tsx`

既存のコードで枠のスタイルを適用している箇所を見つけ、以下のように変更します：

```typescript
// 変更前の例（既存コードの該当部分を特定してください）
const borderClass = isSelected ? 'border-2 border-black' : 'border border-gray-400';

// 変更後
const borderClass = isSelected 
  ? 'border-4 border-orange-600'  // オレンジの太枠
  : 'border border-gray-400';      // 通常の細枠
```

**実行**:

```bash
npm test -- Square.test.tsx
```

**期待される結果**: すべてのテストが通る ✓

---

### ステップ5: ShogiBoardコンポーネントの統合テスト作成（Red）

**目的**: クリック時の選択可否判定が正しく動作することを確認

**ファイル**: `tests/components/ShogiBoard.test.tsx`（既存ファイルに追加）

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShogiBoard from '../../src/components/ShogiBoard';

describe('ShogiBoard - 駒選択の手番制限', () => {
  it('先手の番で先手の駒をクリックすると選択される', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);

    // 初期状態は先手の番
    // 先手の歩（5七）をクリック
    const squares = screen.getAllByRole('button');
    const targetSquare = squares.find(/* 5七のマスを特定 */);
    
    await user.click(targetSquare!);

    // 選択枠が表示されることを確認
    expect(targetSquare).toHaveClass('border-orange-600');
  });

  it('先手の番で後手の駒をクリックしても選択されない', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);

    // 初期状態は先手の番
    // 後手の歩（5三）をクリック
    const squares = screen.getAllByRole('button');
    const targetSquare = squares.find(/* 5三のマスを特定 */);
    
    await user.click(targetSquare!);

    // 選択枠が表示されないことを確認
    expect(targetSquare).not.toHaveClass('border-orange-600');
  });

  it('空マスをクリックしても選択されない', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);

    // 空のマス（5五など）をクリック
    const squares = screen.getAllByRole('button');
    const emptySquare = squares.find(/* 空マスを特定 */);
    
    await user.click(emptySquare!);

    // 選択枠が表示されないことを確認
    expect(emptySquare).not.toHaveClass('border-orange-600');
  });
});
```

**注**: マスの特定方法は既存のテストコードを参考にしてください。

**実行**:

```bash
npm test -- ShogiBoard.test.tsx
```

**期待される結果**: テストが失敗する（まだ統合していないため）

---

### ステップ6: ShogiBoardコンポーネントへの統合（Green）

**目的**: `canSelectPiece` を使用して選択可否を判定

**ファイル**: `src/components/ShogiBoard.tsx`

`handleSquareClick` 関数を以下のように変更します：

```typescript
import { canSelectPiece } from '../logic/selectionLogic';

// ... 他のコード ...

const handleSquareClick = (position: Position) => {
  const clickedPiece = pieces.find(
    (p) => p.file === position.file && p.rank === position.rank
  ) ?? null;

  // ====== 新規追加: 選択可否判定 ======
  if (!canSelectPiece(clickedPiece, currentTurn)) {
    // 選択不可能な駒または空マス → 何もしない
    return;
  }
  // ===================================

  // 既存の選択ロジック（以下は変更なし）
  // 選択可能な駒の場合のみ実行される
  if (selection && isBoardSelection(selection)) {
    // 既に駒が選択されている場合の処理
    // ...
  } else {
    // 新規選択の処理
    setSelection({ type: 'board', position });
  }
};
```

**実行**:

```bash
npm test -- ShogiBoard.test.tsx
npm test  # 全体のテストも実行して回帰がないか確認
```

**期待される結果**: すべてのテストが通る ✓

---

### ステップ7: 手動テストと動作確認

**開発サーバーの起動**:

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

**確認項目**:

1. ✅ 先手の駒をクリックすると、オレンジ色の太い枠が表示される
2. ✅ 後手の駒をクリックしても、何も起こらない（枠が出ない）
3. ✅ 空マスをクリックしても、何も起こらない
4. ✅ 駒を移動すると、枠が消える
5. ✅ 手番が切り替わると、前の選択が解除される
6. ✅ 後手の番になると、後手の駒のみ選択できる

**視覚的確認**:
- 枠の色が明るいオレンジ色（#EA580C）である
- 枠が4px幅で目立つ
- 盤面の背景色と明確に区別できる

---

### ステップ8: コード品質チェック

**Lintとフォーマットの実行**:

```bash
npm run check
```

**期待される結果**: エラーや警告がないこと

エラーがある場合は修正してください：

```bash
npm run format  # 自動フォーマット
npm run lint    # Lint確認
```

---

## トラブルシューティング

### テストが失敗する

**症状**: `canSelectPiece` 関数のテストが失敗する

**解決策**:
1. `src/logic/selectionLogic.ts` のロジックを確認
2. `piece === null` のチェックが最初にあるか確認
3. `piece.player === currentTurn` の条件が正しいか確認

### 枠が表示されない

**症状**: 駒をクリックしても枠が表示されない

**解決策**:
1. ブラウザの開発者ツールで要素を検証
2. `border-4 border-orange-600` クラスが適用されているか確認
3. `isSelected` プロップが正しく渡されているか確認
4. `handleSquareClick` で `canSelectPiece` が正しく呼ばれているか確認

### すべての駒が選択できてしまう

**症状**: 相手の駒も選択できてしまう

**解決策**:
1. `handleSquareClick` で `canSelectPiece` のチェックを追加したか確認
2. 早期リターン（`return`）が正しく機能しているか確認

## 次のステップ

実装が完了したら：

1. **コミット**:
   ```bash
   git add .
   git commit -m "feat: 駒クリック時の選択ハイライト表示機能を実装"
   ```

2. **プッシュ**:
   ```bash
   git push origin 013-piece-click-highlight
   ```

3. **プルリクエスト作成**: GitHubでPRを作成し、レビューを依頼

4. **ドキュメント更新**: `.github/copilot-instructions.md` を更新（自動化スクリプトがある場合は実行）

## 参考リンク

- [Tailwind CSS - Border Color](https://tailwindcss.com/docs/border-color)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 完了チェックリスト

- [ ] すべての単体テストが通る
- [ ] すべての統合テストが通る
- [ ] 手動テストで5つの確認項目すべてクリア
- [ ] `npm run check` がエラーなく完了
- [ ] ブラウザで視覚的に正しく動作することを確認
- [ ] 憲法の日本語優先原則に従ってコメントを記述
- [ ] コミットメッセージが日本語で記述されている
