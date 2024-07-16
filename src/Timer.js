function formatMilliseconds(ms) {
  let seconds = ms / BigInt(1000);
  let minutes = seconds / BigInt(60);
  let hours = minutes / BigInt(60);

  seconds = seconds % BigInt(60);
  minutes = minutes % BigInt(60);

  // Pad the hours, minutes, and seconds with leading zeros if necessary
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}


class Timer {
  name;
  #started = -1;
  #time = BigInt(0);

  static deserialize(o) {
    return new Timer(o.name, BigInt(o.time));
  }

  constructor(name, time) {
    this.name = name;
    this.#time = BigInt(time);
  }

  #currentLapse() {
    return BigInt((this.#started === -1 ? 0 : (Date.now() - this.#started)));
  }

  /**
   * Returns the total time invested on this timer
   */
  report() {
    return BigInt(this.#time + this.#currentLapse());
  }

  reportBeautiful() {
    return `[${this.name}]: ${formatMilliseconds(this.report())}`;
  }

  /**
   * Starts counting for this timer
   */
  start() {
    this.#started = Date.now();
  }

  /**
   * Stops the current timer
   */
  stop() {
    this.#time += this.#currentLapse();
    this.#started = -1;
  }


  serialize() {
    return { name: this.name, time: this.report().toString() }
  }
}

exports.Timer = Timer;