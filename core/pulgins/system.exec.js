// plugins/system.exec.js
'use strict';
const { exec } = require('child_process');

module.exports = {
  name: 'system.exec',
  async run(payload, ctx) {
    const { cmd, timeout = 60000, cwd = process.cwd() } = payload;
    if (!cmd) throw new Error('cmd required');
    ctx.onProgress({ stage: 'exec', cmd });

    return await new Promise((resolve, reject) => {
      exec(cmd, { timeout, cwd, maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      });
    });
  }
};