const { spawn } = require('child_process');
const electronPath = require('electron');
const path = require('path');

const appPath = path.join(__dirname, 'index.js');
const child = spawn(electronPath, [appPath], { stdio: 'ignore', detached: true });
child.unref();