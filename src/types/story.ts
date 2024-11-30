export interface Story {
  id: string;
  imageUrl: string;
  username: string;
  timestamp: string;
}

export interface StoriesState {
  currentStoryIndex: number;
  isPlaying: boolean;
  currentGroupIndex: number;
}
