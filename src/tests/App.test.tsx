import { test, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { stories } from '../data/stories';

test('renders stories list', () => {
  const { getAllByRole } = render(<App />);
  const storyButtons = getAllByRole('button');
  expect(storyButtons).toHaveLength(stories.length);
});

test('opens story viewer when clicking a story', () => {
  const { getAllByRole, getByAltText } = render(<App />);
  const firstStory = getAllByRole('button')[0];

  fireEvent.click(firstStory);

  expect(getByAltText(stories[0].username)).toBeInTheDocument();
});

test('advances to next story after 5 seconds', async () => {
  vi.useFakeTimers();
  const { getAllByRole, getByAltText } = render(<App />);

  fireEvent.click(getAllByRole('button')[0]);

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(getByAltText(stories[1].username)).toBeInTheDocument();

  vi.useRealTimers();
});

test('closes story viewer when reaching the end', async () => {
  vi.useFakeTimers();
  const { getAllByRole, queryByRole } = render(<App />);

  fireEvent.click(getAllByRole('button')[stories.length - 1]);

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(queryByRole('dialog')).not.toBeInTheDocument();

  vi.useRealTimers();
});
