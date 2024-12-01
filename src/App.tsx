import { useState } from 'react';
import { StoriesList } from './components/story-list';
import { StoryViewer } from './components/story-viewer';
import { userStories } from './data/stories';

function App() {
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );

  const handleStoryClick = (index: number) => {
    setSelectedUserIndex(index);
  };

  const handleClose = () => {
    setSelectedUserIndex(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="hidden sm:flex text-white min-h-screen items-center justify-center font-bold">
        {' '}
        Only available on mobile devices.
      </div>
      <StoriesList userStories={userStories} onStoryClick={handleStoryClick} />

      {selectedUserIndex !== null && (
        <StoryViewer
          userStories={userStories}
          initialUserIndex={selectedUserIndex}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

export default App;
