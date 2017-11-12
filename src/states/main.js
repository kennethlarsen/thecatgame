import Phaser from 'phaser';
import config from '../config';
import CatWalking from '../sprites/cat-walking';

export default class extends Phaser.State {
  init() {
    this.energy = 0;
    this.addEnergyCounter();
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cat = new CatWalking({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + (this.world.centerY * 0.4),
      asset: 'catWalking',
    });

    this.game.add.existing(this.cat);
    this.game.input.onUp.add(this.storeEnergy, this);
  }

  storeEnergy() {
    if (this.energy < 1000) {
      this.energy += 20;
    }
  }

  addEnergyCounter() {
    this.counter = this.add.text(20, 20, this.energyText(), {
      font: `50px ${config.font}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  energyText() {
    return `Cat energy: ${Math.floor(this.energy / 10)}`;
  }

  update() {
    if (this.energy > 0) {
      const weighedEnergy = Math.sqrt(this.energy);
      const fps = Math.floor(weighedEnergy);
      this.cat.walk(fps);

      // remove more energy for a higher energy level:
      this.energy -= Math.floor(weighedEnergy / 7) || 1;
      this.counter.text = this.energyText();
    } else {
      this.cat.halt();
    }
  }

  resize() {
    this.restart();
  }
}
