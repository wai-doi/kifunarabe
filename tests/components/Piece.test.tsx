import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Piece from '../../src/components/Piece';
import CapturedPieces from '../../src/components/CapturedPieces';
import {
  BOARD_FONT_SIZE,
  CAPTURED_FONT_SIZE,
  PENTAGON_CLIP_PATH,
} from '../../src/components/pieceStyle';
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

  it('五角形のclip-pathが適用され先手は回転しない', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.clipPath).toBe(PENTAGON_CLIP_PATH);
    expect(piece.style.transform === 'none' || piece.style.transform === '').toBe(true);
  });

  it('後手の駒は180度回転しclip-pathが保持される', () => {
    const { container } = render(<Piece piece={gotePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.transform).toBe('rotate(180deg)');
    expect(piece.style.clipPath).toBe(PENTAGON_CLIP_PATH);
  });

  it('木目グラデーションと陰影が適用される', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.style.background.startsWith('linear-gradient(145deg')).toBe(true);
    expect(piece.style.background).toContain('rgb');
    expect(piece.style.boxShadow).toContain('rgba');
  });

  it('選択状態ではハイライトされた陰影と背景になる', () => {
    const { container } = render(<Piece piece={sentePiece} isSelected={true} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.className).toContain('shogi-piece-selected');
    expect(piece.style.background.startsWith('linear-gradient(145deg')).toBe(true);
    expect(piece.style.boxShadow).toContain('#facc15');
  });

  it('文字は中央配置でclampフォントサイズ', () => {
    const { container } = render(<Piece piece={sentePiece} />);
    const piece = container.firstChild as HTMLElement;
    expect(piece.className).toContain('items-center');
    expect(piece.className).toContain('justify-center');
    expect(piece.getAttribute('data-font-size')).toBe(BOARD_FONT_SIZE);
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
    const text = container.querySelector('span') as HTMLElement;
    expect(window.getComputedStyle(text).color).toContain('204, 0, 0');
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
    const text = screen.getByText('歩') as HTMLElement;
    expect(window.getComputedStyle(text).color).toContain('0, 0, 0');
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

describe('持ち駒の表示', () => {
  const captured = { 歩: 2 } as const;

  it('持ち駒にも五角形clip-pathと木目が適用される', () => {
    render(
      <CapturedPieces
        capturedPieces={captured}
        player="sente"
        onPieceClick={() => {}}
        isSelectable={true}
      />
    );
    const button = screen.getByLabelText('持ち駒の歩 2枚') as HTMLElement;
    expect(button.style.clipPath).toBe(PENTAGON_CLIP_PATH);
    expect(button.style.background.startsWith('linear-gradient(145deg')).toBe(true);
  });

  it('持ち駒の文字サイズは小さめのclampで中央配置', () => {
    render(
      <CapturedPieces
        capturedPieces={captured}
        player="gote"
        onPieceClick={() => {}}
        isSelectable={true}
      />
    );
    const button = screen.getByLabelText('持ち駒の歩 2枚');
    expect(button.className).toContain('justify-center');
    expect(button.getAttribute('data-font-size')).toBe(CAPTURED_FONT_SIZE);
  });
});
