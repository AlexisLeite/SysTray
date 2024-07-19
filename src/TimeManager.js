const fs = require("fs");
const path = require("path");
const { Separator, Timer } = require("./Timer");

class TimeManager {
  active = null;
  timers = {};

  constructor() {
    this.initialLoad();
  }

  add(name, timer) {
    this.timers[name] = timer;
  }

  exit() {
    const file = path.resolve(__dirname, "timers.json");

    fs.writeFileSync(file, JSON.stringify(Object.values(this.timers).map((c) => c.serialize())));
  }

  initialLoad() {
    const file = path.resolve(__dirname, "timers.json");
    console.log(file, fs.existsSync(file));

    let i = 0;
    if (fs.existsSync(file)) {
      try {
        const data = fs.readFileSync(file);
        const timersData = JSON.parse(data);
        for (const timerData of timersData) {
          if (timerData.type === "separator") {
            this.add(`separator${i++}`, new Separator());
          } else {
            this.add(timerData.name, Timer.deserialize(timerData));
          }
        }
      } catch (e) {
        console.error(e);
        console.warn("Could not load timers data");
      }
    }
  }

  stop() {
    this.active?.stop();
    this.active = null;
  }

  toggle(name) {
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

exports.TimeManager = TimeManager;
