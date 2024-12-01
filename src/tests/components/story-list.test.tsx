import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoriesList } from '../../components/story-list';
import { userStories } from '../../data/stories';

test('renders all story circles', () => {
  const mockOnStoryClick = vi.fn();
  const { getAllByRole } = render(
    <StoriesList userStories={userStories} onStoryClick={mockOnStoryClick} />
  );

  const storyButtons = getAllByRole('button');
  expect(storyButtons).toHaveLength(userStories.length);
});

test('displays correct usernames for each story', () => {
  const mockOnStoryClick = vi.fn();
  const { getAllByText } = render(
    <StoriesList userStories={userStories} onStoryClick={mockOnStoryClick} />
  );

  userStories.forEach(story => {
    expect(getAllByText(story.username)[0]).toBeInTheDocument();
  });
});

test('calls onStoryClick with correct index when clicking a story', () => {
  const mockOnStoryClick = vi.fn();
  const { getAllByRole } = render(
    <StoriesList userStories={userStories} onStoryClick={mockOnStoryClick} />
  );

  const secondStory = getAllByRole('button')[1];
  fireEvent.click(secondStory);
  expect(mockOnStoryClick).toHaveBeenCalledWith(1);
});
