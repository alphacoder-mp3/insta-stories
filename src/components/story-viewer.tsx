import { useEffect, useState, useCallback, useMemo, useRef, memo } from 'react';
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
    const [preloadedImages, setPreloadedImages] = useState<{
      [key: string]: string;
    }>({});
    const [transitionDirection, setTransitionDirection] = useState<
      'left' | 'right' | null
    >(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Preload images for smooth experience
    const preloadImages = useCallback(() => {
      const imagesToPreload: { [key: string]: string } = {};

      userStories.forEach((user, userIndex) => {
        user.stories.forEach((story, storyIndex) => {
          const key = `${userIndex}-${storyIndex}`;
          imagesToPreload[key] = story.imageUrl;
        });
      });

      Object.entries(imagesToPreload).forEach(([key, url]) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setPreloadedImages(prev => ({
            ...prev,
            [key]: url,
          }));
        };
      });
    }, [userStories]);

    useEffect(() => {
      preloadImages();
    }, [preloadImages]);

    const currentUser = useMemo(
      () => userStories[currentUserIndex],
      [userStories, currentUserIndex]
    );
    const currentStory = useMemo(
      () => currentUser.stories[currentStoryIndex],
      [currentUser, currentStoryIndex]
    );

    // Transition helpers
    const applyTransition = useCallback((direction: 'left' | 'right') => {
      setTransitionDirection(direction);

      if (containerRef.current) {
        containerRef.current.classList.add(
          'transition-transform',
          'duration-500',
          'ease-in-out'
        );

        if (direction === 'left') {
          containerRef.current.style.transform = 'rotateY(-90deg)';
        } else {
          containerRef.current.style.transform = 'rotateY(90deg)';
        }
      }

      // Reset transition after animation
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove(
            'transition-transform',
            'duration-500',
            'ease-in-out'
          );
          containerRef.current.style.transform = 'rotateY(0deg)';
        }
        setTransitionDirection(null);
      }, 500);
    }, []);

    const markCurrentStoryAsViewed = useCallback(() => {
      currentUser.stories[currentStoryIndex].viewed = true;
      if (currentUser.stories.every(story => story.viewed)) {
        currentUser.viewed = true;
      }
    }, [currentUser, currentStoryIndex]);

    const handleClose = useCallback(() => {
      markCurrentStoryAsViewed();
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
        applyTransition('left');
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
      applyTransition,
    ]);

    const goToPreviousStory = useCallback(() => {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(prev => prev - 1);
        setProgress(0);
      } else if (currentUserIndex > 0) {
        applyTransition('right');
        setCurrentUserIndex(prev => prev - 1);
        setCurrentStoryIndex(
          userStories[currentUserIndex - 1].stories.length - 1
        );
        setProgress(0);
      }
    }, [currentStoryIndex, currentUserIndex, userStories, applyTransition]);

    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
      onSwipeLeft: useCallback(() => {
        if (currentUserIndex < userStories.length - 1) {
          markCurrentStoryAsViewed();
          applyTransition('left');
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
        applyTransition,
      ]),
      onSwipeRight: useCallback(() => {
        if (currentUserIndex > 0) {
          applyTransition('right');
          setCurrentUserIndex(prev => prev - 1);
          setCurrentStoryIndex(0);
          setProgress(0);
        }
      }, [currentUserIndex, applyTransition]),
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

    // Get preloaded image or fallback to original
    const getCurrentImage = useCallback(() => {
      const key = `${currentUserIndex}-${currentStoryIndex}`;
      return preloadedImages[key] || currentStory.imageUrl;
    }, [currentUserIndex, currentStoryIndex, preloadedImages, currentStory]);

    return (
      <div
        className="fixed inset-0 bg-black z-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`relative h-full ${
            transitionDirection === 'left'
              ? 'transition-transform translate-x-[-100%]'
              : transitionDirection === 'right'
              ? 'transition-transform translate-x-[100%]'
              : ''
          }`}
          ref={containerRef}
        >
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
            key={getCurrentImage()}
            src={getCurrentImage()}
            alt={`${currentUser.username}'s story`}
            className="w-full h-full object-cover"
            loading="lazy"
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
