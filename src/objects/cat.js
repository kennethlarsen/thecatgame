import Phaser from 'phaser';
import CatWalking from '../sprites/cat-walking';

class Cat {
  constructor({ game, x, y }) {
    this.game = game;
    this.energy = 0;
    this.energyUnit = 20;
    this.chargeUnit = 20;
    this.maxEnergy = 1000;

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
    this.sprite.body.gravity.y = 9810;
    this.meow = this.game.add.audio('meow');
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
    if (this.energy > 0) {
      // remove more energy for a higher energy level:
      this.energy -= Math.floor(this.speed() / 7) || 1;
    }
  }

  jump() {
    if (this.sprite.body.touching.down) {
      this.sprite.body.velocity.y = -2500;
      this.meow.play();
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
    return Math.floor(this.energy - finalEnergy);
  }
}

export default Cat;
