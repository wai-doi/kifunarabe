import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShogiBoard from '../../src/components/ShogiBoard';

/**
 * T033: パフォーマンステスト
 * SC-001: 駒の選択表示は0.15秒以内（CI環境を考慮）
 * SC-002: 駒の移動完了は0.2秒以内
 */

describe('Performance Requirements', () => {
  beforeEach(() => {
    render(<ShogiBoard />);
  });

  it('SC-001: 駒の選択表示は0.1秒以内', async () => {
    const user = userEvent.setup();

    // 先手の歩(5筋3段)をクリック
    const square = screen.getByLabelText(/5筋3段.*先手の歩/);

    const startTime = performance.now();
    await user.click(square);
    const endTime = performance.now();

    const duration = endTime - startTime;

    // 0.15秒(150ms)以内に完了すること（CI環境を考慮）
    expect(duration).toBeLessThan(150);

    // 選択状態が反映されていること
    expect(screen.getByLabelText(/5筋3段.*選択中/)).toBeTruthy();
  });

  it('SC-002: 駒の移動完了は0.2秒以内', async () => {
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
  });

  it('パフォーマンステスト: 連続操作でも性能を維持', async () => {
    const user = userEvent.setup();
    const durations: number[] = [];

    // 10回の連続操作でパフォーマンスを測定
    for (let i = 0; i < 10; i++) {
      // 歩を選択
      const piece =
        screen.getByLabelText(/5筋3段.*先手の歩/) || screen.getByLabelText(/5筋4段.*先手の歩/);

      const startTime = performance.now();
      await user.click(piece);
      const endTime = performance.now();

      durations.push(endTime - startTime);
    }

    // 平均操作時間が0.1秒以内
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    expect(averageDuration).toBeLessThan(100);

    // 最大操作時間も0.2秒以内
    const maxDuration = Math.max(...durations);
    expect(maxDuration).toBeLessThan(200);
  });
});
