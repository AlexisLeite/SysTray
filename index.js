const { app, Menu, Tray, BrowserWindow } = require('electron');
const path = require('path');
const { Reporter } = require('./src/Reporter');
const { Separator } = require('./src/Timer');
const { TimeManager } = require('./src/TimeManager');
const mouseEvents = require('global-mouse-events')

class Application {
  contextMenu;
  reportWindow;
  timeManager;
  tray;

  constructor() {
    this.initialLoad();
  }

  static init() {
    new Application();
  }

  buildContextMenu() {
    this.contextMenu = Menu.buildFromTemplate([
      {
        label: 'Report', type: 'normal', click: this.openReportWindow.bind(this),
      },
      { type: 'separator' },
      ...Object.values(this.timeManager.timers).map(c => c instanceof Separator ? { type: 'separator' } : {
        label: `${c.isRunning() ? '[R] ' : ''}${c.name}`,
        type: 'normal',
        click: () => {
          this.timeManager.toggle(c.name);
          this.buildContextMenu();
        },
      }),
      { type: 'separator' },
      {
        label: 'Stop', type: 'normal', click: () => {
          this.timeManager.stop();
          this.buildContextMenu();
        }
      },
      {
        label: 'Quit', type: 'normal', click: () => {
          app.quit();
        }
      }
    ]);

    this.tray.setContextMenu(this.contextMenu);
  }

  initialLoad() {
    app.on('ready', () => {
      this.timeManager = new TimeManager();
      this.tray = new Tray(path.join(__dirname, 'icon.png'));
      this.buildContextMenu();

      this.tray.on('click', () => {
        this.tray.popUpContextMenu(this.contextMenu);
      })
    });

    app.on('window-all-closed', (e) => {
      e.preventDefault()
    });

    app.on('before-quit', (event) => {
      this.timeManager.exit();
    });
  }

  openReportWindow() {
    this.reportWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.reportWindow.loadFile(path.join(__dirname, 'reports', 'report.html'));

    const interval = setInterval(() => {
      this.reportWindow.send('report', Reporter.makeJsonReport(this.timeManager))
    }, 1000)

    this.reportWindow.on('close', () => {
      this.reportWindow = null;
      clearInterval(interval);
    });
  }
}

Application.init();






