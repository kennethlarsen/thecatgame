import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, frame }) {
    super(game, x, y, 'obstacles');
    this.anchor.setTo(0.5);
    this.frame = frame;
    this.hit = false;
    this.avoided = false;
  }

  move(speed) {
    const velocity = Math.max(speed, 20);
    const diameter = 100;

    this.rotation -= (2 * velocity) / diameter;
    this.x -= velocity;
  }
}
