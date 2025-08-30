
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', (room) => {
        socket.join(room);
        socket.room = room;
        const time = new Date().toLocaleTimeString();
        socket.to(room).emit('chat message', {
            msg: '🔔 A user joined the room.',
            time
        });
        socket.emit('chat message', {
            msg: `✅ You joined room: ${room}`,
            time
        });
    });

    socket.on('chat message', (msg) => {
        const time = new Date().toLocaleTimeString();
        const room = socket.room;
        if (room) {
            io.to(room).emit('chat message', { msg, time });
        } else {
            socket.emit('chat message', { msg: "❗ Join a room first!", time });
        }
    });

    socket.on('typing', (isTyping) => {
        const room = socket.room;
        if (room) {
            socket.to(room).emit('display typing', isTyping);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
