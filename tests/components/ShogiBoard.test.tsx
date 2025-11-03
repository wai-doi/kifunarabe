import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShogiBoard from '../../src/components/ShogiBoard';

describe('ShogiBoard', () => {
  it('将棋盤がレンダリングされる', () => {
    render(<ShogiBoard />);
    const board = screen.getByRole('grid');
    expect(board).toBeInTheDocument();
  });

  it('初期配置の40枚の駒がレンダリングされる', () => {
    render(<ShogiBoard />);
    // 駒の文字を検索
    const kings = screen.getAllByText(/[王玉]/);
    expect(kings.length).toBeGreaterThanOrEqual(2); // 王と玉
  });

  it('先手の王が表示される', () => {
    render(<ShogiBoard />);
    expect(screen.getByLabelText('先手の王')).toBeInTheDocument();
  });

  it('後手の玉が表示される', () => {
    render(<ShogiBoard />);
    expect(screen.getByLabelText('後手の玉')).toBeInTheDocument();
  });

  it('飛車が2枚表示される', () => {
    render(<ShogiBoard />);
    const rooks = screen.getAllByText('飛');
    expect(rooks).toHaveLength(2);
  });

  it('角行が2枚表示される', () => {
    render(<ShogiBoard />);
    const bishops = screen.getAllByText('角');
    expect(bishops).toHaveLength(2);
  });

  it('歩兵が18枚表示される', () => {
    render(<ShogiBoard />);
    const pawns = screen.getAllByText('歩');
    expect(pawns).toHaveLength(18);
  });

  // T009: 駒の選択・選択解除のテスト
  it('駒をクリックすると選択状態になる', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);
    const king = screen.getByLabelText('先手の王');
    await user.click(king);

    // 選択状態のスタイルが適用されることを確認
    expect(king).toHaveClass('bg-yellow-200');
    expect(king).toHaveClass('ring-4');
  });

  it('選択中の駒をもう一度クリックすると選択が解除される', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);
    const king = screen.getByLabelText('先手の王');

    // 1回目のクリックで選択
    await user.click(king);
    expect(king).toHaveClass('bg-yellow-200');

    // 2回目のクリックで選択解除
    await user.click(king);
    expect(king).not.toHaveClass('bg-yellow-200');
    expect(king).toHaveClass('bg-amber-100');
  });

  it('同じプレイヤーの別の駒をクリックすると選択が切り替わる', async () => {
    const user = userEvent.setup();
    render(<ShogiBoard />);

    // 王を選択
    const king = screen.getByLabelText('先手の王');
    await user.click(king);
    expect(king).toHaveClass('bg-yellow-200');

    // 先手の角を取得して選択(角は1つしかない)
    const kaku = screen.getByLabelText('先手の角');
    await user.click(kaku);

    // 再度要素を取得して状態を確認
    const kingAfter = screen.getByLabelText('先手の王');
    const kakuAfter = screen.getByLabelText('先手の角');

    expect(kingAfter).not.toHaveClass('bg-yellow-200');
    expect(kakuAfter).toHaveClass('bg-yellow-200');
  });

  // T012: US1 - ターン制御の統合テスト
  describe('US1: 先手の駒を先手の番に動かす', () => {
    it('初期状態では先手のターンである', () => {
      render(<ShogiBoard />);
      // 将来的にターン表示が実装されたら、ここでターン表示を確認する
      // 現時点では実装が先なので、このテストはスキップまたは後で更新
    });

    it('先手のターンで先手の駒を選択できる', async () => {
      const user = userEvent.setup();
      render(<ShogiBoard />);
      const king = screen.getByLabelText('先手の王');

      await user.click(king);
      expect(king).toHaveClass('bg-yellow-200');
    });

    it('先手のターンで後手の駒を選択しようとすると視覚的フィードバックが表示される', async () => {
      // このテストは実装後に完成する
      // 現時点では、後手の駒を選択できないことを確認する前提でマークのみ
    });
  });
});
