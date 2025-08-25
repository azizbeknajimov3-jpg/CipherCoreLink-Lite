// modules/imagegen.js
import http from 'http';
import fs from 'fs';

const SD_HOST = process.env.SD_HOST || '127.0.0.1';
const SD_PORT = process.env.SD_PORT || '7860';

function sdPost(path, data) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(JSON.stringify(data));
    const req = http.request({
      host: SD_HOST, port: SD_PORT, path, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length }
    }, res => {
      let body=''; res.on('data', d=> body+=d); res.on('end', ()=> {
        try { resolve(JSON.parse(body)); } catch(e){ reject(e); }
      });
    });
    req.on('error', reject);
    req.write(payload); req.end();
  });
}

export async function txt2img({ prompt, steps=20, cfg_scale=7.5, width=768, height=768, out='gen.png' } = {}, report=()=>{}) {
  const res = await sdPost('/sdapi/v1/txt2img', {
    prompt, steps, cfg_scale, width, height
  });
  if (!res || !res.images || !res.images[0]) throw new Error('SD javobida rasm topilmadi');
  const b64 = res.images[0].split(',',2).pop();
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(out, buffer);
  report({ saved: out });
  return { saved: out };
}
