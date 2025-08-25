// utils/queue.js
const queue = [];
let working = false;

export async function addTask(text, onProgress=()=>{}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  const task = { text, onProgress, resolve, reject, promise };
  queue.push(task);
  tick();
  return task;
}

export function startWorkers(workerFn) {
  globalThis.__ccl_worker = workerFn;
  tick();
}

async function tick() {
  if (working) return;
  if (!globalThis.__ccl_worker) return;
  const task = queue.shift();
  if (!task) return;
  working = true;
  try {
    const result = await globalThis.__ccl_worker(task, (p)=>task.onProgress(p));
    task.resolve(result);
  } catch (e) {
    task.reject(e);
  } finally {
    working = false;
    setTimeout(tick, 0);
  }
}