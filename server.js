// server.js
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { routeCommand } from './ai/router.js';
import fs from 'fs';
import winston from 'winston';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(i => `${i.timestamp} [${i.level.toUpperCase()}] ${i.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(__dirname, 'logs', 'system.log') })
  ]
});

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));

// health
app.get('/api/status', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  socket.on('command', async (text) => {
    logger.info(`CMD from ${socket.id}: ${text}`);
    try {
      // report progress via socket.emit('progress', ...)
      const result = await routeCommand(text, (p) => socket.emit('progress', p));
      socket.emit('commandResponse', result);
    } catch (err) {
      logger.error(err.stack || err.message || err);
      socket.emit('commandResponse', { ok: false, error: err.message || String(err) });
    }
  });
  socket.on('disconnect', () => logger.info(`Client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => logger.info(`Server running at http://localhost:${PORT}`));