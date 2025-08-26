// core/plugins/index.js
'use strict';
const fs = require('fs');
const path = require('path');

module.exports = function loadPlugins(dir) {
  const plugins = {};
  if (!fs.existsSync(dir)) return plugins;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.js')) continue;
    const mod = require(path.join(dir, file));
    if (mod && mod.name && typeof mod.run === 'function') {
      plugins[mod.name] = mod;
    }
  }
  return plugins;
};