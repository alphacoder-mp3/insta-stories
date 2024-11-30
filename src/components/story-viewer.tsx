import React, { useEffect, useState } from 'react';
import { useSwipe } from '../hooks/use-swipe';
import type { UserStories } from '../types/story';

interface StoryViewerProps {
  userStories: UserStories[];
  initialUserIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  userStories,
  initialUserIndex,
  onClose,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentUser = userStories[currentUserIndex];
  const currentStory = currentUser.stories[currentStoryIndex];

  const goToNextStory = () => {
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < userStories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(
        userStories[currentUserIndex - 1].stories.length - 1
      );
      setProgress(0);
    }
  };

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      if (currentUserIndex < userStories.length - 1) {
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
        setProgress(0);
      }
    },
    onSwipeRight: () => {
      if (currentUserIndex > 0) {
        setCurrentUserIndex(prev => prev - 1);
        setCurrentStoryIndex(0);
        setProgress(0);
      }
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goToNextStory();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserIndex, currentStoryIndex]);

  const handleTouchArea = (e: React.MouseEvent) => {
    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX < innerWidth / 3) {
      goToPreviousStory();
    } else if (clientX > (innerWidth * 2) / 3) {
      goToNextStory();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full">
        <div className="absolute top-0 w-full z-10 p-2 space-y-2">
          <div className="flex space-x-1">
            {currentUser.stories.map((_, idx) => (
              <div key={idx} className="h-0.5 bg-gray-600 flex-1">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: `${
                      idx === currentStoryIndex
                        ? progress
                        : idx < currentStoryIndex
                        ? 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <img
              src={currentUser.profilePic}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white ml-2">{currentUser.username}</span>
            <span className="text-gray-400 text-sm ml-2">
              {currentStory.timestamp}
            </span>
            <button onClick={onClose} className="ml-auto text-white p-2">
              ✕
            </button>
          </div>
        </div>

        <img
          src={currentStory.imageUrl}
          alt={`${currentUser.username}'s story`}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex" onClick={handleTouchArea}>
          <div className="w-1/3" />
          <div className="w-1/3" />
          <div className="w-1/3" />
        </div>
      </div>
    </div>
  );
};
