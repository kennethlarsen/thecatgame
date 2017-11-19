import Phaser from 'phaser';
import CatWalking from '../sprites/cat-walking';

class Cat {
  constructor({ game, x, y }) {
    this.game = game;
    this.energy = 0;
    this.energyUnit = 20;
    this.maxEnergy = 1000;

    this.sprite = new CatWalking({
      game,
      x,
      y,
      asset: 'catWalking',
    });

    game.add.existing(this.sprite);
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.collideWorldBounds = true;
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
    if (this.sprite.body.onFloor()) {
      this.sprite.body.velocity.y = -2500;
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
}

export default Cat;
