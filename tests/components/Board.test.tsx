import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Board from '../../src/components/Board';
import { INITIAL_POSITION } from '../../src/data/initialPosition';

describe('Board', () => {
  it('81個のマス目がレンダリングされる', () => {
    render(<Board pieces={INITIAL_POSITION} />);
    const squares = screen.getAllByRole('gridcell');
    expect(squares).toHaveLength(81);
  });

  it('将棋盤がgridロールを持つ', () => {
    render(<Board pieces={INITIAL_POSITION} />);
    const board = screen.getByRole('grid');
    expect(board).toBeInTheDocument();
  });

  it('aria-labelに"将棋盤"が設定されている', () => {
    render(<Board pieces={INITIAL_POSITION} />);
    const board = screen.getByRole('grid');
    expect(board).toHaveAttribute('aria-label', '将棋盤');
  });

  it('グリッドレイアウトのクラスが適用されている', () => {
    const { container } = render(<Board pieces={INITIAL_POSITION} />);
    const board = container.querySelector('[role="grid"]') as HTMLElement;
    expect(board).toHaveClass('grid');
  });
});
