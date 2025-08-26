// core/agent.js
'use strict';
const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const KV = require('../storage/kv');
const loadPlugins = require('./plugins');

class Agent extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.id = opts.id || uuid();
    this.kv = new KV(path.join(process.cwd(), 'data', 'state.json'));
    this.plugins = loadPlugins(opts.pluginsDir || path.join(process.cwd(), 'plugins'));
    this.queue = [];
    this.working = false;
  }

  async init() {
    await fs.promises.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    this.emit('ready', { id: this.id, plugins: Object.keys(this.plugins) });
  }

  async enqueue(task) {
    const job = { id: uuid(), task, ts: Date.now(), status: 'queued' };
    this.queue.push(job);
    this.emit('queued', job);
    this._tick();
    return job.id;
  }

  async _tick() {
    if (this.working || this.queue.length === 0) return;
    this.working = true;
    const job = this.queue.shift();
    job.status = 'running';
    this.emit('running', job);

    try {
      const { type, payload = {} } = job.task || {};
      const plugin = this.plugins[type];
      if (!plugin) throw new Error(`Plugin not found: ${type}`);

      const onProgress = (p) => this.emit('progress', { id: job.id, progress: p });
      const ctx = { kv: this.kv, emit: this.emit.bind(this), onProgress };

      const result = await plugin.run(payload, ctx);
      job.status = 'done';
      job.result = result;
      await this.kv.set(`job:${job.id}`, job);
      this.emit('done', job);
    } catch (e) {
      job.status = 'error';
      job.error = e.message || String(e);
      await this.kv.set(`job:${job.id}`, job);
      this.emit('error', job);
    } finally {
      this.working = false;
      setImmediate(() => this._tick());
    }
  }
}

module.exports = Agent;