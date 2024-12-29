const socket = io();

// DOM Elements
const playerNameInput = document.getElementById('player-name');
const joinButton = document.getElementById('join-btn');
const playerList = document.getElementById('player-list');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('timer');
const scoreboardList = document.getElementById('scoreboard-list');
const playAgainBtn = document.getElementById('play-again-btn');
const startGameBtn = document.getElementById('start-game-btn');
const startGameMessage = document.getElementById('start-game-message');
const hostControls = document.getElementById('host-controls');
const questionNumber = document.getElementById('question-number');

let isHost = false;
let currentQuestionNumber = 0;

// Event Listeners
joinButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('joinGame', playerName);
        showScreen('waiting-screen');
    }
});

playAgainBtn.addEventListener('click', () => {
    showScreen('login-screen');
    playerNameInput.value = '';
});

startGameBtn.addEventListener('click', () => {
    if (!startGameBtn.classList.contains('disabled')) {
        socket.emit('startGame');
    }
});

// Socket Events
socket.on('gameFull', () => {
    alert('Game is full or already in progress!');
});

socket.on('playerJoined', (data) => {
    isHost = data.isHost;
    
    if (isHost) {
        hostControls.classList.remove('hidden');
        startGameBtn.classList.remove('disabled');
        startGameMessage.textContent = 'Click Start Game when ready!';
    }
    
    updatePlayerList(data.players);
});

socket.on('gameStart', (data) => {
    showScreen('game-screen');
    currentQuestionNumber = data.currentQuestion + 1;
    questionNumber.textContent = currentQuestionNumber + '/' + data.totalQuestions;
    displayQuestion(data.question);
    updateScoreboard(data.players);
    startSnowfall();
});

socket.on('newQuestion', (data) => {
    currentQuestionNumber = data.currentQuestion + 1;
    questionNumber.textContent = currentQuestionNumber + '/20';
    displayQuestion(data.question);
    updateScoreboard(data.players);
});

socket.on('updateTimer', (data) => {
    updateTimer(data.time);
});

socket.on('updateScores', (players) => {
    updateScoreboard(players);
});

socket.on('gameOver', (players) => {
    showScreen('scoreboard-screen');
    displayFinalScores(players);
});

socket.on('playerLeft', (players) => {
    updatePlayerList(players);
});

socket.on('youAreHost', () => {
    isHost = true;
    hostControls.classList.remove('hidden');
    startGameBtn.classList.remove('disabled');
    startGameMessage.textContent = 'Click Start Game when ready!';
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
        playerElement.textContent = player.name + (player.isHost ? ' (Host)' : '');
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

function updateScoreboard(players) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    scoreboardList.innerHTML = '';
    
    sortedPlayers.forEach(player => {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('score-item');
        scoreItem.textContent = `${player.name}: ${player.score}`;
        scoreboardList.appendChild(scoreItem);
    });
}

function displayFinalScores(players) {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    scoreboardList.innerHTML = '';
    
    sortedPlayers.forEach((player, index) => {
        const scoreItem = document.createElement('div');
        scoreItem.classList.add('score-item');
        if (index === 0) scoreItem.classList.add('winner');
        scoreItem.textContent = `${player.name}: ${player.score}`;
        scoreboardList.appendChild(scoreItem);
    });
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
