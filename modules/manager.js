// aios-core/modules/manager.js
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const system = require('./system');

const queue = [];
let working = false;

function createJob(cmd, args = {}) {
  const id = uuidv4();
  let onProg = () => {};
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return {
    id, cmd, args,
    promise, resolve, reject,
    onProgress(cb) { onProg = cb; },
    progress(p) { try { onProg(p); } catch(e){} },
    run: async () => {
      logger.info(`Job ${id} run: ${cmd}`);
      // Basic command routing:
      try {
        if (typeof cmd === 'string') {
          if (cmd === 'status') {
            const r = await system.status();
            return r;
          }
          if (cmd === 'listFiles') {
            const r = await system.listFiles(args);
            return r;
          }
          if (cmd === 'openUrl') {
            const r = await system.openUrl(args);
            return r;
          }
          if (cmd === 'exec') {
            const r = await system.execShell(args);
            return r;
          }
          if (cmd === 'shutdown') {
            return await system.shutdown();
          }
        }
        // default: echo
        return { echo: { cmd, args } };
      } catch (e) {
        throw e;
      }
    }
  };
}

module.exports = {
  enqueue: async (cmd, args) => {
    const job = createJob(cmd, args);
    queue.push(job);
    process.nextTick(tick);
    return {
      id: job.id,
      promise: job.promise,
      onProgress: job.onProgress
    };
  },

  startWorkers: () => {
    // keep worker ticking
    setTimeout(tick, 10);
  }
};

async function tick() {
  if (working) return;
  const job = queue.shift();
  if (!job) {
    setTimeout(tick, 200);
    return;
  }
  working = true;
  try {
    // stream sample progress
    job.progress({ stage: 'started' });
    const res = await job.run();
    job.progress({ stage: 'finished' });
    job.resolve(res);
  } catch (e) {
    job.reject(e);
  } finally {
    working = false;
    setTimeout(tick, 0);
  }
}