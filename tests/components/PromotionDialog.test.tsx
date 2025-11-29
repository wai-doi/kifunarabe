import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PromotionDialog from '../../src/components/PromotionDialog';
import type { Position } from '../../src/types/position';

describe('PromotionDialog', () => {
  const position: Position = { file: 5, rank: 7 };
  const mockOnPromote = vi.fn();
  const mockOnDecline = vi.fn();

  beforeEach(() => {
    mockOnPromote.mockClear();
    mockOnDecline.mockClear();
  });

  it('ダイアログがレンダリングされる', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('aria-labelが正しく設定されている', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', '成り選択');
  });

  it('「成る」ボタンが表示される', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const promoteButton = screen.getByRole('button', { name: '成る' });
    expect(promoteButton).toBeInTheDocument();
  });

  it('「不成」ボタンが表示される', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const declineButton = screen.getByRole('button', { name: '成らない' });
    expect(declineButton).toBeInTheDocument();
  });

  it('「成る」ボタンをクリックするとonPromoteが呼ばれる', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const promoteButton = screen.getByRole('button', { name: '成る' });
    fireEvent.click(promoteButton);
    expect(mockOnPromote).toHaveBeenCalledOnce();
    expect(mockOnDecline).not.toHaveBeenCalled();
  });

  it('「不成」ボタンをクリックするとonDeclineが呼ばれる', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const declineButton = screen.getByRole('button', { name: '成らない' });
    fireEvent.click(declineButton);
    expect(mockOnDecline).toHaveBeenCalledOnce();
    expect(mockOnPromote).not.toHaveBeenCalled();
  });

  it('aria-modal属性が設定されている', () => {
    render(
      <PromotionDialog position={position} onPromote={mockOnPromote} onDecline={mockOnDecline} />
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
