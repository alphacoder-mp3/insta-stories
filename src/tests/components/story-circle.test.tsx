import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StoryCircle } from '../../components/story-circle';
import { userStories } from '../../data/stories';

test('renders story circle with correct user information', () => {
  const mockOnClick = vi.fn();
  const { getByAltText, getByText } = render(
    <StoryCircle userStory={userStories[0]} onClick={mockOnClick} />
  );

  expect(getByAltText(userStories[0].username)).toBeInTheDocument();
  expect(getByText(userStories[0].username)).toBeInTheDocument();
});

test('applies correct gradient class when stories are not viewed', () => {
  const mockOnClick = vi.fn();
  const { container } = render(
    <StoryCircle userStory={userStories[0]} onClick={mockOnClick} />
  );

  const gradientElement = container.querySelector('.bg-gradient-to-tr');
  expect(gradientElement).toBeInTheDocument();
});

test('applies gray background when all stories are viewed', () => {
  const mockOnClick = vi.fn();
  const viewedUserStory = {
    ...userStories[0],
    viewed: true,
    stories: userStories[0].stories.map(story => ({ ...story, viewed: true })),
  };

  const { container } = render(
    <StoryCircle userStory={viewedUserStory} onClick={mockOnClick} />
  );

  const grayElement = container.querySelector('.bg-gray-500');
  expect(grayElement).toBeInTheDocument();
});

test('calls onClick handler when clicked', () => {
  const mockOnClick = vi.fn();
  const { getByRole } = render(
    <StoryCircle userStory={userStories[0]} onClick={mockOnClick} />
  );

  fireEvent.click(getByRole('button'));
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
