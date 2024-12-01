import type { UserStories } from '../types/story';

interface StoryCircleProps {
  userStory: UserStories;
  onClick: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({
  userStory,
  onClick,
}) => {
  const allStoriesViewed = userStory.viewed;
  const gradientClass = allStoriesViewed
    ? 'bg-gray-500'
    : 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600';

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center space-y-1 p-1"
    >
      <div className={`w-16 h-16 rounded-full p-0.5 ${gradientClass}`}>
        <div className="w-full h-full rounded-full p-0.5 bg-black">
          <img
            src={userStory.profilePic}
            alt={userStory.username}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <span className="text-xs text-white truncate w-16 text-center">
        {userStory.username}
      </span>
    </button>
  );
};
