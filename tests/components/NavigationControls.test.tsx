import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NavigationControls } from '../../src/components/NavigationControls';
import type { NavigationState } from '../../src/types/history';

describe('NavigationControls', () => {
  const defaultState: NavigationState = {
    canGoBack: true,
    canGoForward: true,
    currentMoveNumber: 2,
    totalMoves: 5,
  };

  it('[US1] 「一手戻る」ボタンがレンダリングされる', () => {
    const onGoBack = vi.fn();
    render(
      <NavigationControls
        navigationState={defaultState}
        onGoBack={onGoBack}
        onGoForward={vi.fn()}
        onGoFirst={vi.fn()}
        onGoLast={vi.fn()}
      />
    );

    const backButton = screen.getByRole('button', { name: /一手戻る/i });
    expect(backButton).toBeInTheDocument();
  });

  it('[US1] 「一手戻る」ボタンをクリックするとハンドラーが呼ばれる', async () => {
    const user = userEvent.setup();
    const onGoBack = vi.fn();

    render(
      <NavigationControls
        navigationState={defaultState}
        onGoBack={onGoBack}
        onGoForward={vi.fn()}
        onGoFirst={vi.fn()}
        onGoLast={vi.fn()}
      />
    );

    const backButton = screen.getByRole('button', { name: /一手戻る/i });
    await user.click(backButton);

    expect(onGoBack).toHaveBeenCalledTimes(1);
  });

  it('[US1] canGoBack が false の時「一手戻る」ボタンが無効', () => {
    const stateAtStart: NavigationState = {
      ...defaultState,
      canGoBack: false,
      currentMoveNumber: 0,
    };

    render(
      <NavigationControls
        navigationState={stateAtStart}
        onGoBack={vi.fn()}
        onGoForward={vi.fn()}
        onGoFirst={vi.fn()}
        onGoLast={vi.fn()}
      />
    );

    const backButton = screen.getByRole('button', { name: /一手戻る/i });
    expect(backButton).toBeDisabled();
  });

  it.todo('[US2] 「一手進む」ボタンがレンダリングされる');
  it.todo('[US3] 「初手に戻る」ボタンがレンダリングされる');
  it.todo('[US4] 「最終手に進む」ボタンがレンダリングされる');
  it.todo('[US4] 現在手数の表示（"X手目 / Y手"）がレンダリングされる');
});
