const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const rooms = new Map();
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    // Add more questions here
];

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGame', (playerName) => {
        let roomId = findAvailableRoom();
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                players: [],
                currentQuestion: 0,
                gameStarted: false
            });
        }

        const room = rooms.get(roomId);
        room.players.push({
            id: socket.id,
            name: playerName,
            score: 0,
            answered: false
        });

        socket.emit('roomJoined', { roomId, players: room.players });
        socket.to(roomId).emit('playerJoined', { players: room.players });

        // Changed from 6 to 2 players for testing
        if (room.players.length >= 2) {
            startGame(roomId);
        }
    });

    socket.on('answer', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player) return;

        // Mark player as answered to prevent multiple answers
        if (player.answered) return;
        player.answered = true;

        const question = questions[room.currentQuestion];
        const isCorrect = data.answer === question.correct;
        
        // Send immediate feedback to the player who answered
        socket.emit('answerResult', {
            selectedAnswer: data.answer,
            correctAnswer: question.correct,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            player.score += 1;
        }

        // Broadcast updated scores to all players
        io.to(data.roomId).emit('scoreUpdate', {
            players: room.players
        });

        const allAnswered = room.players.every(p => p.answered);
        if (allAnswered) {
            // Show correct answer to all players
            io.to(data.roomId).emit('revealAnswer', {
                correct: question.correct,
                players: room.players
            });

            // Wait 2 seconds before next question
            setTimeout(() => {
                nextQuestion(data.roomId);
            }, 2000);
        }
    });

    socket.on('disconnect', () => {
        // Handle player disconnect
        console.log('User disconnected');
    });
});

function findAvailableRoom() {
    for (const [roomId, room] of rooms) {
        if (room.players.length < 10 && !room.gameStarted) {
            return roomId;
        }
    }
    return 'room-' + Date.now();
}

function startGame(roomId) {
    const room = rooms.get(roomId);
    room.gameStarted = true;
    io.to(roomId).emit('gameStart', { 
        question: questions[0],
        players: room.players
    });
}

function nextQuestion(roomId) {
    const room = rooms.get(roomId);
    room.currentQuestion++;
    
    // Reset answered state for all players
    room.players.forEach(player => {
        player.answered = false;
    });
    
    if (room.currentQuestion < questions.length) {
        io.to(roomId).emit('newQuestion', {
            question: questions[room.currentQuestion],
            players: room.players
        });
    } else {
        endGame(roomId);
    }
}

function endGame(roomId) {
    const room = rooms.get(roomId);
    const winner = room.players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
    );
    
    io.to(roomId).emit('gameEnd', {
        winner: winner,
        players: room.players
    });
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Virtual Worlds New Year Team Building game server running on port ${PORT}`);
});
