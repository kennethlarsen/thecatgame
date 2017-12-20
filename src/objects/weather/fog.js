import globalConfig from '../../config';

class Fog {
  constructor({ game, config }) {
    this.game = game;

    const defaults = globalConfig.defaults.weather.fog;
    this.config = Object.assign(defaults, config);
  }

  add() {
    const { width, height } = this.game.world;
    const fog = this.game.add.bitmapData(width, height);
    const { color, alpha, tweenDuration } = this.config;

    fog.ctx.rect(0, 0, width, height);
    fog.ctx.fillStyle = color;
    fog.ctx.fill();

    this.fogSprite = this.game.add.sprite(0, 0, fog);
    this.fogSprite.alpha = 0;

    this.game.add
      .tween(this.fogSprite)
      .to({ alpha }, tweenDuration, null, true);
  }

  update(speed) {
  }

  remove() {
    const { tweenDuration } = this.config;

    const fogTween = this.game.add
      .tween(this.fogSprite)
      .to({ alpha: 0 }, tweenDuration, null, true);

    fogTween.onComplete.add(() => this.fogSprite.kill(), this);
  }
}

export default Fog;
