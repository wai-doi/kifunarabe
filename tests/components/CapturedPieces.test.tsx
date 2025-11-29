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

  test('複数個の駒を渡したとき、「駒 ×数量」の形式で表示される', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 3 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 駒と数量が表示される
    expect(screen.getByText('歩')).toBeInTheDocument();
    expect(screen.getByText('×3')).toBeInTheDocument();
  });

  test('複数種類の駒を渡したとき、全ての種類が表示される', () => {
    const capturedPieces: CapturedPiecesMap = { 歩: 2, 角: 1, 飛: 1 };
    render(<CapturedPieces capturedPieces={capturedPieces} player="sente" />);

    // 全ての駒が表示される
    expect(screen.getByText('歩')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
    expect(screen.getByText('角')).toBeInTheDocument();
    expect(screen.getByText('飛')).toBeInTheDocument();
    // 1個の駒は数量表示なし
    expect(screen.queryByText('×1')).not.toBeInTheDocument();
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
      expect(bishopButton).toHaveClass('bg-yellow-200');
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
});
