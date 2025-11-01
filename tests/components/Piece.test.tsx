import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Piece from '../../src/components/Piece';
import type { Piece as PieceType } from '../../src/types/piece';

describe('Piece', () => {
  const sentePiece: PieceType = {
    type: '王',
    player: 'sente',
    file: 5,
    rank: 1,
  };

  const gotePiece: PieceType = {
    type: '玉',
    player: 'gote',
    file: 5,
    rank: 9,
  };

  it('駒の文字が表示される', () => {
    render(<Piece piece={sentePiece} />);
    expect(screen.getByText('王')).toBeInTheDocument();
  });

  it('先手の駒は回転しない', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    const transform = window.getComputedStyle(piece).transform;
    // 回転なし、またはidentity matrix
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
  });

  it('後手の駒は180度回転する', () => {
    const { container } = render(<Piece piece={gotePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.transform).toBe('rotate(180deg)');
  });

  it('駒の色が正しく適用される', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.color).toBe('rgb(139, 69, 19)'); // #8B4513
  });

  it('aria-labelに駒の種類とプレイヤーが含まれる', () => {
    render(<Piece piece={sentePiece} />);
    const piece = screen.getByLabelText('先手の王');
    expect(piece).toBeInTheDocument();
  });

  it('後手の駒のaria-labelが正しい', () => {
    render(<Piece piece={gotePiece} />);
    const piece = screen.getByLabelText('後手の玉');
    expect(piece).toBeInTheDocument();
  });
});
