import Phaser from 'phaser';

class Ground {
  constructor({ game, config }) {
    this.game = game;
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

    // Cat walks ca. (dist * speed/10 fps) per 1000 ms (full walking cycle).
    // With an update rate of 60 fps, this is an update each 1000/60 ms.
    // So, the ground movement is:
    // (dist * speed/10) / game-fps per update call.
    const walkCycleDistance = 180;
    const { fps } = this.game.time;
    const fullDistance = (walkCycleDistance * (speed / 10)) / fps;

    this.sprite.tilePosition.x -= fullDistance;
  }
}

export default Ground;
