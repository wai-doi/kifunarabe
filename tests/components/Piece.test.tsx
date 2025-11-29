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
    promoted: false,
  };

  const gotePiece: PieceType = {
    type: '玉',
    player: 'gote',
    file: 5,
    rank: 9,
    promoted: false,
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

  // T007: 選択状態のテスト
  it('isSelectedがtrueの時、選択状態のスタイルが適用される', () => {
    const { container } = render(<Piece piece={sentePiece} isSelected={true} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece).toHaveClass('bg-yellow-200');
    expect(piece).toHaveClass('ring-4');
    expect(piece).toHaveClass('ring-yellow-500');
  });

  it('isSelectedがfalseの時、通常のスタイルが適用される', () => {
    const { container } = render(<Piece piece={sentePiece} isSelected={false} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece).toHaveClass('bg-amber-100');
    expect(piece).not.toHaveClass('bg-yellow-200');
    expect(piece).not.toHaveClass('ring-4');
  });

  it('isSelectedが未指定の時、通常のスタイルが適用される', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece).toHaveClass('bg-amber-100');
  });
});

describe('成り駒の表示', () => {
  it('成った歩は「と」と表示される', () => {
    const promotedFu: PieceType = {
      type: '歩',
      player: 'sente',
      file: 5,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedFu} />);
    expect(screen.getByText('と')).toBeInTheDocument();
  });

  it('成った香は「杏」と表示される', () => {
    const promotedKyou: PieceType = {
      type: '香',
      player: 'sente',
      file: 1,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedKyou} />);
    expect(screen.getByText('杏')).toBeInTheDocument();
  });

  it('成った桂は「圭」と表示される', () => {
    const promotedKei: PieceType = {
      type: '桂',
      player: 'sente',
      file: 2,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedKei} />);
    expect(screen.getByText('圭')).toBeInTheDocument();
  });

  it('成った銀は「全」と表示される', () => {
    const promotedGin: PieceType = {
      type: '銀',
      player: 'sente',
      file: 3,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedGin} />);
    expect(screen.getByText('全')).toBeInTheDocument();
  });

  it('成った飛車は「竜」と表示される', () => {
    const promotedHisha: PieceType = {
      type: '飛',
      player: 'sente',
      file: 8,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedHisha} />);
    expect(screen.getByText('竜')).toBeInTheDocument();
  });

  it('成った角は「馬」と表示される', () => {
    const promotedKaku: PieceType = {
      type: '角',
      player: 'sente',
      file: 2,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedKaku} />);
    expect(screen.getByText('馬')).toBeInTheDocument();
  });

  it('成り駒は赤色で表示される', () => {
    const promotedFu: PieceType = {
      type: '歩',
      player: 'sente',
      file: 5,
      rank: 8,
      promoted: true,
    };
    const { container } = render(<Piece piece={promotedFu} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.color).toBe('rgb(204, 0, 0)'); // #CC0000
  });

  it('成り駒のaria-labelに「成り」が含まれる', () => {
    const promotedFu: PieceType = {
      type: '歩',
      player: 'sente',
      file: 5,
      rank: 8,
      promoted: true,
    };
    render(<Piece piece={promotedFu} />);
    expect(screen.getByLabelText('先手の成り歩')).toBeInTheDocument();
  });

  it('成っていない駒は通常の表示のまま', () => {
    const normalFu: PieceType = {
      type: '歩',
      player: 'sente',
      file: 5,
      rank: 5,
      promoted: false,
    };
    render(<Piece piece={normalFu} />);
    expect(screen.getByText('歩')).toBeInTheDocument();
  });

  it('後手の成り駒も正しく表示される', () => {
    const promotedFuGote: PieceType = {
      type: '歩',
      player: 'gote',
      file: 5,
      rank: 2,
      promoted: true,
    };
    render(<Piece piece={promotedFuGote} />);
    expect(screen.getByText('と')).toBeInTheDocument();
    expect(screen.getByLabelText('後手の成り歩')).toBeInTheDocument();
  });
});
