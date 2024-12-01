import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { userStories } from '../data/stories';

test('renders stories list on mobile view', () => {
  const { getAllByRole } = render(<App />);
  const storyButtons = getAllByRole('button');
  // Each story has a button in StoriesList
  expect(storyButtons).toHaveLength(userStories.length);
});

test('shows mobile-only message on desktop', () => {
  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });

  const { getByText } = render(<App />);
  expect(getByText('Only available on mobile devices.')).toBeInTheDocument();
});

test('opens story viewer when clicking a story', () => {
  const { getAllByRole, getByAltText } = render(<App />);
  const firstStory = getAllByRole('button')[0];

  fireEvent.click(firstStory);

  // Check if the first user's story image is displayed
  expect(
    getByAltText(`${userStories[0].username}'s story`)
  ).toBeInTheDocument();
});

test('closes story viewer when clicking close button', () => {
  const { getAllByRole, getByText, queryByAltText } = render(<App />);

  // Open story viewer
  fireEvent.click(getAllByRole('button')[0]);

  // Click close button
  fireEvent.click(getByText('✕'));

  // Verify story viewer is closed
  expect(
    queryByAltText(`${userStories[0].username}'s story`)
  ).not.toBeInTheDocument();
});

test('marks story as viewed after viewing', () => {
  const { getAllByRole, getByText } = render(<App />);

  // Open first story
  fireEvent.click(getAllByRole('button')[0]);

  // Close the story
  fireEvent.click(getByText('✕'));

  // Verify the story is marked as viewed (check for gray gradient)
  const storyCircle = getAllByRole('button')[0];
  expect(storyCircle.querySelector('.bg-gray-500')).toBeTruthy();
});

test('advances to next story on right side click', () => {
  const { getAllByRole, getByAltText } = render(<App />);

  // Open first story
  fireEvent.click(getAllByRole('button')[0]);

  // Click on the right third of the screen
  const storyViewer = getByAltText(
    `${userStories[0].username}'s story`
  ).parentElement;
  if (storyViewer) {
    const rightThird = storyViewer.querySelector('div:last-child');
    fireEvent.click(rightThird as Element);
  }

  // Verify we're on the second story
  expect(getByAltText(`${userStories[0].username}'s story`)).toHaveAttribute(
    'src',
    userStories[0].stories[1].imageUrl
  );
});

test('goes to previous story on left side click', async () => {
  const { getAllByRole, getByAltText } = render(<App />);

  // Open first story and advance to second story
  fireEvent.click(getAllByRole('button')[0]);
  const storyViewer = getByAltText(
    `${userStories[0].username}'s story`
  ).parentElement;
  if (storyViewer) {
    const rightThird = storyViewer.querySelector('div:last-child');
    fireEvent.click(rightThird as Element);
  }

  // Click on the left third of the screen
  if (storyViewer) {
    const leftThird = storyViewer.querySelector('div:first-child');
    fireEvent.click(leftThird as Element);
  }

  // Verify we're back on the first story
  expect(getByAltText(`${userStories[0].username}'s story`)).toHaveAttribute(
    'src',
    userStories[0].stories[0].imageUrl
  );
});
