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
let timerInterval;
let currentTimer = 10;

function resetGameState() {
    gameInProgress = false;
    currentQuestion = 0;
    questions = [];
    gameHost = null;
    currentTimer = 10;
    clearInterval(timerInterval);
    clearTimeout(answerTimeout);
    players.clear();
}

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

function startTimer() {
    clearInterval(timerInterval);
    clearTimeout(answerTimeout);
    
    currentTimer = 10;
    io.emit('updateTimer', { time: currentTimer });
    
    timerInterval = setInterval(() => {
        currentTimer--;
        io.emit('updateTimer', { time: currentTimer });
        
        if (currentTimer <= 0) {
            clearInterval(timerInterval);
            moveToNextQuestion();
        }
    }, 1000);
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
            answered: false,
            isHost: !gameHost // First player becomes host
        });

        // First player becomes the host
        if (!gameHost) {
            gameHost = socket.id;
        }

        const playersList = Array.from(players.values()).map((player, index) => ({
            ...player,
            isHost: players.get(Array.from(players.keys())[index]) === players.get(gameHost)
        }));

        // Broadcast to all players
        io.emit('playerJoined', {
            players: playersList,
            playerCount: players.size
        });

        // Send specific message to host
        if (gameHost) {
            io.to(gameHost).emit('updateStartButton', {
                playerCount: players.size,
                minPlayers: 2,
                isHost: true
            });
        }
    });

    socket.on('startGame', () => {
        if (socket.id === gameHost && !gameInProgress && players.size > 0) {
            gameInProgress = true;
            currentQuestion = 0;
            questions = getRandomQuestions(20);
            
            io.emit('gameStart', {
                question: questions[0],
                currentQuestion: 0,
                totalQuestions: questions.length,
                players: Array.from(players.values())
            });
            
            startTimer();
        }
    });

    socket.on('submitAnswer', (answer) => {
        const player = players.get(socket.id);
        if (player && !player.answered && gameInProgress) {
            player.answered = true;
            const isCorrect = answer === questions[currentQuestion].correct;
            if (isCorrect) {
                player.score += 100;
            }
            
            // Send back the result to the player who answered
            socket.emit('answerResult', {
                correct: isCorrect,
                selectedAnswer: answer,
                correctAnswer: questions[currentQuestion].correct
            });
            
            io.emit('updateScores', Array.from(players.values()));

            // Check if all players have answered
            const allAnswered = Array.from(players.values()).every(p => p.answered);
            if (allAnswered) {
                clearInterval(timerInterval);
                // Wait 2 seconds to show the correct/incorrect colors
                setTimeout(() => {
                    moveToNextQuestion();
                }, 2000);
            }
        }
    });

    socket.on('disconnect', () => {
        if (players.has(socket.id)) {
            players.delete(socket.id);
            
            // If no players left, reset the game
            if (players.size === 0) {
                resetGameState();
            } else if (socket.id === gameHost) {
                // If host left but other players remain, assign new host
                const remainingPlayers = Array.from(players.keys());
                gameHost = remainingPlayers[0];
                
                // Update player's host status
                players.get(gameHost).isHost = true;
                
                // Notify new host
                io.to(gameHost).emit('youAreHost', {
                    playerCount: players.size,
                    minPlayers: 2
                });
            }

            const playersList = Array.from(players.values()).map((player, index) => ({
                ...player,
                isHost: players.get(Array.from(players.keys())[index]) === players.get(gameHost)
            }));
            
            // Update all clients
            io.emit('playerLeft', {
                players: playersList,
                playerCount: players.size
            });

            // Update host's start button
            if (gameHost) {
                io.to(gameHost).emit('updateStartButton', {
                    playerCount: players.size,
                    minPlayers: 2,
                    isHost: true
                });
            }
        }
    });
});

function moveToNextQuestion() {
    clearInterval(timerInterval);
    currentTimer = 10;
    currentQuestion++;
    
    if (currentQuestion >= questions.length) {
        // Game is over
        const sortedPlayers = Array.from(players.values())
            .sort((a, b) => b.score - a.score);

        // Add rank to players
        const rankedPlayers = sortedPlayers.map((player, index) => ({
            ...player,
            rank: index + 1
        }));

        io.emit('gameOver', rankedPlayers);
        resetGameState();
    } else {
        // Reset answered status for all players
        for (let [id, player] of players) {
            player.answered = false;
        }
        io.emit('newQuestion', {
            question: questions[currentQuestion],
            currentQuestion: currentQuestion,
            totalQuestions: questions.length,
            players: Array.from(players.values())
        });
        startTimer();
    }
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
