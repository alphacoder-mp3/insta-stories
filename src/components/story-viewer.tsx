import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useSwipe } from '../hooks/use-swipe';
import type { UserStories } from '../types/story';

interface StoryViewerProps {
  userStories: UserStories[];
  initialUserIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = memo(
  ({ userStories, initialUserIndex, onClose }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const currentUser = useMemo(
      () => userStories[currentUserIndex],
      [userStories, currentUserIndex]
    );
    const currentStory = useMemo(
      () => currentUser.stories[currentStoryIndex],
      [currentUser, currentStoryIndex]
    );

    const markCurrentStoryAsViewed = useCallback(() => {
      currentUser.stories[currentStoryIndex].viewed = true;
      if (currentUser.stories.every(story => story.viewed)) {
        currentUser.viewed = true;
      }
    }, [currentUser, currentStoryIndex]);

    const handleClose = useCallback(() => {
      markCurrentStoryAsViewed();
      // If we're on the last story, mark all previous stories as viewed too
      if (currentStoryIndex === currentUser.stories.length - 1) {
        currentUser.stories.forEach(story => {
          story.viewed = true;
        });
        currentUser.viewed = true;
      }
      onClose();
    }, [markCurrentStoryAsViewed, currentStoryIndex, currentUser, onClose]);

    const goToNextStory = useCallback(() => {
      markCurrentStoryAsViewed();

      if (currentStoryIndex < currentUser.stories.length - 1) {
        setCurrentStoryIndex(prev => prev + 1);
        setProgress(0);
      } else if (currentUserIndex < userStories.length - 1) {
        currentUser.viewed = true;
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
        setProgress(0);
      } else {
        handleClose();
      }
    }, [
      markCurrentStoryAsViewed,
      currentStoryIndex,
      currentUser,
      currentUserIndex,
      userStories.length,
      handleClose,
    ]);

    const goToPreviousStory = useCallback(() => {
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
    }, [currentStoryIndex, currentUserIndex, userStories]);

    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
      onSwipeLeft: useCallback(() => {
        if (currentUserIndex < userStories.length - 1) {
          markCurrentStoryAsViewed();
          currentUser.viewed = true;
          setCurrentUserIndex(prev => prev + 1);
          setCurrentStoryIndex(0);
          setProgress(0);
        }
      }, [
        currentUserIndex,
        userStories.length,
        markCurrentStoryAsViewed,
        currentUser,
      ]),
      onSwipeRight: useCallback(() => {
        if (currentUserIndex > 0) {
          setCurrentUserIndex(prev => prev - 1);
          setCurrentStoryIndex(0);
          setProgress(0);
        }
      }, [currentUserIndex]),
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
    }, [goToNextStory]);

    const handleTouchArea = useCallback(
      (e: React.MouseEvent) => {
        const { clientX } = e;
        const { innerWidth } = window;

        if (clientX < innerWidth / 3) {
          goToPreviousStory();
        } else if (clientX > (innerWidth * 2) / 3) {
          goToNextStory();
        }
      },
      [goToPreviousStory, goToNextStory]
    );

    return (
      <div
        className="fixed inset-0 bg-black z-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-full">
          {/* Progress Indicators */}
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

            {/* Story Header */}
            <div className="flex items-center">
              <img
                src={currentUser.profilePic}
                alt={currentUser.username}
                className="w-8 h-8 rounded-full object-cover"
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

          {/* Story Image */}
          <img
            src={currentStory.imageUrl}
            alt={`${currentUser.username}'s story`}
            className="w-full h-full object-cover"
          />

          {/* Touch Navigation Areas */}
          <div className="absolute inset-0 flex" onClick={handleTouchArea}>
            <div className="w-1/3" />
            <div className="w-1/3" />
            <div className="w-1/3" />
          </div>
        </div>
      </div>
    );
  }
);
