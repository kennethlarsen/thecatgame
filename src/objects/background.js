import Phaser from 'phaser';

class Background {
  constructor({ game, assets }) {
    this.game = game;
    this.height = game.world.height;

    this.useAsset(assets);
  }

  useAsset(assets) {
    if (this.foreground && this.midground && this.background) {
      this.foreground.destroy();
      this.midground.destroy();
      this.background.destroy();
    }

    this.background = this.addSprite(assets, 2, 300);
    this.midground = this.addSprite(assets, 1, 125);
    this.foreground = this.addSprite(assets, 0, -50);
  }

  addSprite(assets, index, yOffset = 0) {
    const { height } = this.game.cache.getImage(assets[index]);
    const sprite = this.game.add.tileSprite(
      0,
      this.game.height - height - yOffset,
      this.game.width,
      height,
      assets[index],
    );

    return sprite;
  }

  update(speed) {
    // just a bit of delay, so that it looks nicer.
    if (speed < 6) {
      return;
    }

    // Create a parallax effect
    this.background.tilePosition.x -= 0.1;
    this.midground.tilePosition.x -= 0.3;
    this.foreground.tilePosition.x -= 0.75;
  }
}

export default Background;
