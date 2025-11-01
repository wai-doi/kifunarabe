import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Square from '../../src/components/Square';
import type { Position } from '../../src/types/position';

describe('Square', () => {
  const position: Position = { file: 5, rank: 5 };

  it('マス目がレンダリングされる', () => {
    render(<Square position={position} />);
    const square = screen.getByRole('gridcell');
    expect(square).toBeInTheDocument();
  });

  it('aria-labelに正しい位置情報が含まれる', () => {
    render(<Square position={position} />);
    const square = screen.getByRole('gridcell');
    expect(square).toHaveAttribute('aria-label', '5筋5段');
  });

  it('境界線のスタイルが適用されている', () => {
    const { container } = render(<Square position={position} />);
    const square = container.firstChild as HTMLElement;
    expect(square).toHaveClass('border');
  });

  it('駒がない場合は空のマス目が表示される', () => {
    render(<Square position={position} />);
    const square = screen.getByRole('gridcell');
    expect(square.textContent).toBe('');
  });

  // T008: クリックハンドラーのテスト
  it('onClickプロパティが渡された時、クリックでハンドラーが呼ばれる', () => {
    const mockOnClick = vi.fn();
    render(<Square position={position} onClick={mockOnClick} />);
    const square = screen.getByRole('gridcell');
    square.click();
    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it('onClickプロパティが未指定の時、クリックしてもエラーにならない', () => {
    render(<Square position={position} />);
    const square = screen.getByRole('gridcell');
    expect(() => square.click()).not.toThrow();
  });
});
