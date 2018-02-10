import Phaser from 'phaser';
import scaleFactor from '../utils/scale-factor';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, frame }) {
    super(game, x, y, 'obstacles');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(0.5);
    this.frame = frame;
    this.hit = false;
    this.avoided = false;
  }

  move(speed) {
    const scale = scaleFactor(this.game);
    const minVelocity = 20;
    const maxVelocity = 28;

    const velocity = Math.min(Math.max(speed, minVelocity), maxVelocity);
    const scaledVelocity = Math.floor(velocity * scale);
    const diameter = Math.floor(100 * scale);

    this.rotation -= (2 * scaledVelocity) / diameter;
    this.x -= scaledVelocity;
  }
}
