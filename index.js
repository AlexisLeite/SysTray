const { app, Menu, Tray, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const Timer = require('./src/Timer').Timer;
const { spawn } = require('child_process')

class Separator {
  reportBeautiful() {
    return '------------------';
  }

  serialize() {
    return { type: 'separator' }
  }
}

class TimeManager {
  static active = null;
  static timers = {};

  static add(name, timer) {
    this.timers[name] = timer;
  }

  static stop() {
    this.active.stop();
    this.active = null;
  }

  static toggle(name) {
    if (this.active === this.timers[name]) {
      this.active.stop();
      this.active = null;
    } else {
      this.active?.stop();
      this.active = this.timers[name];
      this.active.start();
    }
  }
}

function loadTimers() {
  const file = path.resolve(__dirname, 'timers.json');

  let i = 0;
  if (fs.existsSync(file)) {
    try {
      const data = fs.readFileSync(file);
      const timersData = JSON.parse(data);
      for (const timerData of timersData) {
        if (timerData.type === 'separator') {
          TimeManager.add(`separator${i++}`, new Separator());
        } else {
          TimeManager.add(timerData.name, Timer.deserialize(timerData));
        }
      }
    } catch (e) {
      console.warn("Could not load timers data");
    }
  } else {
    ['Apia development', 'Support', 'BPA'].forEach(c => {
      const timer = new Timer(c, 0);
      TimeManager.add(c, timer);
    })
  }
}

function report(tray) {
  let reportString = '';

  if (TimeManager.active) {
    reportString = `${TimeManager.active?.reportBeautiful() ?? ''}\n`;
    reportString += `${new Separator().reportBeautiful()}\n`;
  }

  tray.setToolTip(reportString);
  currentReportWindow?.send('report', JSON.stringify(Object.values(TimeManager.timers).map(c => c.reportBeautiful()), undefined, 2));

  try {
    saveTimers();
  } catch (e) { }

  return reportString;
}

function saveTimers() {
  const file = path.resolve(__dirname, 'timers.json');

  fs.writeFileSync(file, JSON.stringify(Object.values(TimeManager.timers).map(c => c.serialize())));
}

let currentReportWindow;
function reportWindow() {
  currentReportWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  currentReportWindow.loadFile(path.join(__dirname, 'reports', 'report.html'));

  currentReportWindow.on('close', (event) => {
    currentReportWindow = null;
  });
}

let tray = null;

let contextMenu;
function buildContextMenu() {
  contextMenu = Menu.buildFromTemplate([
    {
      label: 'Report', type: 'normal', click: reportWindow,
    },
    { type: 'separator' },
    ...Object.values(TimeManager.timers).map(c => c instanceof Separator ? { type: 'separator' } : {
      label: `${c.isRunning() ? '[R] ' : ''}${c.name}`,
      type: 'normal',
      click: () => {
        TimeManager.toggle(c.name);
        buildContextMenu();
      },
    }),
    { type: 'separator' },
    {
      label: 'Stop', type: 'normal', click: () => {
        TimeManager.stop();
        buildContextMenu();
      }
    },
    {
      label: 'Quit', type: 'normal', click: () => {
        saveTimers();
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  loadTimers();
  buildContextMenu();

  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu);
  })

  setInterval(() => {
    reportString = report(tray);
    buildContextMenu();
  }, 1000);
});

app.on('before-quit', (event) => {
  saveTimers();
});

app.on('window-all-closed', (e) => {
  e.preventDefault()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
