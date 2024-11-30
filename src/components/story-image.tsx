import React, { useEffect } from 'react';

interface StoryImageProps {
  imageUrl: string;
  username: string;
  className?: string;
  onLoad?: () => void;
}

export const StoryImage: React.FC<StoryImageProps> = ({
  imageUrl,
  username,
  className = '',
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };
  }, [imageUrl, onLoad]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 bg-black animate-pulse" />}
      <img
        src={imageUrl}
        alt={`${username}'s story`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
