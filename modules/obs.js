// modules/obs.js
import OBSWebSocket from 'obs-websocket-js';
import logger from '../utils/logger.js';

const host = process.env.OBS_HOST || 'localhost:4455';
const password = process.env.OBS_PASSWORD || '';

let client = null;

async function connect() {
  if (client && client.ws && client.connected) return client;
  client = new OBSWebSocket();
  try {
    await client.connect(`ws://${host}`, password);
    logger.info('OBS websocketga ulandi');
    return client;
  } catch (e) {
    logger.warn('OBSga ulanilmadi: ' + e.message);
    throw e;
  }
}

export async function startOBS() {
  await connect();
  return { ok: true };
}

export async function startRecording() {
  const c = await connect();
  await c.call('StartRecord');
  return { recording: true };
}

export async function stopRecording() {
  const c = await connect();
  await c.call('StopRecord');
  return { recording: false };
}