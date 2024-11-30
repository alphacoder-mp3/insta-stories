import { useState, useCallback, useRef, useEffect } from 'react';
import type { UserStories, StoriesState } from '../types/story';

export const useStoryState = (
  userStories: UserStories[],
  initialUserIndex: number,
  onClose: () => void
) => {
  const [state, setState] = useState<StoriesState>({
    currentUserIndex: initialUserIndex,
    currentStoryIndex: 0,
    isPlaying: true,
    swipeDirection: null,
  });

  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  const currentUser = userStories[state.currentUserIndex];
  const currentStory = currentUser.stories[state.currentStoryIndex];
  const nextUser = userStories[state.currentUserIndex + 1];
  const prevUser = userStories[state.currentUserIndex - 1];

  // Preload images for smooth transitions
  useEffect(() => {
    const imagesToPreload = [];
    if (nextUser) {
      imagesToPreload.push(nextUser.stories[0].imageUrl);
    }
    if (prevUser) {
      imagesToPreload.push(
        prevUser.stories[prevUser.stories.length - 1].imageUrl
      );
    }

    preloadedImages.current = imagesToPreload.map(url => {
      const img = new Image();
      img.src = url;
      return img;
    });

    return () => {
      preloadedImages.current = [];
    };
  }, [state.currentUserIndex, nextUser, prevUser]);

  const markStoryAsViewed = useCallback(() => {
    currentUser.stories[state.currentStoryIndex].viewed = true;
    if (currentUser.stories.every(story => story.viewed)) {
      currentUser.viewed = true;
    }
  }, [currentUser, state.currentStoryIndex]);

  const handleClose = useCallback(() => {
    markStoryAsViewed();
    if (state.currentStoryIndex === currentUser.stories.length - 1) {
      currentUser.viewed = true;
    }
    onClose();
  }, [currentUser, state.currentStoryIndex, markStoryAsViewed, onClose]);

  const goToNextStory = useCallback(() => {
    markStoryAsViewed();

    if (state.currentStoryIndex < currentUser.stories.length - 1) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex + 1,
        swipeDirection: null,
      }));
      setProgress(0);
    } else if (state.currentUserIndex < userStories.length - 1) {
      setIsAnimating(true);
      setState(prev => ({
        ...prev,
        currentUserIndex: prev.currentUserIndex + 1,
        currentStoryIndex: 0,
        swipeDirection: 'left',
      }));
      setProgress(0);
    } else {
      handleClose();
    }
  }, [
    state,
    currentUser.stories.length,
    userStories.length,
    markStoryAsViewed,
    handleClose,
  ]);

  const goToPreviousStory = useCallback(() => {
    if (state.currentStoryIndex > 0) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex - 1,
        swipeDirection: null,
      }));
      setProgress(0);
    } else if (state.currentUserIndex > 0) {
      setIsAnimating(true);
      const prevUser = userStories[state.currentUserIndex - 1];
      setState(prev => ({
        ...prev,
        currentUserIndex: prev.currentUserIndex - 1,
        currentStoryIndex: prevUser.stories.length - 1,
        swipeDirection: 'right',
      }));
      setProgress(0);
    }
  }, [state, userStories]);

  const togglePlayback = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return {
    state,
    setState,
    progress,
    setProgress,
    isAnimating,
    setIsAnimating,
    currentUser,
    currentStory,
    nextUser,
    prevUser,
    markStoryAsViewed,
    goToNextStory,
    goToPreviousStory,
    togglePlayback,
    handleClose,
  };
};
