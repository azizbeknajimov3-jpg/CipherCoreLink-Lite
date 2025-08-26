// routes/agent.js
'use strict';
const express = require('express');

module.exports = function agentRoutes({ agent, io }) {
  const r = express.Router();

  r.get('/status', async (_req, res) => {
    res.json({ ok: true, agent: { id: agent.id, plugins: Object.keys(agent.plugins) } });
  });

  // body: { type: 'fs.list', payload: {...} }
  r.post('/task', async (req, res) => {
    try {
      const jobId = await agent.enqueue({ type: req.body.type, payload: req.body.payload || {} });
      res.json({ ok: true, jobId });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // get job result if cached
  r.get('/job/:id', async (req, res) => {
    try {
      const job = await agent.kv.get(`job:${req.params.id}`, null);
      if (!job) return res.status(404).json({ ok: false, error: 'not found' });
      res.json({ ok: true, job });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  return r;
};