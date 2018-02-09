import Phaser from 'phaser';
import scaleFactor from '../utils/scale-factor';

class Ground {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;
    this.height = 150;

    this.use(config);
  }

  use(config) {
    if (this.sprite) {
      this.sprite.destroy();
    }

    this.sprite = this.game.add.tileSprite(
      0,
      this.game.world.height - this.height,
      this.game.world.width,
      this.height,
      config.asset,
    );

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
  }

  update(speed) {
    if (speed <= 0) {
      return;
    }

    // Cat walks ca. (dist * speed/20 fps) per 1000 ms (full walking cycle).
    // With an update rate of 60 fps, this is an update each 1000/60 ms.
    // So, the ground movement is:
    // (dist * speed/20) / game-fps per update call.
    const scale = scaleFactor(this.game);
    const walkCycleDistance = 180 * scale;
    const { fps } = this.game.time;
    const fullDistance = (walkCycleDistance * (speed / 20)) / fps;

    this.sprite.tilePosition.x -= Math.ceil(fullDistance);
  }

  resize(scale) {
    const { width, height } = this.game.world;
    const scaledHeight = Math.floor(this.sprite.height * scale);

    this.sprite.tileScale.set(scale);
    this.sprite.width = width;
    this.sprite.y = height - scaledHeight;
  }
}

export default Ground;
