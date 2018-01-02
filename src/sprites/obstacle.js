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
    const minVelocity = 20;
    const maxVelocity = 28;

    const velocity = Math.min(Math.max(speed, minVelocity), maxVelocity);
    const diameter = 100;

    this.rotation -= (2 * velocity) / diameter;
    this.x -= velocity;
  }
}
