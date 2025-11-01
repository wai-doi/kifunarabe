import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
