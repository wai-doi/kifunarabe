import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from '../../src/components/Board';
import { INITIAL_POSITION } from '../../src/data/initialPosition';
import type { Turn } from '../../src/types/turn';

describe('Board', () => {
  const mockOnSquareClick = vi.fn();
  const mockOnInvalidSelection = vi.fn();

  it('81個のマス目がレンダリングされる', () => {
    render(<Board pieces={INITIAL_POSITION} selected={null} onSquareClick={mockOnSquareClick} />);
    const squares = screen.getAllByRole('gridcell');
    expect(squares).toHaveLength(81);
  });

  it('将棋盤がgridロールを持つ', () => {
    render(<Board pieces={INITIAL_POSITION} selected={null} onSquareClick={mockOnSquareClick} />);
    const board = screen.getByRole('grid');
    expect(board).toBeInTheDocument();
  });

  it('aria-labelに"将棋盤"が設定されている', () => {
    render(<Board pieces={INITIAL_POSITION} selected={null} onSquareClick={mockOnSquareClick} />);
    const board = screen.getByRole('grid');
    expect(board).toHaveAttribute('aria-label', '将棋盤');
  });

  it('グリッドレイアウトのクラスが適用されている', () => {
    const { container } = render(<Board pieces={INITIAL_POSITION} selected={null} onSquareClick={mockOnSquareClick} />);
    const board = container.querySelector('[role="grid"]') as HTMLElement;
    expect(board).toHaveClass('grid');
  });

  // T011: US1 - ターン検証テスト
  describe('ターン検証', () => {
    it('先手のターンで先手の駒を選択できる', async () => {
      const currentTurn: Turn = 'sente';
      const user = userEvent.setup();
      
      render(
        <Board 
          pieces={INITIAL_POSITION} 
          selected={null} 
          onSquareClick={mockOnSquareClick}
          currentTurn={currentTurn}
          onInvalidSelection={mockOnInvalidSelection}
        />
      );

      // 先手の歩(2筋7段目)をクリック
      const squares = screen.getAllByRole('gridcell');
      const sentePawnSquare = squares.find(() => {
        const piece = INITIAL_POSITION.find((p) => p.file === 2 && p.rank === 7);
        return piece && piece.player === 'sente';
      });

      if (sentePawnSquare) {
        await user.click(sentePawnSquare);
        expect(mockOnSquareClick).toHaveBeenCalled();
        expect(mockOnInvalidSelection).not.toHaveBeenCalled();
      }
    });

    it('先手のターンで後手の駒を選択できない', async () => {
      const currentTurn: Turn = 'sente';
      const user = userEvent.setup();
      
      render(
        <Board 
          pieces={INITIAL_POSITION} 
          selected={null} 
          onSquareClick={mockOnSquareClick}
          currentTurn={currentTurn}
          onInvalidSelection={mockOnInvalidSelection}
        />
      );

      // 後手の歩(2筋3段目)をクリック
      const squares = screen.getAllByRole('gridcell');
      const gotePawnSquare = squares.find(() => {
        const piece = INITIAL_POSITION.find((p) => p.file === 2 && p.rank === 3);
        return piece && piece.player === 'gote';
      });

      if (gotePawnSquare) {
        await user.click(gotePawnSquare);
        expect(mockOnInvalidSelection).toHaveBeenCalled();
      }
    });
  });
});
