class Background {
  constructor({ game, config }) {
    this.game = game;
    this.height = game.world.height;

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
      this.game.height - height - yOffset,
      this.game.width,
      height,
      asset,
    );

    return sprite;
  }

  update(speed) {
    // just a bit of delay, so that it looks nicer.
    if (speed < 6) {
      return;
    }

    // Create a parallax effect
    this.back.tilePosition.x -= 0.1;
    this.mid.tilePosition.x -= 0.3;
    this.front.tilePosition.x -= 0.75;
  }
}

export default Background;
