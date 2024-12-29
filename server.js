const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const allQuestions = require('./questions');

app.use(express.static('public'));

const players = new Map();
let gameInProgress = false;
let currentQuestion = 0;
let questions = [];
let answerTimeout;
let gameHost = null;

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getRandomQuestions(count) {
    return shuffleArray(allQuestions).slice(0, count);
}

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGame', (playerName) => {
        if (gameInProgress) {
            socket.emit('gameFull');
            return;
        }

        if (players.size >= 20) {
            socket.emit('gameFull');
            return;
        }

        players.set(socket.id, {
            name: playerName,
            score: 0,
            answered: false
        });

        // First player becomes the host
        if (!gameHost) {
            gameHost = socket.id;
        }

        io.emit('playerJoined', {
            players: Array.from(players.values()),
            isHost: socket.id === gameHost
        });
    });

    socket.on('startGame', () => {
        if (socket.id === gameHost && !gameInProgress && players.size > 0) {
            gameInProgress = true;
            currentQuestion = 0;
            // Get 20 random questions when the game starts
            questions = getRandomQuestions(20);
            
            io.emit('gameStart', {
                question: questions[0], // Send only the first question
                currentQuestion: 0,
                totalQuestions: questions.length,
                players: Array.from(players.values())
            });
            startAnswerTimeout();
        }
    });

    socket.on('submitAnswer', (answer) => {
        const player = players.get(socket.id);
        if (player && !player.answered && gameInProgress) {
            player.answered = true;
            if (answer === questions[currentQuestion].correct) {
                player.score += 100;
            }
            io.emit('updateScores', Array.from(players.values()));

            // Check if all players have answered
            const allAnswered = Array.from(players.values()).every(p => p.answered);
            if (allAnswered) {
                clearTimeout(answerTimeout);
                moveToNextQuestion();
            }
        }
    });

    socket.on('disconnect', () => {
        if (players.has(socket.id)) {
            players.delete(socket.id);
            if (socket.id === gameHost) {
                const remainingPlayers = Array.from(players.keys());
                if (remainingPlayers.length > 0) {
                    gameHost = remainingPlayers[0];
                    io.to(gameHost).emit('youAreHost');
                } else {
                    gameHost = null;
                }
            }
            io.emit('playerLeft', Array.from(players.values()));
        }
    });
});

function startAnswerTimeout() {
    clearTimeout(answerTimeout);
    answerTimeout = setTimeout(moveToNextQuestion, 10000);
}

function moveToNextQuestion() {
    currentQuestion++;
    
    // Reset answered status for all players
    for (let player of players.values()) {
        player.answered = false;
    }

    if (currentQuestion < questions.length) {
        io.emit('newQuestion', {
            question: questions[currentQuestion],
            currentQuestion: currentQuestion,
            players: Array.from(players.values())
        });
        startAnswerTimeout();
    } else {
        // Game is over
        gameInProgress = false;
        io.emit('gameOver', Array.from(players.values()));
        
        // Reset game state
        currentQuestion = 0;
        questions = [];
        gameHost = null;
        
        // Reset player scores
        for (let player of players.values()) {
            player.score = 0;
            player.answered = false;
        }
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
