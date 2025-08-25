// modules/unreal.js
import { exec } from 'child_process';
import logger from '../utils/logger.js';

const UE_EDITOR = process.env.UE_EDITOR || 'UnrealEditor';

export async function openProject({ file=null } = {}, report=()=>{}) {
  const cmd = file ? `"${UE_EDITOR}" "${file}"` : `"${UE_EDITOR}"`;
  exec(cmd);
  report({ stage: 'exec', cmd });
  logger.info('Unreal exec: ' + cmd);
  return { started: true, cmd };
}

export async function build({ file=null } = {}, report=()=>{}) {
  // Bu joyni loyihaga moslab sozlang (BuildCookRun yoki UnrealAutomationTool)
  const cmd = file
    ? `"${UE_EDITOR}" "${file}" -run=Cook -TargetPlatform=WindowsNoEditor`
    : `"${UE_EDITOR}" -run=Cook -TargetPlatform=WindowsNoEditor`;
  exec(cmd);
  report({ stage: 'exec', cmd });
  return { building: true };
}