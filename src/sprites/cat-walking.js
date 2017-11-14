import Phaser from 'phaser';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);

    this.animations.add('walk');
  }

  walk(fps = 10) {
    if (this.animations.paused) {
      this.animations.paused = false;
    } else {
      this.animations.play('walk', 10, true);
    }

    this.animations.getAnimation('walk').delay = 1000 / fps;
  }

  halt() {
    this.animations.paused = true;
  }
}
