// aios-core/modules/system.js
const os = require('os');
const fs = require('fs');
const child = require('child_process');
const logger = require('../utils/logger');

function run(cmd) {
  return new Promise((resolve, reject) => {
    child.exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

module.exports = {
  async status() {
    return {
      platform: os.platform(),
      release: os.release(),
      cpus: os.cpus().length,
      freememMB: Math.round(os.freemem() / 1024 / 1024),
      uptimeSec: os.uptime(),
      time: new Date().toISOString()
    };
  },

  async listFiles({ dir = '.' } = {}) {
    const items = fs.readdirSync(dir).map(name => {
      const stat = fs.statSync(require('path').join(dir, name));
      return { name, isDir: stat.isDirectory(), size: stat.size };
    });
    return { dir, items };
  },

  async openUrl({ url }) {
    const plat = os.platform();
    let cmd;
    if (plat === 'win32') cmd = `start "" "${url}"`;
    else if (plat === 'darwin') cmd = `open "${url}"`;
    else cmd = `xdg-open "${url}"`;
    await run(cmd);
    return { opened: url };
  },

  async execShell({ cmd }) {
    logger.info('Exec shell: ' + cmd);
    return await run(cmd);
  },

  // careful: shutdown must be used with caution; expose only to admin
  async shutdown() {
    const plat = os.platform();
    let cmd;
    if (plat === 'win32') cmd = 'shutdown /s /t 10';
    else if (plat === 'darwin') cmd = 'osascript -e \'tell app "System Events" to shut down\'';
    else cmd = 'shutdown -h now';
    logger.warn('Shutdown requested: ' + cmd);
    try { await run(cmd); } catch(e){ /* may require privileges */ }
    return { shuttingDown: true };
  }
};