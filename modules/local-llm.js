// modules/local-llm.js
import { exec } from 'child_process';
import http from 'http';

const USE_OLLAMA = process.env.USE_OLLAMA === '1';
const OLLAMA_HOST = process.env.OLLAMA_HOST || '127.0.0.1';
const OLLAMA_PORT = process.env.OLLAMA_PORT || '11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3:8b-instruct';

const LLAMACPP_BIN = process.env.LLAMACPP_BIN || 'main';
const LLAMACPP_MODEL = process.env.LLAMACPP_MODEL || './models/llama3.gguf';
const LLAMACPP_TOKENS = process.env.LLAMACPP_TOKENS || '512';

function post(host, port, path, data) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(JSON.stringify(data));
    const req = http.request({
      host, port, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch(e){ reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload); req.end();
  });
}

export async function generateText({ prompt, system='' } = {}) {
  if (!prompt) throw new Error('prompt bo‘sh bo‘lmasin');

  if (USE_OLLAMA) {
    const res = await post(OLLAMA_HOST, OLLAMA_PORT, '/api/generate', {
      model: OLLAMA_MODEL,
      prompt: (system ? `System: ${system}\n` : '') + prompt,
      stream: false
    });
    return { text: res?.response || res?.text || '' };
  }

  // llama.cpp via exec (simple)
  const cmd = `${LLAMACPP_BIN} -m "${LLAMACPP_MODEL}" -n ${LLAMACPP_TOKENS} -p "${prompt.replace(/"/g,'\\"')}"`;
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 20*1024*1024 }, (err, stdout) => {
      if (err) return reject(err);
      resolve({ text: String(stdout).trim() });
    });
  });
}