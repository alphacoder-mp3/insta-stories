# Instagram Stories Clone

A performant and mobile-optimized Instagram Stories clone built with React, TypeScript, and Tailwind CSS. View the live demo at [https://insta-stories-beta.vercel.app](https://insta-stories-beta.vercel.app)

## Features

- 📱 Mobile-first design
- 🖼️ Smooth story transitions
- 👆 Touch and swipe gestures
- 🔄 Automatic story progression
- 💾 Story view state management
- 🖼️ Image preloading for performance
- ⚡ Optimized rendering with React.memo
- 🧪 Comprehensive test coverage

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alphacoder-mp3/insta-stories.git
cd insta-stories
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your mobile browser or use device emulation in desktop Chrome.

### Running Tests

```bash
npm run test
```

## Design Choices & Optimizations

### Performance Optimizations

1. **Image Preloading**

   - Implemented smart preloading of adjacent stories
   - Uses a preloading queue to manage memory efficiently
   - Prevents layout shifts during story transitions

2. **Component Optimization**

   - Used React.memo for StoryViewer component
   - Implemented custom hooks for state management
   - Separated concerns into focused components

3. **Gesture Handling**

   - Custom useSwipe hook for efficient touch handling
   - Debounced gesture handlers for smooth interactions
   - Optimized touch area calculations

4. **State Management**
   - Local state management with useState and useCallback
   - Efficient story progression tracking
   - Optimized view state updates

### Architecture Decisions

1. **Component Structure**

   - StoryCircle: Individual story preview
   - StoriesList: Horizontal scrollable list
   - StoryViewer: Full-screen story view
   - Clear separation of concerns

2. **Custom Hooks**

   - useSwipe: Touch gesture handling
   - useStoryState: Story progression logic
   - Promotes reusability and testing

3. **Mobile-First Approach**
   - Tailwind CSS for responsive design
   - Touch-optimized interactions
   - Mobile-specific UI patterns

### Scalability Considerations

1. **Code Organization**

   - Modular file structure
   - Clear separation of types
   - Reusable components and hooks

2. **Data Management**

   - Extensible story data structure
   - Easy to integrate with backend APIs
   - Efficient state updates

3. **Testing Strategy**
   - Component unit tests
   - Integration tests for user flows
   - Mocked touch events

## Project Structure

```
src/
├── components/          # React components
│   ├── story-circle.tsx
│   ├── story-list.tsx
│   └── story-viewer.tsx
├── hooks/              # Custom React hooks
│   ├── use-swipe.ts
│   └── use-story-state.ts
├── types/              # TypeScript types
│   └── story.ts
├── data/              # Mock data
│   └── stories.ts
└── tests/             # Test files
    └── App.test.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
