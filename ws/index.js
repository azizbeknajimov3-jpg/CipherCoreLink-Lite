// ws/index.js
'use strict';
const { Server } = require('socket.io');

module.exports = function attachWS(httpServer, agent) {
  const io = new Server(httpServer, { cors: { origin: '*' } });

  agent.on('ready', (info) => io.emit('agent:ready', info));
  agent.on('queued', (job) => io.emit('agent:queued', { id: job.id, task: job.task }));
  agent.on('running', (job) => io.emit('agent:running', { id: job.id }));
  agent.on('progress', (p) => io.emit('agent:progress', p));
  agent.on('done', (job) => io.emit('agent:done', { id: job.id, result: job.result }));
  agent.on('error', (job) => io.emit('agent:error', { id: job.id, error: job.error }));

  return io;
};