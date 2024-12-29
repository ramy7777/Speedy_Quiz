const socket = io();

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    waiting: document.getElementById('waiting-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const playerNameInput = document.getElementById('player-name');
const joinButton = document.getElementById('join-btn');
const playerList = document.getElementById('player-list');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const timerDisplay = document.getElementById('timer');
const scoreboardList = document.getElementById('scoreboard-list');
const playAgainBtn = document.getElementById('play-again-btn');

let currentRoom = null;
let gameTimer = null;

// Event Listeners
joinButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        socket.emit('joinGame', playerName);
    }
});

playAgainBtn.addEventListener('click', () => {
    showScreen('login');
    playerNameInput.value = '';
});

// Socket Events
socket.on('roomJoined', (data) => {
    currentRoom = data.roomId;
    updatePlayerList(data.players);
    showScreen('waiting');
});

socket.on('playerJoined', (data) => {
    updatePlayerList(data.players);
});

socket.on('gameStart', (data) => {
    showScreen('game');
    displayQuestion(data.question);
    updateScoreboard(data.players);
    startTimer();
});

socket.on('newQuestion', (data) => {
    displayQuestion(data.question);
    updateScoreboard(data.players);
    startTimer();
});

socket.on('gameEnd', (data) => {
    clearInterval(gameTimer);
    showScreen('result');
    displayWinner(data.winner);
    displayFinalScores(data.players);
});

socket.on('scoreUpdate', (data) => {
    updateScoreboard(data.players);
});

socket.on('revealAnswer', (data) => {
    const options = optionsContainer.children;
    for (let i = 0; i < options.length; i++) {
        if (i === data.correct) {
            options[i].style.backgroundColor = '#4CAF50';
        } else {
            options[i].style.backgroundColor = '#ff4444';
        }
    }
});

socket.on('answerResult', (data) => {
    const options = optionsContainer.children;
    const selectedOption = options[data.selectedAnswer];
    
    if (data.isCorrect) {
        selectedOption.style.backgroundColor = '#4CAF50'; // Green
    } else {
        selectedOption.style.backgroundColor = '#ff4444'; // Red
        // Show the correct answer in green
        options[data.correctAnswer].style.backgroundColor = '#4CAF50';
    }
});

// Helper Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function updatePlayerList(players) {
    playerList.innerHTML = players
        .map(player => `<div class="player-item">${player.name}</div>`)
        .join('');
}

function displayQuestion(question) {
    questionText.textContent = question.question;
    optionsContainer.innerHTML = question.options
        .map((option, index) => `
            <div class="option" onclick="submitAnswer(${index})">
                ${option}
            </div>
        `).join('');
    // Reset pointer-events to allow clicking
    optionsContainer.style.pointerEvents = 'auto';
    
    // Reset the background colors of options
    const options = optionsContainer.children;
    for (let i = 0; i < options.length; i++) {
        options[i].style.backgroundColor = '';
    }
}

function startTimer() {
    let timeLeft = 10;
    clearInterval(gameTimer);
    
    timerDisplay.textContent = timeLeft;
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            submitAnswer(-1); // Submit no answer
        }
    }, 1000);
}

function submitAnswer(answerIndex) {
    clearInterval(gameTimer);
    
    // Get the current question from the question text
    const currentQuestion = questionText.textContent;
    
    // Immediately show the selected answer's result
    const options = optionsContainer.children;
    const selectedOption = options[answerIndex];
    
    // Add visual feedback classes
    for (let i = 0; i < options.length; i++) {
        if (i === answerIndex) {
            selectedOption.classList.add('selected');
        }
        options[i].classList.add('disabled');
    }
    
    socket.emit('answer', {
        roomId: currentRoom,
        answer: answerIndex
    });
    optionsContainer.style.pointerEvents = 'none';
}

function updateScoreboard(players) {
    scoreboardList.innerHTML = players
        .map(player => `
            <div class="player-score">
                <span>${player.name}</span>
                <span>${player.score}</span>
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
