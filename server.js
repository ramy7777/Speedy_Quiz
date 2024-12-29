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
                gameStarted: false,
                hostId: socket.id // First player becomes the host
            });
        }

        const room = rooms.get(roomId);
        room.players.push({
            id: socket.id,
            name: playerName,
            score: 0,
            answered: false,
            isHost: room.players.length === 0 // First player is the host
        });

        // Emit room joined event with host status
        socket.emit('roomJoined', { 
            roomId, 
            players: room.players,
            isHost: room.players.length === 1,
            minPlayers: 2,
            maxPlayers: 20
        });
        
        // Broadcast to other players
        socket.to(roomId).emit('playerJoined', { 
            players: room.players
        });

        // Changed from 6 to 2 players for testing
        if (room.players.length >= 2) {
            // Do not start game automatically
            // startGame(roomId);
        }
    });

    socket.on('startGame', (roomId) => {
        const room = rooms.get(roomId);
        if (!room || room.hostId !== socket.id || room.players.length < 2) return;

        room.gameStarted = true;
        room.currentQuestion = 0;
        io.to(roomId).emit('gameStart', { 
            questions: questions,
            currentQuestion: 0,
            players: room.players
        });
    });

    socket.on('answer', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player || player.answered) return;

        player.answered = true;
        const question = questions[room.currentQuestion];
        const isCorrect = data.answer === question.correct;

        if (isCorrect) {
            player.score += 1;
        }

        // Send immediate feedback to the player who answered
        socket.emit('answerResult', {
            selectedAnswer: data.answer,
            correctAnswer: question.correct,
            correct: isCorrect
        });

        // Check if all players have answered
        const allAnswered = room.players.every(p => p.answered);
        if (allAnswered) {
            setTimeout(() => {
                room.currentQuestion++;
                if (room.currentQuestion < questions.length) {
                    // Reset answered state for all players
                    room.players.forEach(player => player.answered = false);
                    io.to(data.roomId).emit('newQuestion', {
                        currentQuestion: room.currentQuestion,
                        players: room.players
                    });
                } else {
                    io.to(data.roomId).emit('gameOver', {
                        players: room.players.sort((a, b) => b.score - a.score)
                    });
                }
            }, 2000); // Show correct answer for 2 seconds
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        for (const [roomId, room] of rooms) {
            const playerIndex = room.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);
                
                // If host disconnects, assign new host
                if (room.hostId === socket.id && room.players.length > 0) {
                    room.hostId = room.players[0].id;
                    room.players[0].isHost = true;
                    io.to(roomId).emit('newHost', { 
                        hostId: room.players[0].id 
                    });
                }

                io.to(roomId).emit('playerLeft', { 
                    players: room.players 
                });

                // If room is empty, remove it
                if (room.players.length === 0) {
                    rooms.delete(roomId);
                }
                break;
            }
        }
    });
});

function findAvailableRoom() {
    for (const [roomId, room] of rooms) {
        if (room.players.length < 20 && !room.gameStarted) {
            return roomId;
        }
    }
    return 'room-' + Date.now();
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Virtual Worlds New Year Team Building game server running on port ${PORT}`);
});
