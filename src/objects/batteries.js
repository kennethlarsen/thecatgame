class Batteries {
  constructor() {
    this.firstCharged = false;
    this.secondCharged = false;
    this.thirdCharged = false;
  }

  charge() {
    if (this.isCharged) {
      return false;
    }

    if (!this.firstCharged) {
      this.firstCharged = true;
      return true;
    }

    if (!this.secondCharged) {
      this.secondCharged = true;
      return true;
    }

    if (!this.thirdCharged) {
      this.thirdCharged = true;
      return true;
    }

    return false;
  }

  get isCharged() {
    return this.firstCharged && this.secondCharged && this.thirdCharged;
  }

  get chargedCount() {
    return this.tanks.filter(item => item).length;
  }

  get totalCount() {
    return this.tanks.length;
  }

  get tanks() {
    return [
      this.firstCharged,
      this.secondCharged,
      this.thirdCharged,
    ];
  }

  use() {
    this.firstCharged = false;
    this.secondCharged = false;
    this.thirdCharged = false;
  }
}

export default Batteries;
