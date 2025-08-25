const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const { processCommand } = require('./ai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Foydalanuvchi ulandi');

    socket.on('command', async (msg) => {
        try {
            const response = await processCommand(msg);
            socket.emit('commandResponse', response);
        } catch (err) {
            socket.emit('commandResponse', `Xatolik: ${err.message}`);
        }
    });

    socket.on('disconnect', () => console.log('Foydalanuvchi uzildi'));
});

server.listen(3000, () => console.log('Server ishlamoqda: http://localhost:3000'));