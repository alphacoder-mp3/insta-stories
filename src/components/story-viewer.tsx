import React, { useEffect, useState } from 'react';
import { useSwipe } from '../hooks/use-swipe';
import { useStoryState } from '../hooks/use-story-state';
import { StoryImage } from './story-image';
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
  const {
    state,
    progress,
    setProgress,
    isAnimating,
    setIsAnimating,
    currentUser,
    currentStory,
    nextUser,
    prevUser,
    goToNextStory,
    goToPreviousStory,
    togglePlayback,
    handleClose,
  } = useStoryState(userStories, initialUserIndex, onClose);

  const [nextImageLoaded, setNextImageLoaded] = useState(false);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: () => {
      if (
        state.currentUserIndex < userStories.length - 1 &&
        !isAnimating &&
        nextImageLoaded
      ) {
        setIsAnimating(true);
        goToNextStory();
      }
    },
    onSwipeRight: () => {
      if (state.currentUserIndex > 0 && !isAnimating) {
        setIsAnimating(true);
        goToPreviousStory();
      }
    },
  });

  useEffect(() => {
    if (!state.isPlaying) return;

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
  }, [
    state.currentUserIndex,
    state.currentStoryIndex,
    state.isPlaying,
    goToNextStory,
    setProgress,
  ]);

  const handleTouchArea = (e: React.MouseEvent) => {
    if (isAnimating) return;

    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX < innerWidth / 3) {
      goToPreviousStory();
    } else if (clientX > (innerWidth * 2) / 3) {
      goToNextStory();
    } else {
      togglePlayback();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0">
        {/* Current Story */}
        <StoryImage
          imageUrl={currentStory.imageUrl}
          username={currentUser.username}
          className={`transform transition-transform duration-300 ease-out ${
            state.swipeDirection === 'left'
              ? '-translate-x-full'
              : state.swipeDirection === 'right'
              ? 'translate-x-full'
              : ''
          }`}
        />

        {/* Next Story (Preloaded) */}
        {nextUser && (
          <StoryImage
            imageUrl={nextUser.stories[0].imageUrl}
            username={nextUser.username}
            className={`transform translate-x-full transition-transform duration-300 ease-out ${
              state.swipeDirection === 'left' ? 'translate-x-0' : ''
            }`}
            onLoad={() => setNextImageLoaded(true)}
          />
        )}

        {/* Previous Story (Preloaded) */}
        {prevUser && (
          <StoryImage
            imageUrl={prevUser.stories[prevUser.stories.length - 1].imageUrl}
            username={prevUser.username}
            className={`transform -translate-x-full transition-transform duration-300 ease-out ${
              state.swipeDirection === 'right' ? 'translate-x-0' : ''
            }`}
          />
        )}

        {/* UI Overlay */}
        <div className="absolute top-0 w-full z-10 p-2 space-y-2">
          <div className="flex space-x-1">
            {currentUser.stories.map((_, idx) => (
              <div key={idx} className="h-0.5 bg-gray-600 flex-1">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: `${
                      idx === state.currentStoryIndex
                        ? progress
                        : idx < state.currentStoryIndex
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
            <button onClick={handleClose} className="ml-auto text-white p-2">
              ✕
            </button>
          </div>
        </div>

        {/* Touch Areas */}
        <div className="absolute inset-0 flex" onClick={handleTouchArea}>
          <div className="w-1/3" />
          <div className="w-1/3" />
          <div className="w-1/3" />
        </div>
      </div>
    </div>
  );
};
