const mouseEvents = require("global-mouse-events");
const { configuration } = require("./configuration");
const { EventEmitter } = require("stream");

class IdleTracker extends EventEmitter {
  constructor() {
    super();

    this.moved();
    mouseEvents.on("mousemove", () => {
      this.moved();
    });
  }

  idle = false;
  timeout = -1;

  moved() {
    clearTimeout(this.timeout);

    if (this.idle) {
      this.emit("active");
      this.idle = null;
    }

    this.timeout = setTimeout(() => {
      this.idle = true;
      this.emit("idle");
    }, configuration.idleTimeBeforeAway);
  }
}

exports.IdleTracker = IdleTracker;
