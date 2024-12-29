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
let currentQuestion = 0;
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
    currentQuestion = data.currentQuestion;
    totalQuestions = questions.length;
    displayQuestion(questions[currentQuestion]);
    updateScoreboard(data.players);
    startTimer();
});

socket.on('newQuestion', (data) => {
    currentQuestion = data.currentQuestion;
    displayQuestion(questions[currentQuestion]);
    updateScoreboard(data.players);
    startTimer();
});

socket.on('answerResult', (data) => {
    const options = optionsContainer.children;
    const correctOption = options[data.correctAnswer];
    const selectedOption = options[data.selectedAnswer];

    if (data.correct) {
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('incorrect');
        correctOption.classList.add('correct');
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
    
    document.getElementById('question-number').textContent = `${currentQuestion + 1}/${totalQuestions}`;
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

function selectAnswer(answerIndex) {
    socket.emit('answer', {
        roomId: currentRoom,
        answer: answerIndex
    });
}

function disableOptions() {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.style.pointerEvents = 'none';
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