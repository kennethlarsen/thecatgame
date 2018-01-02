class Background {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;

    this.use(config);
  }

  use(config) {
    if (this.front && this.mid && this.back) {
      this.front.destroy();
      this.mid.destroy();
      this.back.destroy();
    }

    const { front, mid, back } = config;

    this.back = this.addSprite(back.asset, back.offset);
    this.mid = this.addSprite(mid.asset, mid.offset);
    this.front = this.addSprite(front.asset, front.offset);
  }

  addSprite(asset, yOffset) {
    const { height } = this.game.cache.getImage(asset);
    const sprite = this.game.add.tileSprite(
      0,
      this.game.world.height - height - yOffset,
      this.game.world.width,
      height,
      asset,
    );

    return sprite;
  }

  update(speed) {
    if (speed <= 0) {
      return;
    }

    // Create a parallax effect
    this.back.tilePosition.x -= 0.1;
    this.mid.tilePosition.x -= 0.3;
    this.front.tilePosition.x -= 0.75;
  }

  resize() {
    const { front, mid, back } = this.config;

    this.resizeSprite(this.back, back.offset);
    this.resizeSprite(this.mid, mid.offset);
    this.resizeSprite(this.front, front.offset);
  }

  resizeSprite(sprite, yOffset) {
    const { width, height } = this.game.world;

    sprite.width = width;
    sprite.y = height - sprite.height - yOffset;
  }
}

export default Background;
