import { useState } from 'react';
import { StoriesList } from './components/story-list';
import { StoryViewer } from './components/story-viewer';
import { stories } from './data/stories';

function App() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleClose = () => {
    setSelectedStoryIndex(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="hidden sm:flex text-white min-h-screen items-center justify-center font-bold">
        {' '}
        Only available on mobile devices.
      </div>
      <StoriesList stories={stories} onStoryClick={handleStoryClick} />

      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleClose}
          onStoryChange={setSelectedStoryIndex}
        />
      )}
    </div>
  );
}

export default App;
