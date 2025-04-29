# Sourdough Companion

<div align="left">
  <img src="assets/icon.png" alt="Sourdough Companion Logo" width="200"/>
</div>

## Description

Sourdough Companion is a modern web application designed to help bakers create, manage, and track their sourdough bread recipes. It provides an intuitive interface for:

- Creating and saving custom sourdough recipes
- Managing flour compositions with precise percentages
- Calculating ingredient amounts based on dough ball size and quantity
- Tracking the baking process with a detailed Baker's Journal
- Recording results and reflections for each bake
- Exporting recipes as professional PDF documents

## Key Features

- **Dynamic Recipe Calculator**: Automatically calculates ingredient amounts based on:
  - Number of dough balls
  - Weight per dough ball
  - Hydration percentage
  - Salt percentage
  - Starter percentage
  - Custom flour combinations
  - Additional ingredients

- **Baker's Journal**: 
  - Chronological tracking of each step
  - Automatic time delta calculations between steps
  - Detailed notes for each action

- **Recipe Management**:
  - Save and load recipes
  - Export as professional PDF documents
  - Track recipe modifications

- **Cross-Platform Support**:
  - Web application for browser access
  - Desktop application via Electron for macOS, Windows, and Linux
  - Local file system integration for recipe storage in desktop mode

## Technology Stack

- **Frontend**:
  - React 18
  - TypeScript
  - TailwindCSS for styling
  - Phosphor Icons
  - @react-pdf/renderer for PDF generation

- **State Management**:
  - React Context API
  - Custom hooks for business logic

- **Storage**:
  - Local Storage for recipe persistence
  - File system integration for recipe import/export

- **Build Tools**:
  - Vite
  - Node.js
  - npm

## Desktop Application

Sourdough Companion is available as a desktop application powered by Electron, providing native-like features:

### Desktop Features
- Local file system integration for recipe storage
- Native system notifications
- Offline functionality
- System tray integration
- Native window management

### Desktop Installation

1. Download the latest release for your platform:
   - macOS: `Sourdough-Companion.dmg`
   - Windows: `Sourdough-Companion-Setup.exe`
   - Linux: `sourdough-companion.AppImage`

2. Install the application:
   - macOS: Drag to Applications folder
   - Windows: Run the installer
   - Linux: Make the AppImage executable and run

### Building Desktop Version

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   # For your current platform
   npm run dist

   # For specific platforms
   npm run dist:mac
   npm run dist:win
   npm run dist:linux
   ```

4. Find the packaged application in the `dist` directory

### Development Notes

When developing the desktop application:
- Use `npm run dev` for hot-reload development
- Desktop-specific code is in `main.js` and `preload.js`
- IPC communication handles file system operations
- Electron security best practices are implemented

## Web Application

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sourdough-companion.git
   cd sourdough-companion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

## Development

### Project Structure

```
sourdough-companion/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── store/         # Context and state management
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── assets/           # Static assets
├── public/           # Public assets
└── dist/            # Production build output
```

### Key Components

- `RecipeSettings`: Manages basic recipe parameters
- `FlourTypes`: Handles flour composition with percentage calculations
- `Baker's Journal`: Tracks the baking process timeline
- `RecipeOutput`: Displays calculated ingredient amounts
- `RecipeStorageHeader`: Manages recipe saving and loading

## Testing

Run the test suite:

```bash
npm test
```

## Building for Production

1. Create a production build:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist/` directory

3. You can serve the production build locally:
   ```bash
   npm run serve
   ```

## Credits

This application was developed with the assistance of Goose, an AI assistant created by Block Inc. Goose provided guidance and suggestions throughout the development process, helping with:

- Application architecture design
- Component structure and implementation
- State management solutions
- UI/UX improvements
- Bug fixes and optimizations

---

<div align="center">
  <sub>Built with ❤️ and 🍞</sub>
</div>