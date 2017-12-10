import Phaser from 'phaser';
import CatWalking from '../sprites/cat-walking';

class Cat {
  constructor({ game, x, y }) {
    this.game = game;
    this.energy = 0;
    this.speedUpUnit = 10;
    this.slowDownUnit = 5;
    this.chargeUnit = 75;
    this.maxAutoSlowDownUnit = 5;
    this.maxEnergy = 100;
    this.jumpVelocity = 2500;
    this.maxFrameRate = 25;

    // every 5 second the cat slows down by 1 unit (because it burns energy ;))
    this.slowDownPeriod = 5000;

    this.setNextSlowDownTime(this.slowDownPeriod);

    this.sprite = new CatWalking({
      game,
      x,
      y,
      asset: 'cat-walking',
    });

    game.add.existing(this.sprite);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.offset.y = -50;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.gravity.y = 8000;
    this.sprite.body.gravity.x = 0;
    this.sprite.body.velocity.x = 0;
    this.meow = this.game.add.audio('meow');
  }

  get totalEnergy() {
    return this.energy;
  }

  get speed() {
    return Math.floor((this.maxFrameRate * this.energy) / 100);
  }

  setNextSlowDownTime(period) {
    this.timer = this.game.time.now + period;
  }

  energyGotBurnt() {
    return this.game.time.now > this.timer;
  }

  hasEnergy() {
    return this.energy > 0;
  }

  speedUp() {
    if (this.energy < this.maxEnergy) {
      this.energy += this.energyGain(this.speedUpUnit);
    }
  }

  slowDown() {
    if (this.energy > 0 && this.energyGotBurnt()) {
      // remove more energy for a higher energy level:
      const energyRatio = this.energy / this.maxEnergy;
      const dynamicLossUnit = Math.floor(energyRatio * this.maxAutoSlowDownUnit);

      this.energy -= this.energyLoss(dynamicLossUnit) || 1;
      this.setNextSlowDownTime(this.slowDownPeriod);
    }
  }

  jump() {
    if (this.sprite.body.touching.down) {
      this.sprite.body.velocity.y = -this.jumpVelocity;
    }
  }

  update() {
    if (this.hasEnergy()) {
      this.sprite.walk(this.speed);
      this.slowDown();
    } else {
      this.sprite.halt();
    }

    this.updateAngle();
  }

  updateAngle() {
    // Add a body angle while jumping:
    const velocity = this.sprite.body.velocity.y;
    const maxAngleUp = 45;
    const maxAngleDown = 20;
    const angle = velocity < 0 ? maxAngleUp : maxAngleDown;
    this.sprite.rotation = (velocity * (angle / this.jumpVelocity)) / 60;
  }

  chargeBatteries(batteries) {
    if (batteries.isCharged) {
      return;
    }

    // always remove n units from the displayed energy:
    const difference = this.energyLoss(this.chargeUnit);
    const chargeLevelReached = difference >= this.chargeUnit;
    const enoughTotalEnergy = this.energy - difference > 0;

    if (!chargeLevelReached || !enoughTotalEnergy) {
      return;
    }

    const wasCharged = batteries.charge();

    if (wasCharged) {
      this.energy -= difference;
    }
  }

  energyLoss(units) {
    return (this.energy - Math.abs(units)) > 0
      ? Math.abs(units)
      : this.energy;
  }

  energyGain(units) {
    return (this.energy + units) > this.maxEnergy
      ? this.maxEnergy - this.energy
      : units;
  }

  collideWithAll(sprites) {
    sprites.forEach(sprite => this.collideWith(sprite));
  }

  collideWith(obstacle) {
    const { width, height } = obstacle;
    const { centerX, centerY } = obstacle;

    const obstacleLeftBorder = centerX - (width / 2);
    const obstacleRightBorder = centerX + (width / 2);
    const catRightBorder = (this.sprite.centerX + (this.sprite.width / 2)) - (this.sprite.width / 4);
    const catLeftBorder = (this.sprite.centerX - (this.sprite.width / 2));
    const obstacleTopBorder = centerY - (height / 2);
    const catBottomBorder = this.sprite.centerY + (this.sprite.height / 2);

    const obstacleHitsCat = obstacleLeftBorder < catRightBorder;
    const obstaclePastCat = obstacleRightBorder <= catLeftBorder;
    const catAboveObstacle = catBottomBorder <= obstacleTopBorder;
    const hitCat = obstacleHitsCat && !catAboveObstacle;
    const obstacleAvoided = !obstacle.hit && obstaclePastCat;

    if (obstacleAvoided && !obstacle.avoided) {
      obstacle.avoided = true;
    }

    if (!obstacle.avoided && !obstacle.hit && hitCat) {
      obstacle.hit = true;
      obstacle.destroy();

      const difference = this.energyLoss(this.slowDownUnit);
      this.energy -= difference;
      this.meow.play();
    }
  }
}

export default Cat;
