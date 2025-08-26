// storage/kv.js
'use strict';
const fs = require('fs');

class KV {
  constructor(file) {
    this.file = file;
    this.data = {};
    this._loaded = false;
  }
  async _load() {
    if (this._loaded) return;
    try {
      const raw = await fs.promises.readFile(this.file, 'utf8');
      this.data = JSON.parse(raw || '{}');
    } catch { this.data = {}; }
    this._loaded = true;
  }
  async _save() {
    await fs.promises.mkdir(require('path').dirname(this.file), { recursive: true });
    await fs.promises.writeFile(this.file, JSON.stringify(this.data, null, 2), 'utf8');
  }
  async get(key, def = null) { await this._load(); return this.data[key] ?? def; }
  async set(key, value) { await this._load(); this.data[key] = value; await this._save(); return true; }
  async del(key) { await this._load(); delete this.data[key]; await this._save(); }
  async keys(prefix = '') { await this._load(); return Object.keys(this.data).filter(k => k.startsWith(prefix)); }
}

module.exports = KV;