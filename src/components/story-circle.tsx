import React from 'react';
import type { Story } from '../types/story';

interface StoryCircleProps {
  story: Story;
  onClick: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({ story, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center space-y-1 p-1"
    >
      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
        <div className="w-full h-full rounded-full p-0.5 bg-white">
          <img
            src={story.imageUrl}
            alt={story.username}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <span className="text-xs truncate w-16 text-center">
        {story.username}
      </span>
    </button>
  );
};
