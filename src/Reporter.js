class Reporter {
  static makeJsonReport(timeManager) {
    return JSON.stringify(Object.values(timeManager.timers).map(c => c.reportBeautiful()), undefined, 2)
  }
}

exports.Reporter = Reporter;