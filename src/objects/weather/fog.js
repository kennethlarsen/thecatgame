class Fog {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;

    this.defaults = {
      alpha: 0.7,
      color: '#b2ddc8',
      tweenDuration: 6000,
    };
  }

  add() {
    const { width, height } = this.game.world;
    const fog = this.game.add.bitmapData(width, height);
    const alpha = this.config.alpha || this.defaults.alpha;
    const color = this.config.color || this.defaults.color;
    const duration = this.config.tweenDuration || this.defaults.tweenDuration;

    fog.ctx.rect(0, 0, width, height);
    fog.ctx.fillStyle = color;
    fog.ctx.fill();

    this.fogSprite = this.game.add.sprite(0, 0, fog);
    this.fogSprite.alpha = 0;

    this.game.add
      .tween(this.fogSprite)
      .to({ alpha }, duration, null, true);
  }

  update(speed) {
  }

  remove() {
    const duration = this.config.tweenDuration || this.defaults.tweenDuration;
    const fogTween = this.game.add
      .tween(this.fogSprite)
      .to({ alpha: 0 }, duration, null, true);

    fogTween.onComplete.add(() => this.fogSprite.kill(), this);
  }
}

export default Fog;
