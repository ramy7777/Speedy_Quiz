# Imad & Doaa New Year's Party Game

## Project Overview
This is a festive multiplayer trivia game designed for Imad & Doaa's New Year's party. Players compete in answering trivia questions with Christmas-themed visuals and sounds. The game supports 2-20 players and includes 200 diverse trivia questions.

### Core Features
1. **Multiplayer Support**
   - 2-20 players per game
   - Real-time player synchronization
   - Automatic host assignment
   - Dynamic player joining/leaving handling

2. **Game Mechanics**
   - 20 random questions per game from a pool of 200
   - 10-second timer per question
   - Real-time score updates
   - Answer feedback with color indicators
   - Automatic game progression

3. **User Experience**
   - Festive snowfall animation
   - Christmas background music
   - Sound effects for correct/incorrect answers
   - Victory sounds for top 3 winners
   - Mobile haptic feedback
   - Responsive design for all devices

4. **Visual Elements**
   - Medal emojis for top 3 players (🥇, 🥈, 🥉)
   - Dancing celebration messages
   - Color-coded answer feedback
   - Animated timer with warning states
   - Mute/unmute sound control

### Technologies Used
- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript
- **Audio**: Web Audio API
- **Mobile Features**: Vibration API

## Development Guide

### Setting Up the Development Environment
1. Clone the repository:
   ```bash
   git clone https://github.com/ramy7777/Speedy_Quiz.git
   cd Speedy_Quiz
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Access the game at `http://localhost:3000`

### Key Components

#### Server-Side (server.js)
- Game state management
- Player synchronization
- Question randomization
- Score tracking
- Timer management

#### Client-Side
- **game.js**: Game logic and Socket.IO events
- **soundManager.js**: Audio control and effects
- **style.css**: Responsive styling and animations
- **index.html**: Game interface and structure

### Issues and Solutions

1. **Host Control Issue**
   - **Problem**: Start button enabled immediately when host joined
   - **Solution**: Implemented proper player count check and button state management
   - **Files Modified**: `server.js`, `game.js`

2. **Game State Reset**
   - **Problem**: Game showing "already running" on refresh
   - **Solution**: Added proper game state reset when all players leave
   - **Files Modified**: `server.js`

3. **Sound Management**
   - **Problem**: Sounds playing even when muted
   - **Solution**: Implemented centralized sound manager with mute state
   - **Files Modified**: `soundManager.js`, `game.js`

4. **Mobile Experience**
   - **Problem**: Lack of feedback on mobile devices
   - **Solution**: Added haptic feedback using Vibration API
   - **Files Modified**: `game.js`

5. **Score Display**
   - **Problem**: Scoreboard errors and null references
   - **Solution**: Redesigned scoreboard with proper DOM handling
   - **Files Modified**: `game.js`, `style.css`

### Recent Improvements

1. **Enhanced Winner Recognition**
   - Added unique dancing messages for top 3 players
   - Implemented animated text effects
   - Added medal emojis and special styling

2. **Audio System**
   - Background Christmas music
   - Sound effects for answers
   - Victory fanfare for winners
   - Global mute control

3. **Mobile Optimization**
   - Haptic feedback for answers
   - Responsive design improvements
   - Better touch interaction

### Future Development Suggestions

1. **Features to Add**
   - User authentication system
   - Persistent leaderboard
   - More question categories
   - Custom game rooms
   - Chat functionality

2. **Potential Improvements**
   - Additional sound effects
   - More animations
   - Question difficulty levels
   - Team play mode
   - Custom timer settings

### Common Development Tasks

1. **Adding New Questions**
   - Edit `questions.js`
   - Follow existing question format
   - Ensure proper answer indexing

2. **Modifying Game Rules**
   - Timer duration: Update `TIMER_DURATION` in `server.js`
   - Player limits: Modify checks in `joinGame` event
   - Question count: Adjust in `getRandomQuestions`

3. **Styling Changes**
   - Theme colors: Edit CSS variables in `style.css`
   - Animations: Modify keyframes in `style.css`
   - Layout: Update flex/grid layouts as needed

### Deployment Notes

1. **Prerequisites**
   - Node.js environment
   - npm package manager
   - Git for version control

2. **Environment Setup**
   - Set PORT in environment variables
   - Configure any external service keys
   - Set up proper error logging

3. **Maintenance**
   - Regular dependency updates
   - Socket connection monitoring
   - Server resource management

## Support and Documentation
For additional support or questions, please refer to:
- [Socket.IO Documentation](https://socket.io/docs/v4)
- [Express.js Guide](https://expressjs.com/guide/routing.html)
- [Project Issues Page](https://github.com/ramy7777/Speedy_Quiz/issues)

---

This documentation is maintained and updated regularly. Last update: December 29, 2024
