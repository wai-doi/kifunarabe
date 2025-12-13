import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CapturedPieces from '../../src/components/CapturedPieces';
import type { CapturedPiecesMap } from '../../src/types/capturedPieces';

describe('CapturedPieces', () => {
  test('空の持ち駒マップを渡したとき、空のエリアが表示される', () => {
    const capturedPieces: CapturedPiecesMap = {};
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 持ち駒エリアは表示されるが、駒は表示されない
    const container = screen.getByTestId('captured-pieces-sente');
    expect(container).toBeInTheDocument();
    // 駒が表示されていないことを確認
    expect(screen.queryByText(/歩|香|桂|銀|金|角|飛|玉/)).not.toBeInTheDocument();
  });

  test('1個の駒を渡したとき、駒のみが表示される(数量表示なし)', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 1 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 駒が表示される
    expect(screen.getByText('歩')).toBeInTheDocument();
    // 数量表示はない
    expect(screen.queryByText('×1')).not.toBeInTheDocument();
  });

  test('複数個の駒を渡したとき、駒と数量が表示される', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 3 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 駒と数量が表示される (新形式: 駒の右下に「3」)
    expect(screen.getByText('歩')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('複数種類の駒を渡したとき、全ての種類が表示される', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1, 飛: 1 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 全ての駒が表示される
    expect(screen.getByText('歩')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('角')).toBeInTheDocument();
    expect(screen.getByText('飛')).toBeInTheDocument();
    // 1個の駒は数量表示なし
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });

  test('プレイヤーごとの配置: 先手の持ち駒', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 1 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    const container = screen.getByTestId('captured-pieces-sente');
    expect(container).toBeInTheDocument();
  });

  test('プレイヤーごとの配置: 後手の持ち駒', () => {
    const capturedPieces: CapturedPiecesMap = { 角: 1 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="gote" />);

    const container = screen.getByTestId('captured-pieces-gote');
    expect(container).toBeInTheDocument();
  });

  // T009: CapturedPieces クリックハンドラのテスト
  describe('クリックハンドラ', () => {
    test('onPieceClick が指定されている場合、駒をクリックするとハンドラが呼ばれる', async () => {
      const user = userEvent.setup();
      const handlePieceClick = vi.fn();
      const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1 };

      render(
        <CapturedPieces
          capturedPieces={capturedPieces}
          player="sente"
          onPieceClick={handlePieceClick}
        />
      );

      // 歩をクリック
      const pawnButton = screen.getByRole('button', { name: /歩/i });
      await user.click(pawnButton);

      expect(handlePieceClick).toHaveBeenCalledWith('歩');
    });

    test('onPieceClick が指定されていない場合でもエラーにならない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 1 };

      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // onPieceClick なしでも駒は表示される
      expect(screen.getByText('歩')).toBeInTheDocument();
    });

    test('isSelectable が false の場合、駒をクリックしてもハンドラが呼ばれない', async () => {
      const user = userEvent.setup();
      const handlePieceClick = vi.fn();
      const capturedPieces: CapturedPiecesMap = { 歩: 1 };

      render(
        <CapturedPieces
          capturedPieces={capturedPieces}
          player="sente"
          onPieceClick={handlePieceClick}
          isSelectable={false}
        />
      );

      const pawnElement = screen.getByText('歩');
      await user.click(pawnElement);

      expect(handlePieceClick).not.toHaveBeenCalled();
    });
  });

  // T010: CapturedPieces 選択ハイライトのテスト
  describe('選択ハイライト', () => {
    test('selectedPieceType に指定された駒がハイライト表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1, 飛: 1 };

      render(
        <CapturedPieces capturedPieces={capturedPieces} player="sente" selectedPieceType="角" />
      );

      // 角がハイライト表示される
      const bishopButton = screen.getByRole('button', { name: /角/i });
      expect(bishopButton).toHaveClass('shogi-piece-selected');
    });

    test('selectedPieceType に指定されていない駒はハイライト表示されない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1 };

      render(
        <CapturedPieces capturedPieces={capturedPieces} player="sente" selectedPieceType="角" />
      );

      // 歩はハイライト表示されない
      const pawnButton = screen.getByRole('button', { name: /歩/i });
      expect(pawnButton).not.toHaveClass('bg-yellow-200');
    });

    test('selectedPieceType が undefined の場合、どの駒もハイライト表示されない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1 };

      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const pawnButton = screen.getByRole('button', { name: /歩/i });
      const bishopButton = screen.getByRole('button', { name: /角/i });

      expect(pawnButton).not.toHaveClass('bg-yellow-200');
      expect(bishopButton).not.toHaveClass('bg-yellow-200');
    });
  });

  // T025: 持ち駒が0個の駒種のテスト
  describe('0個の駒種の扱い', () => {
    test('持ち駒が0個の駒種は表示されない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 0, 角: 1 };

      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 歩は0個なので表示されない
      expect(screen.queryByText('歩')).not.toBeInTheDocument();
      // 角は1個なので表示される
      expect(screen.getByText('角')).toBeInTheDocument();
    });

    test('全ての持ち駒が0個の場合、何も表示されない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 0, 角: 0, 飛: 0 };

      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 駒が表示されていないことを確認
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  // Phase 3: User Story 1 - 持ち駒の数字を駒の右下に配置
  describe('US1: 持ち駒の数字表示位置', () => {
    // T005: 2枚以上の持ち駒で数字が右下に表示される
    test('2枚以上の持ち駒で数字が右下に表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 3 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 駒が表示される
      expect(screen.getByText('歩')).toBeInTheDocument();
      // 数字が表示される (×なし)
      const countElement = screen.getByText('3');
      expect(countElement).toBeInTheDocument();

      // position: absolute が設定されている
      expect(countElement).toHaveStyle({ position: 'absolute' });
    });

    // T006: 1枚のみの持ち駒で数字が表示されない
    test('1枚のみの持ち駒で数字が表示されない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 1 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 駒は表示される
      expect(screen.getByText('歩')).toBeInTheDocument();
      // 数字は表示されない (×1も1も表示されない)
      expect(screen.queryByText('×1')).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    // T007: 先手・後手ともに数字が画面上の物理的な右下に配置される
    test('先手の持ち駒の数字が物理的な右下に配置される', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 5 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const countElement = screen.getByText('5');
      // right と bottom が設定されている
      expect(countElement).toHaveStyle({
        position: 'absolute',
        right: '2px',
        bottom: '2px',
      });
    });

    test('後手の持ち駒の数字が物理的な右下に配置される', () => {
      const capturedPieces: CapturedPiecesMap = { 角: 2 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="gote" />);

      const countElement = screen.getByText('2');
      // right と bottom が設定されている (後手も同じ)
      expect(countElement).toHaveStyle({
        position: 'absolute',
        right: '2px',
        bottom: '2px',
      });
    });

    // T008: 2桁の数字（10枚以上）も適切に表示される
    test('10枚以上の持ち駒で2桁の数字が適切に表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 18 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 駒が表示される
      expect(screen.getByText('歩')).toBeInTheDocument();
      // 2桁の数字が表示される
      const countElement = screen.getByText('18');
      expect(countElement).toBeInTheDocument();
      expect(countElement).toHaveStyle({ position: 'absolute' });
    });
  });

  // Phase 4: User Story 2 - 数字のサイズと色の視認性
  describe('US2: 数字のサイズと色', () => {
    // T014: 数字のフォントサイズが駒の文字の50-70%である
    test('数字のフォントサイズが駒の文字の約60%である', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 5 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const countElement = screen.getByText('5');
      // calc(clamp(1.1rem,2vw,1.4rem) * 0.6) が設定されている
      const fontSize = countElement.style.fontSize;
      expect(fontSize).toContain('calc');
      expect(fontSize).toContain('0.6');
    });

    // T015: 数字の色が#5C4033（濃い茶色）である
    test('数字の色が#5C4033（濃い茶色）で表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 角: 3 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const countElement = screen.getByText('3');
      expect(countElement).toHaveStyle({ color: 'rgb(92, 64, 51)' }); // #5C4033
    });

    // T016: 成り駒の場合、駒の文字は赤色、数字は濃い茶色
    test('成り駒の場合、駒の文字は赤色、数字は濃い茶色で表示される', () => {
      const capturedPieces: CapturedPiecesMap = { と: 2 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      // 駒の文字は赤色
      const pieceElement = screen.getByText('と');
      expect(pieceElement).toHaveStyle({ color: 'rgb(204, 0, 0)' }); // #CC0000

      // 数字は濃い茶色
      const countElement = screen.getByText('2');
      expect(countElement).toHaveStyle({ color: 'rgb(92, 64, 51)' }); // #5C4033
    });

    // T020: font-weightが600（やや太め）である
    test('数字のfont-weightが600（やや太め）である', () => {
      const capturedPieces: CapturedPiecesMap = { 銀: 2 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const countElement = screen.getByText('2');
      expect(countElement).toHaveStyle({ fontWeight: '600' });
    });
  });

  // Phase 5: User Story 3 - 選択状態での数字の可視性
  describe('US3: 選択状態での数字の可視性', () => {
    // T021: 選択状態でも数字が表示される
    test('選択状態でも数字が表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 5 };
      render(
        <CapturedPieces capturedPieces={capturedPieces} player="sente" selectedPieceType="歩" />
      );

      // 数字が表示されている
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    // T022: 選択時に数字の色がCOUNT_COLOR_SELECTEDに変更される
    test('選択時に数字の色がCOUNT_COLOR_SELECTEDに変更される', () => {
      const capturedPieces: CapturedPiecesMap = { 角: 2 };
      render(
        <CapturedPieces capturedPieces={capturedPieces} player="sente" selectedPieceType="角" />
      );

      const countElement = screen.getByText('2');
      // 選択時は #3E2723 (より濃い茶色)
      expect(countElement).toHaveStyle({ color: 'rgb(62, 39, 35)' }); // #3E2723
    });

    // T023: z-indexにより数字がハイライトより前面に表示される
    test('z-indexが10以上で数字がハイライトより前面に表示される', () => {
      const capturedPieces: CapturedPiecesMap = { 飛: 2 };
      render(
        <CapturedPieces capturedPieces={capturedPieces} player="sente" selectedPieceType="飛" />
      );

      const countElement = screen.getByText('2');
      expect(countElement).toHaveStyle({ zIndex: '10' });
    });
  });

  // Phase 6: Accessibility (アクセシビリティ)
  describe('アクセシビリティ', () => {
    // T031: aria-labelに枚数が含まれている
    test('1枚の持ち駒のaria-labelには枚数が含まれない', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 1 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const button = screen.getByRole('button', { name: '持ち駒の歩' });
      expect(button).toBeInTheDocument();
    });

    test('複数枚の持ち駒のaria-labelには枚数が含まれる', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 5 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const button = screen.getByRole('button', { name: '持ち駒の歩 5枚' });
      expect(button).toBeInTheDocument();
    });

    test('2桁の持ち駒のaria-labelにも正確な枚数が含まれる', () => {
      const capturedPieces: CapturedPiecesMap = { 歩: 18 };
      render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

      const button = screen.getByRole('button', { name: '持ち駒の歩 18枚' });
      expect(button).toBeInTheDocument();
    });
  });
});
