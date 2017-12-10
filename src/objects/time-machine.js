import times from '../times/config';

class TimeMachine {
  constructor() {
    this.time = times.present;
    this.year = (new Date()).getFullYear();
    this.yearsToTravel = 50;
  }

  get currentYear() {
    return this.time.year;
  }

  get currentTime() {
    return this.time;
  }

  travelToFuture(batteries) {
    if (batteries.isCharged && this.time.next) {
      batteries.use();
      this.time = times[this.time.next];
      return true;
    }

    return false;
  }

  travelToPast() {
    if (this.time.previous) {
      this.time = times[this.time.previous];
    }
  }
}

export default TimeMachine;
