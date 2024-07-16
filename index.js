const { app, Menu, Tray } = require('electron');
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

  const items = [];

  let i = 0;
  if (fs.existsSync(file)) {
    try {
      const data = fs.readFileSync(file);
      const timersData = JSON.parse(data);
      for (const timerData of timersData) {
        if (timerData.type === 'separator') {
          items.push({ type: 'separator' })
          TimeManager.add(`separator${i++}`, new Separator());
        } else {
          TimeManager.add(timerData.name, Timer.deserialize(timerData));
          items.push({
            label: timerData.name,
            type: 'normal',
            click: () => {
              TimeManager.toggle(timerData.name);
            },
          })
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

  return items;
}

function report(tray) {
  process.stdout.write('\x1B[2J\x1B[0f');

  let reportString = '';

  if (TimeManager.active) {
    reportString = `${TimeManager.active?.reportBeautiful() ?? ''}\n`;
    reportString += `${new Separator().reportBeautiful()}\n`;
  }

  Object.values(TimeManager.timers).forEach(timer => {
    if (timer !== TimeManager.active) {
      console.log(timer.reportBeautiful());
      reportString += `${timer.reportBeautiful()}\n`;
    }
  })

  tray.setToolTip(reportString);

  try {
    saveTimers();
  } catch (e) { }

  return reportString;
}

function saveTimers() {
  const file = path.resolve(__dirname, 'timers.json');

  fs.writeFileSync(file, JSON.stringify(Object.values(TimeManager.timers).map(c => c.serialize())));
}

let tray = null;
app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  const timersItems = loadTimers();

  let reportString = '';
  setInterval(() => { reportString = report(tray) }, 1000);

  const contextMenu = Menu.buildFromTemplate([/* 
    {
      label: 'Report', type: 'normal', click: () => {
        tray.displayBalloon({
          icon: path.join(__dirname, 'icon.png'),
          title: 'Detailed Info',
          content: reportString
        });
      }
    }, */
    { type: 'separator' },
    ...timersItems,
    { type: 'separator' },
    {
      label: 'Stop', type: 'normal', click: () => {
        TimeManager.stop();
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
  tray.on('click', () => {
    tray.popUpContextMenu(contextMenu);
  })
});

app.on('before-quit', (event) => {
  saveTimers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
