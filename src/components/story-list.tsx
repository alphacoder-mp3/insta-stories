import React from 'react';
import { StoryCircle } from './story-circle';
import type { UserStories } from '../types/story';

interface StoriesListProps {
  userStories: UserStories[];
  onStoryClick: (index: number) => void;
}

export const StoriesList: React.FC<StoriesListProps> = ({
  userStories,
  onStoryClick,
}) => {
  return (
    <div className="overflow-x-auto sm:hidden">
      <div className="flex space-x-4 p-4">
        {userStories.map((userStory, index) => (
          <StoryCircle
            key={userStory.userId}
            userStory={userStory}
            onClick={() => onStoryClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
