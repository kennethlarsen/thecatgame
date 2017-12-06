import Phaser from 'phaser';
import CatWalking from '../sprites/cat-walking';

class Cat {
  constructor({ game, x, y }) {
    this.game = game;
    this.energy = 0;
    this.energyUnit = 20;
    this.chargeUnit = 20;
    this.obstacleUnit = 5;
    this.maxEnergy = 1000;
    this.jumpVelocity = 2500;

    this.slowDownPeriod = 100;
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

  setNextSlowDownTime(period) {
    this.timer = this.game.time.now + period;
  }

  energyGotBurnt() {
    return this.game.time.now > this.timer;
  }

  hasEnergy() {
    return this.energy > 0;
  }

  speed() {
    return Math.floor(Math.sqrt(this.energy));
  }

  speedUp() {
    if (this.energy < this.maxEnergy) {
      this.energy += this.energyUnit;
    }
  }

  slowDown() {
    if (this.energy > 0 && this.energyGotBurnt()) {
      // remove more energy for a higher energy level:
      this.energy -= Math.floor(this.speed() / 7) || 1;
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
      const fps = this.speed();
      this.sprite.walk(fps);
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
    const difference = this.energyDifference(this.chargeUnit);
    const chargeLevelReached = difference >= this.chargeUnit ** 2;
    const enoughTotalEnergy = this.energy - difference > 0;

    if (!chargeLevelReached || !enoughTotalEnergy) {
      return;
    }

    const wasCharged = batteries.charge();

    if (wasCharged) {
      this.energy -= difference;
    }
  }

  energyDifference(units) {
    const finalEnergy = (Math.sqrt(this.energy) - units) ** 2;
    const absoluteDifference = Math.floor(this.energy - finalEnergy);
    const difference = absoluteDifference < 0
      ? this.energy
      : absoluteDifference;

    return difference;
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

      const difference = this.energyDifference(this.obstacleUnit);
      this.energy -= difference;
      this.meow.play();
    }
  }
}

export default Cat;
