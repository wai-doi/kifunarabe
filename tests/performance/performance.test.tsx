import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShogiBoard from '../../src/components/ShogiBoard';
import { hasUnpromotedPawnInFile } from '../../src/logic/doublePawnValidation';
import type { Piece } from '../../src/types/piece';

/**
 * T033: パフォーマンステスト
 * SC-001: 駒の選択表示は0.3秒以内(CI環境を考慮)
 * SC-002: 駒の移動完了は0.2秒以内
 */

describe('Performance Requirements', () => {
  it('SC-001: 駒の選択表示は0.3秒以内', async () => {
    // localStorageをクリアして初期状態から開始
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 先手の歩(5筋3段)をクリック
    const square = screen.getByLabelText(/5筋3段.*先手の歩/);

    const startTime = performance.now();
    await user.click(square);
    const endTime = performance.now();

    const duration = endTime - startTime;

    // 0.3秒(300ms)以内に完了すること（CI環境を考慮して余裕を持たせる）
    expect(duration).toBeLessThan(300);

    // 選択状態が反映されていること
    expect(screen.getByLabelText(/5筋3段.*選択中/)).toBeTruthy();

    cleanup();
  });

  it('SC-002: 駒の移動完了は0.2秒以内', async () => {
    // localStorageをクリアして初期状態から開始
    localStorage.clear();
    render(<ShogiBoard />);
    const user = userEvent.setup();

    // 1. 先手の歩(5筋3段)を選択
    const sourcePiece = screen.getByLabelText(/5筋3段.*先手の歩/);
    await user.click(sourcePiece);

    // 2. 移動先(5筋4段)をクリック
    const targetSquare = screen.getByLabelText('5筋4段');

    const startTime = performance.now();
    await user.click(targetSquare);
    const endTime = performance.now();

    const duration = endTime - startTime;

    // 0.2秒(200ms)以内に完了すること
    expect(duration).toBeLessThan(200);

    // 駒が移動していること
    expect(screen.getByLabelText(/5筋4段.*先手の歩/)).toBeTruthy();

    cleanup();
  });

  it('パフォーマンステスト: 連続操作でも性能を維持', async () => {
    const durations: number[] = [];

    // 10回の連続操作でパフォーマンスを測定
    for (let i = 0; i < 10; i++) {
      // localStorageをクリアして初期状態から開始
      localStorage.clear();
      render(<ShogiBoard />);
      const user = userEvent.setup();

      // 歩を選択
      const piece = screen.getByLabelText(/5筋3段.*先手の歩/);

      const startTime = performance.now();
      await user.click(piece);
      const endTime = performance.now();

      durations.push(endTime - startTime);

      cleanup();
    }

    // 平均操作時間が0.1秒以内
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    expect(averageDuration).toBeLessThan(100);

    // 最大操作時間も0.2秒以内
    const maxDuration = Math.max(...durations);
    expect(maxDuration).toBeLessThan(200);
  });

  it('SC-004: 二歩検証は50ミリ秒以内', () => {
    // 大量の駒がある状態で二歩検証のパフォーマンスを測定
    const pieces: Piece[] = [];
    for (let file = 1; file <= 9; file++) {
      for (let rank = 1; rank <= 9; rank++) {
        if (Math.random() > 0.5) {
          pieces.push({
            type: Math.random() > 0.5 ? '歩' : '角',
            player: Math.random() > 0.5 ? 'sente' : 'gote',
            file,
            rank,
            promoted: false,
          });
        }
      }
    }

    const startTime = performance.now();
    for (let file = 1; file <= 9; file++) {
      hasUnpromotedPawnInFile(pieces, file, 'sente');
    }
    const endTime = performance.now();

    const duration = endTime - startTime;

    // 全9筋の検証が50ms以内に完了すること
    expect(duration).toBeLessThan(50);
  });
});
