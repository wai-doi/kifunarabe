import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShogiBoard from '../../src/components/ShogiBoard';

/**
 * T029-T033: User Story 1の視覚的フィードバックの統合テスト
 * 「駒を選択した際にオレンジ色の太い枠線が表示されること」
 */
describe('US1: 駒の選択時の視覚的フィードバック', () => {
  it('先手の駒を選択するとオレンジ色の枠線が表示される', async () => {
    // localStorageをクリアして初期状態から開始
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 先手の歩（5筋3段）を選択
    const square = screen.getByLabelText(/5筋3段.*先手の歩/);
    await user.click(square);

    // 選択状態が反映されていることを確認
    const selectedSquare = screen.getByLabelText(/5筋3段.*選択中/);
    expect(selectedSquare).toBeTruthy();

    // 琥珀色のoutlineが適用されていることを確認
    expect(selectedSquare.className).toContain('outline-amber-700');
    expect(selectedSquare.className).toContain('outline-[3px]');

    cleanup();
  });

  it('別の駒を選択すると前の枠線が消えて新しい枠線が表示される', async () => {
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 最初の駒を選択（5筋3段の歩）
    const firstPiece = screen.getByLabelText(/5筋3段.*先手の歩/);
    await user.click(firstPiece);

    // 選択状態を確認
    expect(screen.getByLabelText(/5筋3段.*選択中/)).toBeTruthy();

    // 別の駒を選択（7筋3段の歩）
    const secondPiece = screen.getByLabelText(/7筋3段.*先手の歩/);
    await user.click(secondPiece);

    // 新しい駒が選択されていることを確認
    expect(screen.getByLabelText(/7筋3段.*選択中/)).toBeTruthy();

    // 前の駒は選択されていないことを確認（選択中という文字列がない）
    const oldSquare = screen.getByLabelText(/5筋3段.*先手の歩/);
    expect(oldSquare.getAttribute('aria-label')).not.toContain('選択中');

    cleanup();
  });

  it('空マスをクリックしても枠線は表示されない', async () => {
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 空マス（5筋4段）をクリック
    const emptySquare = screen.getByLabelText('5筋4段');
    await user.click(emptySquare);

    // 選択中の要素が存在しないことを確認
    const selectedElements = screen.queryAllByLabelText(/選択中/);
    expect(selectedElements).toHaveLength(0);

    cleanup();
  });

  it('相手の駒をクリックしても枠線は表示されない', async () => {
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 後手の駒（5筋7段の歩）をクリック（先手の手番で）
    const gotePiece = screen.getByLabelText(/5筋7段.*後手の歩/);
    await user.click(gotePiece);

    // 選択中の要素が存在しないことを確認
    const selectedElements = screen.queryAllByLabelText(/選択中/);
    expect(selectedElements).toHaveLength(0);

    cleanup();
  });

  it('同じ駒を再度クリックすると枠線が消える', async () => {
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 駒を選択（5筋3段の歩）
    const piece = screen.getByLabelText(/5筋3段.*先手の歩/);
    await user.click(piece);

    // 選択状態を確認
    expect(screen.getByLabelText(/5筋3段.*選択中/)).toBeTruthy();

    // 同じ駒を再度クリック
    await user.click(piece);

    // 選択が解除されていることを確認
    const selectedElements = screen.queryAllByLabelText(/選択中/);
    expect(selectedElements).toHaveLength(0);

    cleanup();
  });
});
