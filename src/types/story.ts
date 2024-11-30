export interface Story {
  id: string;
  imageUrl: string;
  timestamp: string;
  viewed: boolean;
}

export interface UserStories {
  userId: string;
  username: string;
  profilePic: string;
  stories: Story[];
  viewed: boolean;
}

export interface StoriesState {
  currentUserIndex: number;
  currentStoryIndex: number;
  isPlaying: boolean;
  swipeDirection: 'left' | 'right' | null;
}
