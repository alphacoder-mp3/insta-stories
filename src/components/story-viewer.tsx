import React, { useEffect, useState } from 'react';
import type { Story } from '../types/story';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryChange: (index: number) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  onStoryChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, stories.length, onClose]);

  useEffect(() => {
    onStoryChange(currentIndex);
  }, [currentIndex, onStoryChange]);

  const handleTouchArea = (e: React.MouseEvent) => {
    const { clientX } = e;
    const { innerWidth } = window;

    if (clientX < innerWidth / 2) {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setProgress(0);
      }
    } else {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setProgress(0);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        <div className="absolute top-0 w-full z-10 p-2 space-y-2">
          <div className="flex space-x-1">
            {stories.map((_, idx) => (
              <div key={idx} className="h-0.5 bg-gray-600 flex-1">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: `${
                      idx === currentIndex
                        ? progress
                        : idx < currentIndex
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
              src={stories[currentIndex].imageUrl}
              alt={stories[currentIndex].username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white ml-2">
              {stories[currentIndex].username}
            </span>
            <button onClick={onClose} className="ml-auto text-white p-2">
              ✕
            </button>
          </div>
        </div>

        <img
          src={stories[currentIndex].imageUrl}
          alt={stories[currentIndex].username}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex" onClick={handleTouchArea}>
          <div className="w-1/2" />
          <div className="w-1/2" />
        </div>
      </div>
    </div>
  );
};
