const fs = require('fs');
const who = process.env['INPUT_WHO-TO-GREET'];
const must = process.env['INPUT_MUST-HAVE'];
const keys = Object.keys(process.env).filter((k) => k.startsWith('INPUT_')).sort().join(',');
console.log('RESULT11 js phase=[main] who=[' + who + '] must-have=[' + must + '] input-env-keys=[' + keys + ']');
console.log('RESULT11 js action-path-set=[' + Boolean(process.env.GITHUB_ACTION_PATH) + '] github-action=[' + (process.env.GITHUB_ACTION || '') + ']');
fs.appendFileSync(process.env.GITHUB_OUTPUT, 'greeting=Hello ' + who + '\n');
fs.appendFileSync(process.env.GITHUB_STATE, 'marker=from-main\n');
