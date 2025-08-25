// modules/blender.js
import { exec } from 'child_process';
import path from 'path';
import logger from '../utils/logger.js';

const BLENDER = process.env.BLENDER_BIN || 'blender';

export async function openProject({ file=null } = {}, report=()=>{}) {
  const cmd = file ? `"${BLENDER}" "${file}"` : `"${BLENDER}"`;
  exec(cmd);
  report({ stage: 'exec', cmd });
  logger.info('Blender exec: ' + cmd);
  return { started: true, cmd };
}

export async function render({ file=null } = {}, report=()=>{}) {
  const out = path.resolve('render_output');
  const cmd = file
    ? `"${BLENDER}" -b "${file}" -o "${out}/frame_####" -F PNG -x 1 -a`
    : `"${BLENDER}" -b -noaudio -o "${out}/frame_####" -F PNG -x 1 -f 1`;
  exec(cmd);
  report({ stage: 'exec', cmd });
  return { rendering: true, output: out };
}