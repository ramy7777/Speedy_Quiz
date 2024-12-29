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
    {
        question: "In which city does the most famous New Year's Eve ball drop take place?",
        options: ["Chicago", "Los Angeles", "New York City", "Las Vegas"],
        correct: 2
    },
    {
        question: "What is the traditional New Year song in English-speaking countries?",
        options: ["Happy Birthday", "Auld Lang Syne", "Jingle Bells", "We Wish You a Merry Christmas"],
        correct: 1
    },
    {
        question: "Which country celebrates New Year first due to its location?",
        options: ["Japan", "Australia", "New Zealand", "Kiribati"],
        correct: 3
    },
    {
        question: "What is the traditional Spanish New Year custom of eating at midnight?",
        options: ["12 Grapes", "12 Chocolates", "12 Nuts", "12 Cookies"],
        correct: 0
    },
    {
        question: "In which year did Times Square first host its New Year's Eve celebration?",
        options: ["1904", "1924", "1934", "1944"],
        correct: 0
    },
    {
        question: "What color are you supposed to wear in Brazil on New Year's Eve for good luck?",
        options: ["Red", "Green", "White", "Blue"],
        correct: 2
    },
    {
        question: "Which ancient civilization is credited with starting the tradition of New Year's resolutions?",
        options: ["Greeks", "Romans", "Babylonians", "Egyptians"],
        correct: 2
    },
    {
        question: "What do Japanese people eat on New Year's Eve for good luck?",
        options: ["Sushi", "Tempura", "Soba Noodles", "Miso Soup"],
        correct: 2
    },
    {
        question: "Which city hosts the world's largest New Year fireworks display?",
        options: ["Sydney", "Dubai", "Hong Kong", "London"],
        correct: 1
    },
    {
        question: "What percentage of New Year's resolutions fail by February?",
        options: ["40%", "60%", "80%", "95%"],
        correct: 2
    }
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
        startQuestionTimer(roomId);
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

        checkAllAnswered(data.roomId);
    });

    socket.on('timeoutAnswer', (data) => {
        const room = rooms.get(data.roomId);
        if (!room) return;

        const player = room.players.find(p => p.id === socket.id);
        if (!player || player.answered) return;

        player.answered = true;
        
        // For timeout, don't send back any answer result
        socket.emit('answerResult', {
            selectedAnswer: null,
            correctAnswer: null,
            correct: false
        });

        checkAllAnswered(data.roomId);
    });

    function checkAllAnswered(roomId) {
        const room = rooms.get(roomId);
        if (!room) return;

        // Check if all players have answered
        const allAnswered = room.players.every(p => p.answered);
        if (allAnswered) {
            // Shorter delay since we're not showing correct answer
            setTimeout(() => {
                room.currentQuestion++;
                if (room.currentQuestion < questions.length) {
                    // Reset answered state for all players
                    room.players.forEach(player => player.answered = false);
                    io.to(roomId).emit('newQuestion', {
                        currentQuestion: room.currentQuestion,
                        players: room.players
                    });
                    startQuestionTimer(roomId);
                } else {
                    io.to(roomId).emit('gameOver', {
                        players: room.players.sort((a, b) => b.score - a.score)
                    });
                }
            }, 1000); // Reduced from 2000ms to 1000ms
        }
    }

    // Add timeout for each question
    function startQuestionTimer(roomId) {
        const room = rooms.get(roomId);
        if (!room) return;

        setTimeout(() => {
            const unansweredPlayers = room.players.filter(p => !p.answered);
            unansweredPlayers.forEach(player => {
                player.answered = true;
                // Don't send answer result for timeouts
                io.to(player.id).emit('answerResult', {
                    selectedAnswer: null,
                    correctAnswer: null,
                    correct: false
                });
            });

            checkAllAnswered(roomId);
        }, 10000); // 10 seconds timeout
    }

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
    console.log(`Imad & Doaa New Year's Party Game server running on port ${PORT}`);
});
