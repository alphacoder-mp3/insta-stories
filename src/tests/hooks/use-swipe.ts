import { test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSwipe } from '../../hooks/use-swipe';

test('handles left swipe correctly', () => {
  const onSwipeLeft = vi.fn();
  const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

  const touchStart = { touches: [{ clientX: 200 }] };
  const touchMove = { touches: [{ clientX: 100 }] };

  result.current.handleTouchStart(touchStart as never);
  result.current.handleTouchMove(touchMove as never);

  expect(onSwipeLeft).toHaveBeenCalled();
});

test('handles right swipe correctly', () => {
  const onSwipeRight = vi.fn();
  const { result } = renderHook(() => useSwipe({ onSwipeRight }));

  const touchStart = { touches: [{ clientX: 100 }] };
  const touchMove = { touches: [{ clientX: 200 }] };

  result.current.handleTouchStart(touchStart as never);
  result.current.handleTouchMove(touchMove as never);

  expect(onSwipeRight).toHaveBeenCalled();
});

test('ignores small movements', () => {
  const onSwipeLeft = vi.fn();
  const onSwipeRight = vi.fn();
  const { result } = renderHook(() => useSwipe({ onSwipeLeft, onSwipeRight }));

  const touchStart = { touches: [{ clientX: 100 }] };
  const touchMove = { touches: [{ clientX: 120 }] };

  result.current.handleTouchStart(touchStart as never);
  result.current.handleTouchMove(touchMove as never);

  expect(onSwipeLeft).not.toHaveBeenCalled();
  expect(onSwipeRight).not.toHaveBeenCalled();
});
