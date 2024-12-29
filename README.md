# Virtual Worlds New Year Team Building Game

## Project Overview
This project is a multiplayer trivia game called **Virtual Worlds New Year Team Building**. Players compete in a fast-paced trivia game where the goal is to answer correctly and quickly. The game supports 2-10 players and includes various trivia questions.

### Technologies Used
- **Node.js**: Backend server
- **Express**: Web framework for Node.js
- **Socket.IO**: Real-time communication between clients and server
- **HTML/CSS/JavaScript**: Frontend development

## Development Workflow
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

### Running the Game Locally
1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000`.
3. Open multiple browser windows to simulate different players.

### Adding New Features or Questions
1. **To add new questions**:
   - Edit the `questions` array in `server.js` or create a separate file for questions.
2. **To add new features**:
   - Modify the frontend files in the `public` directory or the backend logic in `server.js`.

### Testing and Debugging
- Use the browser console for frontend debugging.
- Use console logs in the server code to track server-side issues.

## Code Structure
- **`server.js`**: Main server file that handles game logic and socket communication.
- **`public/index.html`**: Main HTML file for the game interface.
- **`public/game.js`**: Client-side JavaScript for handling game interactions.
- **`public/style.css`**: Styles for the game interface.
- **`package.json`**: Project metadata and dependencies.

## Deployment Instructions
1. Ensure the server is running correctly locally.
2. For deployment, you can use platforms like Heroku, Vercel, or DigitalOcean.
3. Follow the specific instructions for your chosen platform to deploy the Node.js application.

## Future Development Suggestions
- Add more trivia categories and questions.
- Implement user authentication for player profiles.
- Create a leaderboard system to track player scores over time.
- Add animations and sound effects for a more engaging experience.

---

This document serves as a guide for understanding the project and continuing its development. Feel free to reach out for any clarifications or assistance!
