const socket = io();

// DOM Elements
const playerNameInput = document.getElementById('player-name');
const joinButton = document.getElementById('join-btn');
const playerList = document.getElementById('player-list');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('timer');
const startGameBtn = document.getElementById('start-game-btn');
const startGameMessage = document.getElementById('start-game-message');
const hostControls = document.getElementById('host-controls');
const questionNumber = document.getElementById('question-number');
const muteBtn = document.getElementById('mute-btn');
const mutedIcon = muteBtn.querySelector('.muted');
const unmutedIcon = muteBtn.querySelector('.unmuted');

let isHost = false;
let currentQuestionNumber = 0;
let playerName;

// Event Listeners
joinButton.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('joinGame', playerName);
        showScreen('waiting-screen');
    }
});

startGameBtn.addEventListener('click', () => {
    if (!startGameBtn.classList.contains('disabled')) {
        socket.emit('startGame');
    }
});

muteBtn.addEventListener('click', () => {
    const isMuted = soundManager.toggleMute();
    mutedIcon.classList.toggle('hidden', !isMuted);
    unmutedIcon.classList.toggle('hidden', isMuted);
});

// Socket Events
socket.on('gameFull', () => {
    alert('Game is full or already in progress!');
});

socket.on('playerJoined', (data) => {
    updatePlayerList(data.players);
    updateStartMessage(data.playerCount);
});

socket.on('gameStart', (data) => {
    showScreen('game-screen');
    currentQuestionNumber = data.currentQuestion + 1;
    questionNumber.textContent = currentQuestionNumber + '/' + data.totalQuestions;
    displayQuestion(data.question);
    startSnowfall();
    soundManager.playBackground();
});

socket.on('newQuestion', (data) => {
    currentQuestionNumber = data.currentQuestion + 1;
    questionNumber.textContent = currentQuestionNumber + '/20';
    displayQuestion(data.question);
});

socket.on('updateTimer', (data) => {
    updateTimer(data.time);
});

socket.on('gameOver', (rankedPlayers) => {
    showScreen('scoreboard-screen');
    displayFinalScores(rankedPlayers);
    // Only play victory sound for top 3 players
    const currentPlayer = rankedPlayers.find(p => p.name === playerName);
    if (currentPlayer && currentPlayer.rank <= 3) {
        soundManager.playGameOver();
    }
});

socket.on('playerLeft', (data) => {
    updatePlayerList(data.players);
    updateStartMessage(data.playerCount);
});

socket.on('youAreHost', (data) => {
    isHost = true;
    hostControls.classList.remove('hidden');
    updateStartMessage(data.playerCount, data.minPlayers);
});

socket.on('answerResult', (data) => {
    const options = optionsContainer.getElementsByClassName('option');
    const selectedOption = options[data.selectedAnswer];
    const correctOption = options[data.correctAnswer];
    
    if (data.correct) {
        selectedOption.classList.add('correct');
        soundManager.playCorrect();
    } else {
        selectedOption.classList.add('incorrect');
        correctOption.classList.add('correct');
        soundManager.playIncorrect();
    }
});

socket.on('updateStartButton', (data) => {
    isHost = data.isHost;
    if (isHost) {
        hostControls.classList.remove('hidden');
    }
    updateStartMessage(data.playerCount, data.minPlayers);
});

// Helper Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function updatePlayerList(players) {
    playerList.innerHTML = '';
    players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('player-item');
        if (player.isHost) {
            playerElement.classList.add('host');
            playerElement.textContent = `${player.name} (Host)`;
        } else {
            playerElement.textContent = player.name;
        }
        playerList.appendChild(playerElement);
    });
}

function displayQuestion(question) {
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(index) {
    socket.emit('submitAnswer', index);
    disableOptions();
}

function disableOptions() {
    const options = optionsContainer.getElementsByClassName('option');
    for (let option of options) {
        option.classList.add('disabled');
    }
}

function updateTimer(time) {
    if (time < 0) time = 0;
    timerDisplay.textContent = time;
    
    // Only add the warning class for 3 seconds or less
    if (time <= 3) {
        timerDisplay.classList.add('warning');
    } else {
        timerDisplay.classList.remove('warning');
    }
}

function displayFinalScores(players) {
    const scoreboardContent = document.getElementById('final-scoreboard');
    scoreboardContent.innerHTML = '<h2>Final Scores</h2>';
    
    players.forEach(player => {
        const playerScore = document.createElement('div');
        playerScore.classList.add('final-score-item');
        
        // Add medal emoji for top 3
        let medal = '';
        if (player.rank === 1) medal = '🥇 ';
        else if (player.rank === 2) medal = '🥈 ';
        else if (player.rank === 3) medal = '🥉 ';
        
        playerScore.textContent = `${medal}${player.name}: ${player.score} points`;
        
        // Highlight current player
        if (player.name === playerName) {
            playerScore.classList.add('current-player');
        }
        
        // Add special styling for top 3
        if (player.rank <= 3) {
            playerScore.classList.add(`rank-${player.rank}`);
        }
        
        scoreboardContent.appendChild(playerScore);
    });
}

function updateStartMessage(playerCount, minPlayers = 2) {
    if (!isHost) return;

    if (playerCount >= minPlayers) {
        startGameBtn.classList.remove('disabled');
        startGameMessage.textContent = 'Click Start Game when ready!';
    } else {
        startGameBtn.classList.add('disabled');
        startGameMessage.textContent = `Waiting for more players... (${playerCount}/${minPlayers})`;
    }
}

// Snowfall effect
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Random starting position across the width of the screen
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    
    // Random size variation (smaller range)
    const size = Math.random() * 0.7 + 0.5; // Size between 0.5em and 1.2em
    snowflake.style.fontSize = size + 'em';
    
    // Random opacity
    snowflake.style.opacity = Math.random() * 0.3 + 0.5; // Between 0.5 and 0.8
    
    // Random fall duration
    const fallDuration = Math.random() * 3 + 7; // Between 7 and 10 seconds
    snowflake.style.animationDuration = fallDuration + 's';
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation
    setTimeout(() => {
        snowflake.remove();
    }, fallDuration * 1000);
}

// Create snowflakes at regular intervals
function startSnowfall() {
    // Create initial batch of snowflakes
    for (let i = 0; i < 30; i++) { // Reduced from 75 to 30
        setTimeout(createSnowflake, Math.random() * 3000);
    }
    
    // Continue creating snowflakes less frequently
    setInterval(createSnowflake, 300); // Increased from 150 to 300ms
}

// Preload sounds when the page loads
window.addEventListener('load', () => {
    soundManager.preloadAll();
});
