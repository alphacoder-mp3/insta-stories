import { test, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoryViewer } from '../../components/story-viewer';
import { userStories } from '../../data/stories';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders story viewer with initial story', () => {
  const mockOnClose = vi.fn();
  const { getByAltText, getByText } = render(
    <StoryViewer
      userStories={userStories}
      initialUserIndex={0}
      onClose={mockOnClose}
    />
  );

  expect(
    getByAltText(`${userStories[0].username}'s story`)
  ).toBeInTheDocument();
  expect(getByText(userStories[0].username)).toBeInTheDocument();
});

test('advances to next story after progress completes', () => {
  const mockOnClose = vi.fn();
  const { getByAltText } = render(
    <StoryViewer
      userStories={userStories}
      initialUserIndex={0}
      onClose={mockOnClose}
    />
  );

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(getByAltText(`${userStories[0].username}'s story`)).toHaveAttribute(
    'src',
    userStories[0].stories[1].imageUrl
  );
});

test('closes viewer when reaching end of all stories', () => {
  const mockOnClose = vi.fn();

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(mockOnClose).toHaveBeenCalled();
});

test('handles touch navigation', () => {
  const mockOnClose = vi.fn();
  const { container } = render(
    <StoryViewer
      userStories={userStories}
      initialUserIndex={1}
      onClose={mockOnClose}
    />
  );

  fireEvent.touchStart(container.firstChild!, {
    touches: [{ clientX: 300 }],
  });

  fireEvent.touchMove(container.firstChild!, {
    touches: [{ clientX: 100 }],
  });

  fireEvent.touchEnd(container.firstChild!);

  expect(container).toMatchSnapshot();
});

test('marks stories as viewed when navigating', () => {
  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(userStories[0].stories[0].viewed).toBe(true);
});
