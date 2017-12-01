import Phaser from 'phaser';

class Ground {
  constructor({ game, asset }) {
    this.game = game;
    this.height = 150;

    this.useAsset(asset);
  }

  useAsset(asset) {
    if (this.sprite) {
      this.sprite.destroy();
    }

    this.sprite = this.game.add.tileSprite(
      this.game.world.centerX,
      this.game.world.height - this.height,
      this.game.world.width,
      this.height,
      asset,
    );

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.immovable = true;
  }

  update(speed) {
    this.game.physics.arcade.collide(this.sprite);

    // just a bit of delay, so that it looks nicer.
    if (speed < 6) {
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
