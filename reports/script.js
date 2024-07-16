const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('report', (event, arg) => {
    document.body.innerHTML = `<pre>${arg}</pre>`;
  });
});
