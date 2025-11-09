import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
