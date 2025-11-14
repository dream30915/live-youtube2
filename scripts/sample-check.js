const fs = require('fs');
const vm = require('vm');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.js');
const code = fs.readFileSync(configPath, 'utf8');

const sandbox = {
  window: {
    CONFIG: null,
    PARSERS: null
  },
  console
};
vm.createContext(sandbox);
new vm.Script(code).runInContext(sandbox);

const parser = sandbox.window.PARSERS && sandbox.window.PARSERS.nikkei;
const sampleInput = { NK225: 34567.89, change: '+123.45' };
const parsed = parser ? parser(sampleInput) : { main: '--', sub: '--' };
console.log('Sample parsing:', parsed);
console.log('Configured tiles:', sandbox.window.CONFIG && sandbox.window.CONFIG.tiles.length);
