// ai/intent.js
export function interpretIntent(text) {
  const t = String(text || '').trim().toLowerCase();

  if (!t) return { type: 'unknown' };
  if (t === 'status' || t.includes('status') || t.includes('holat')) return { type: 'status' };

  if (t.startsWith('generate text') || t.startsWith('gen text') || t.includes('matn yarat')) {
    const prompt = t.replace(/^generate text\s+|^gen text\s+|matn yarat/,'').trim();
    return { type: 'ai:text', args: { prompt } };
  }
  if (t.startsWith('generate image') || t.startsWith('gen image') || t.includes('rasm yarat')) {
    const prompt = t.replace(/^generate image\s+|^gen image\s+|rasm yarat/,'').trim();
    return { type: 'ai:image', args: { prompt } };
  }

  if (t.includes('open browser') || t.startsWith('open http')) {
    const url = (t.split('open').pop() || '').trim() || 'https://example.com';
    return { type: 'browser:open', args: { url } };
  }

  if (t.includes('start obs')) return { type: 'obs:start' };
  if (t.includes('start recording')) return { type: 'obs:record:start' };
  if (t.includes('stop recording')) return { type: 'obs:record:stop' };

  if (t.includes('open blender')) return { type: 'blender:open' };
  if (t.includes('render blender') || t.includes('blender render')) return { type: 'blender:render' };

  if (t.includes('adb devices') || t.includes('list phones')) return { type: 'phone:devices' };
  if (t.includes('phone screenshot') || t.includes('take screenshot')) return { type: 'phone:screenshot' };

  // files
  if (t.startsWith('ls') || t.startsWith('list files')) {
    const dir = t.split(' ').slice(1).join(' ') || '.';
    return { type: 'files:list', args: { dir } };
  }
  if (t.startsWith('mkdir') || t.includes('create folder')) {
    const dir = t.split(' ').slice(1).join(' ') || 'new_folder';
    return { type: 'files:mkdir', args: { dir } };
  }
  if (t.includes('shutdown')) return { type: 'system:shutdown' };

  return { type: 'unknown' };
}