# GSU Panther Chatbot Frontend

A modern React-based frontend for the GSU Panther Chatbot application.

## Features

- **Interactive Demo Interface**: Three main screens (Home, Chat, Voice)
- **Theme Support**: Light/Dark mode with GSU Blue color scheme
- **Responsive Design**: Mobile-first layout with smooth transitions
- **Component Architecture**: Modular React components for maintainability
- **Accessibility**: ARIA labels and keyboard navigation support

## Screens

1. **Home Screen**: Panther image hero, intro text, Start New Chat, suggestions
2. **Chat Screen**: Pounce banner (3D panel placeholder), chat interface with upload support
3. **Voice Screen**: Speech-to-text interface, opened by clicking Pounce banner

## Components

- `HeaderBar`: Top navigation with hamburger menu and theme toggle
- `Sidebar`: Slide-out navigation panel (20% width on desktop, 80% on mobile)
- `Card`: Reusable card component with consistent styling
- `Badge`: Small badge component for tags and labels
- `ScreenHome`, `ScreenChat`, `ScreenVoice`: Main screen components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Build for Production

```bash
npm run build
if you run into any error make sure to cd into the right folder 
```

## Color Scheme

- **GSU Blue**: #0039A6
- **GSU Red**: #C60C30
- **Dark Theme**: Blue/Black combination
- **Light Theme**: Blue/White combination

## Notes

- Replace Pounce image placeholders with real assets
- Hook up real 3D panel where the masthead area is in Chat screen
- Integrate with backend API for actual chatbot functionality
- Add speech-to-text API integration for voice features

## File Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main screen components
├── hooks/              # Custom React hooks
├── constants/          # App constants (colors, etc.)
├── App.js             # Main app component
└── index.js           # App entry point
```
