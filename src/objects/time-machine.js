class TimeMachine {
  constructor() {
    this.year = (new Date()).getFullYear();
    this.yearsToTravel = 50;
  }

  get currentYear() {
    return this.year;
  }

  travelToFuture(batteries) {
    if (batteries.isCharged) {
      batteries.use();
      this.year += this.yearsToTravel;
    }
  }

  travelToPast() {
    this.year -= this.yearsToTravel;
  }
}

export default TimeMachine;
