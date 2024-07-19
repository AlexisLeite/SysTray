function formatMilliseconds(ms) {
  let seconds = ms / BigInt(1000);
  let minutes = seconds / BigInt(60);
  let hours = minutes / BigInt(60);

  seconds = seconds % BigInt(60);
  minutes = minutes % BigInt(60);

  // Pad the hours, minutes, and seconds with leading zeros if necessary
  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

class Separator {
  reportBeautiful() {
    return "------------------";
  }

  serialize() {
    return { type: "separator" };
  }
}

class Timer {
  currentPeriod = null;
  name;
  // Each period must be of type [start timestamp, end timestamp]
  periods = [];
  totalTime = BigInt(0);

  static deserialize(o) {
    if (o.time !== undefined) {
      // Old versions timers
      const totalTime = Number.parseInt(o.time, 10);
      return new Timer(o.name, [[Date.now() - totalTime, Date.now()]], BigInt(o.time));
    } else {
      return new Timer(o.name, o.periods, BigInt(o.totalTime));
    }
  }

  constructor(name, periods, totalTime) {
    this.name = name;
    this.periods = periods;
    this.totalTime = totalTime;
  }

  /**
   * Devuelve el tiempo que lleva el timer en ejecución. 0 si el timer no está en ejecución.
   */
  get runningTime() {
    return this.currentPeriod ? Date.now() - this.currentPeriod[0] : 0;
  }

  isRunning() {
    return this.currentPeriod !== null;
  }

  /**
   * Returns the total time invested on this timer
   */
  report() {
    return this.totalTime + BigInt(this.runningTime);
  }

  reportBeautiful() {
    return `[${this.name}]: ${formatMilliseconds(this.report())}`;
  }

  /**
   * Starts counting for this timer
   */
  start() {
    if (this.currentPeriod !== null) {
      this.stop();
    }
    this.currentPeriod = [Date.now()];
  }

  /**
   * Stops the current timer
   */
  stop() {
    this.totalTime += BigInt(this.runningTime);
    this.periods.push([this.currentPeriod[0], Date.now()]);
    this.currentPeriod = null;
  }

  serialize() {
    return { name: this.name, totalTime: this.totalTime.toString(), periods: this.periods };
  }
}

exports.Timer = Timer;
exports.Separator = Separator;
