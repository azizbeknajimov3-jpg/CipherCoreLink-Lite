// plugins/fs.list.js
'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'fs.list',
  async run(payload) {
    const dir = payload?.dir || process.cwd();
    const items = fs.readdirSync(dir).map(n => {
      const p = path.join(dir, n);
      const s = fs.statSync(p);
      return { name: n, isDir: s.isDirectory(), size: s.size, mtime: s.mtimeMs };
    });
    return { dir, items };
  }
};