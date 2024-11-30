import React from 'react';
import { StoryCircle } from './story-circle';
import type { Story } from '../types/story';

interface StoriesListProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
}

export const StoriesList: React.FC<StoriesListProps> = ({
  stories,
  onStoryClick,
}) => {
  return (
    <div className="overflow-x-auto sm:hidden">
      <div className="flex space-x-4 p-4">
        {stories.map((story, index) => (
          <StoryCircle
            key={story.id}
            story={story}
            onClick={() => onStoryClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
