import Phaser from 'phaser';
import scaleFactor from '../utils/scale-factor';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.set(0.1);

    this.anchor.setTo(0.5);
    this.animations.add('walk');

    this.setFleeStartPoint();
    this.setFleeSpeedFactor();
  }

  setFleeStartPoint() {
    const maxRunStart = 0.7;
    const minRunStart = 0.4;
    const random = (Math.random() * (maxRunStart - minRunStart)) + minRunStart;
    this.fleeStartPoint = this.game.world.width * random;
  }

  setFleeSpeedFactor() {
    const maxSpeed = 80;
    const minSpeed = 10;
    this.fleeSpeedFactor = (Math.random() * (maxSpeed - minSpeed)) + minSpeed;
  }

  move(speed) {
    if (speed <= 0) {
      return;
    }

    // Cat walks ca. (dist * speed/20 fps) per 1000 ms (full walking cycle).
    // With an update rate of 60 fps, this is an update each 1000/60 ms.
    // So, the ground movement is:
    // (dist * speed/10) / game-fps per update call.
    const scale = scaleFactor(this.game);
    const walkCycleDistance = 180 * scale;
    const { fps } = this.game.time;
    const fullDistance = (walkCycleDistance * (speed / 20)) / fps;

    this.x -= Math.ceil(fullDistance);

    if (this.x < this.fleeStartPoint) {
      this.scale.set(scale);
      this.body.velocity.x = Math.floor(fullDistance * this.fleeSpeedFactor);
      this.animations.play('walk', 20, true);
    }
  }

  updateAngle() {
    // Add a body angle while falling:
    const velocity = this.body.velocity.y;
    const maxAngle = 75;
    const angle = velocity && maxAngle;
    this.rotation = (velocity * (angle / this.body.gravity.y)) / 60;
  }
}
