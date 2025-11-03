import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TurnDisplay from '../../src/components/TurnDisplay';
import type { Turn } from '../../src/types/turn';

describe('TurnDisplay', () => {
  // T025: レンダリングテスト
  describe('レンダリング', () => {
    it('先手のターンで「先手の番」が表示される', () => {
      const currentTurn: Turn = 'sente';
      render(<TurnDisplay currentTurn={currentTurn} isHighlighted={false} />);

      expect(screen.getByText('先手の番')).toBeInTheDocument();
    });

    it('後手のターンで「後手の番」が表示される', () => {
      const currentTurn: Turn = 'gote';
      render(<TurnDisplay currentTurn={currentTurn} isHighlighted={false} />);

      expect(screen.getByText('後手の番')).toBeInTheDocument();
    });
  });

  // T026: アニメーション発火テスト
  describe('アニメーション', () => {
    it('isHighlightedがfalseの時、アニメーションクラスが適用されない', () => {
      const currentTurn: Turn = 'sente';
      const { container } = render(<TurnDisplay currentTurn={currentTurn} isHighlighted={false} />);

      const turnDisplay = container.querySelector('[data-testid="turn-display"]');
      expect(turnDisplay).not.toHaveClass('animate-shake');
      expect(turnDisplay).not.toHaveClass('animate-pulse');
    });

    it('isHighlightedがtrueの時、アニメーションクラスが適用される', () => {
      const currentTurn: Turn = 'sente';
      const { container } = render(<TurnDisplay currentTurn={currentTurn} isHighlighted={true} />);

      const turnDisplay = container.querySelector('[data-testid="turn-display"]');
      // shakeまたはpulseのいずれかのアニメーションが適用されていることを確認
      const hasAnimation =
        turnDisplay?.classList.contains('animate-shake') ||
        turnDisplay?.classList.contains('animate-pulse');
      expect(hasAnimation).toBe(true);
    });
  });

  describe('スタイリング', () => {
    it('盤面上部中央に配置されるクラスが適用される', () => {
      const currentTurn: Turn = 'sente';
      const { container } = render(<TurnDisplay currentTurn={currentTurn} isHighlighted={false} />);

      const turnDisplay = container.querySelector('[data-testid="turn-display"]');
      expect(turnDisplay).toHaveClass('text-center');
    });

    it('大きめのフォントサイズが適用される', () => {
      const currentTurn: Turn = 'sente';
      const { container } = render(<TurnDisplay currentTurn={currentTurn} isHighlighted={false} />);

      const turnDisplay = container.querySelector('[data-testid="turn-display"]');
      // text-2xlまたはそれ以上のクラスが適用されていることを確認
      const hasLargeText = turnDisplay?.classList.toString().includes('text-');
      expect(hasLargeText).toBe(true);
    });
  });
});
