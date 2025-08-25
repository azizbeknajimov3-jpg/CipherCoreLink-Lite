// modules/phone.js
import { exec } from 'child_process';
import fs from 'fs';
import logger from '../utils/logger.js';

const ADB = process.env.ADB_BIN || 'adb';

function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 20*1024*1024 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

export async function listDevices() {
  const { stdout } = await run(`${ADB} devices`);
  return { devices: stdout };
}

export async function screenshot() {
  const tmp = '/sdcard/ccl_ss.png';
  await run(`${ADB} shell screencap -p ${tmp}`);
  await run(`${ADB} pull ${tmp} ./phone_screenshot.png`);
  return { saved: 'phone_screenshot.png' };
}

export async function openApp({ app } = {}) {
  if (!app) throw new Error('App paket nomini kiriting: open app com.example');
  await run(`${ADB} shell monkey -p ${app} -c android.intent.category.LAUNCHER 1`);
  return { opened: app };
}