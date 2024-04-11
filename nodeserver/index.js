const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        const name = users[socket.id];
        socket.broadcast.emit('user-disconnected', name);
        delete users[socket.id];
    });

    socket.on('chat message', message => {
        io.emit('chat message', { message: message, name: users[socket.id] });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
