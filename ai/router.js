// ai/router.js
import * as intentMod from './intent.js';
import * as system from '../modules/system.js';
import * as obs from '../modules/obs.js';
import * as blender from '../modules/blender.js';
import * as unreal from '../modules/unreal.js';
import * as phone from '../modules/phone.js';
import * as imagegen from '../modules/imagegen.js';
import * as localLLM from '../modules/local-llm.js';

export async function routeCommand(text, report = ()=>{}) {
  const intent = intentMod.interpretIntent(text);
  report({ stage: 'parsed', intent });

  const map = {
    'status': system.status,
    'files:list': system.listFiles,
    'files:mkdir': system.makeDir,
    'browser:open': system.openBrowser,
    'system:shutdown': system.shutdown,
    'obs:start': obs.startOBS,
    'obs:record:start': obs.startRecording,
    'obs:record:stop': obs.stopRecording,
    'blender:open': blender.openProject,
    'blender:render': blender.render,
    'unreal:open': unreal.openProject,
    'unreal:build': unreal.build,
    'phone:devices': phone.listDevices,
    'phone:screenshot': phone.screenshot,
    'phone:openapp': phone.openApp,
    'ai:text': async ({ prompt }) => localLLM.generateText({ prompt }),
    'ai:image': async ({ prompt }) => imagegen.txt2img({ prompt, out: 'gen.png' })
  };

  const fn = map[intent.type];
  if (!fn) return { ok: false, message: 'Buyruq qo‘llab-quvvatlanmaydi', intent };
  const args = intent.args || {};
  const result = await fn(args, report);
  return { ok: true, intent, result };
}