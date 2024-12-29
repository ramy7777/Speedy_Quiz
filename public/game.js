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

let currentRoom = null;
let gameTimer = null;
let isHost = false;
let questions = [];
let currentQuestionNumber = 0;
let totalQuestions = 0;

// Event Listeners
joinButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('joinGame', playerName);
    }
});

playAgainBtn.addEventListener('click', () => {
    showScreen('login-screen');
    playerNameInput.value = '';
});

startGameBtn.addEventListener('click', () => {
    if (!startGameBtn.classList.contains('disabled')) {
        socket.emit('startGame', currentRoom);
    }
});

// Socket Events
socket.on('roomJoined', (data) => {
    currentRoom = data.roomId;
    isHost = data.isHost;
    
    if (isHost) {
        hostControls.classList.remove('hidden');
    }
    
    updatePlayerList(data.players);
    updateStartButton(data.players.length, data.minPlayers);
    showScreen('waiting-screen');
});

socket.on('playerJoined', (data) => {
    updatePlayerList(data.players);
    updateStartButton(data.players.length, 2);
});

socket.on('playerLeft', (data) => {
    updatePlayerList(data.players);
    updateStartButton(data.players.length, 2);
});

socket.on('newHost', (data) => {
    if (socket.id === data.hostId) {
        isHost = true;
        hostControls.classList.remove('hidden');
    }
});

socket.on('gameStart', (data) => {
    showScreen('game-screen');
    questions = data.questions;
    currentQuestionNumber = data.currentQuestion;
    totalQuestions = questions.length;
    displayQuestion(questions[currentQuestionNumber]);
    updateScoreboard(data.players);
    startTimer();
    startSnowfall(); // Start the snowfall effect
});

socket.on('newQuestion', (data) => {
    clearInterval(gameTimer);
    currentQuestionNumber = data.currentQuestion;
    document.getElementById('question-number').textContent = `${currentQuestionNumber + 1}/${questions.length}`;
    
    const questionData = questions[currentQuestionNumber];
    questionText.textContent = questionData.question;
    
    // Clear previous options and their styles
    optionsContainer.innerHTML = '';
    questionData.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.textContent = option;
        button.className = 'option';
        button.onclick = () => {
            if (!button.classList.contains('disabled')) {
                selectAnswer(index);
                disableOptions();
            }
        };
        optionsContainer.appendChild(button);
    });
    
    startTimer();
    updateScoreboard(data.players);
});

socket.on('answerResult', (data) => {
    const options = optionsContainer.children;
    
    // Only show results if the player actually answered
    if (data.selectedAnswer !== null) {
        const correctOption = options[data.correctAnswer];
        const selectedOption = options[data.selectedAnswer];
        if (data.correct) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            correctOption.classList.add('correct');
        }
    }
});

socket.on('gameOver', (data) => {
    showScreen('scoreboard-screen');
    updateScoreboard(data.players);
});

// Helper Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function updatePlayerList(players) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = players
        .map(player => `
            <div class="player-item">
                <span>${player.name}</span>
                ${player.isHost ? '<span class="host-badge">Host</span>' : ''}
            </div>
        `).join('');
}

function displayQuestion(question) {
    if (!question) return;
    
    document.getElementById('question-number').textContent = `${currentQuestionNumber + 1}/${totalQuestions}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    optionsContainer.style.pointerEvents = 'auto';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => {
            if (!optionDiv.classList.contains('disabled')) {
                selectAnswer(index);
                disableOptions();
            }
        };
        optionsContainer.appendChild(optionDiv);
    });
}

function selectAnswer(index) {
    socket.emit('answer', {
        roomId: currentRoom,
        answer: index
    });
}

function disableOptions() {
    const options = optionsContainer.children;
    for (let option of options) {
        option.classList.add('disabled');
    }
}

function startTimer() {
    let timeLeft = 10;
    clearInterval(gameTimer);
    
    updateTimer(timeLeft);
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            disableOptions();
            socket.emit('timeoutAnswer', {
                roomId: currentRoom
            });
        }
    }, 1000);
}

function updateTimer(time) {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = time;
    
    if (time <= 3) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

function updateScoreboard(players) {
    const scoreboardList = document.getElementById('scoreboard-list');
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    
    scoreboardList.innerHTML = sortedPlayers
        .map((player, index) => `
            <div class="player-score">
                <span>${index + 1}. ${player.name}</span>
                <span class="score">${player.score} points</span>
            </div>
        `).join('');
}

function displayWinner(winner) {
    document.getElementById('winner-display').innerHTML = `
        Winner: ${winner.name} (Score: ${winner.score})
    `;
}

function displayFinalScores(players) {
    document.getElementById('final-scores').innerHTML = players
        .sort((a, b) => b.score - a.score)
        .map(player => `
            <div class="player-score">
                <span>${player.name}</span>
                <span>${player.score}</span>
            </div>
        `).join('');
}

function updateStartButton(playerCount, minPlayers) {
    if (isHost) {
        if (playerCount >= minPlayers) {
            startGameBtn.classList.remove('disabled');
            startGameMessage.textContent = 'Click to start the game!';
        } else {
            startGameBtn.classList.add('disabled');
            startGameMessage.textContent = `Waiting for more players... (${playerCount}/${minPlayers})`;
        }
    }
}

// Snowfall effect
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Random starting position
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    
    // Random size between 3px and 10px
    const size = Math.random() * 7 + 3;
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    
    // Random opacity between 0.4 and 1
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    
    // Random animation duration between 5s and 10s
    const duration = Math.random() * 5 + 5;
    snowflake.style.animationDuration = duration + 's';
    
    // Add some horizontal movement
    const startPosition = Math.random() * window.innerWidth;
    const endPosition = startPosition + (Math.random() * 100 - 50);
    
    snowflake.animate([
        { transform: `translateX(${startPosition}px) translateY(-10px)` },
        { transform: `translateX(${endPosition}px) translateY(${window.innerHeight + 10}px)` }
    ], {
        duration: duration * 1000,
        easing: 'linear',
        fill: 'forwards'
    });
    
    document.body.appendChild(snowflake);
    
    // Remove snowflake after animation
    setTimeout(() => {
        snowflake.remove();
    }, duration * 1000);
}

// Create snowflakes at regular intervals
function startSnowfall() {
    // Create initial batch of snowflakes
    for (let i = 0; i < 20; i++) {
        setTimeout(createSnowflake, Math.random() * 3000);
    }
    
    // Continue creating snowflakes
    setInterval(createSnowflake, 200);
}
