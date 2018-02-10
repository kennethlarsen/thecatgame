import MouseSprite from '../sprites/mouse';
import scaleFactor from '../utils/scale-factor';
import gameConfig from '../config';

class Mouse {
  constructor({ game, ground, cat, config }) {
    this.game = game;
    this.ground = ground;
    this.cat = cat;
    this.config = config;
    this.maxVisible = 5;
    this.timer = 0;
    this.sprites = [];

    this.referenceGravity = 7000;
    this.offset = gameConfig.reference.groundHeight - 90;
  }

  get anyReleased() {
    return this.sprites.length > 0;
  }

  release(x) {
    const { width, height } = this.game.world;
    const scale = scaleFactor(this.game);

    const sprite = new MouseSprite({
      game: this.game,
      x: (x || width + Math.floor(60 * scale)),
      y: height,
      asset: this.config.asset,
    });

    sprite.checkWorldBounds = true;
    sprite.body.collideWorldBounds = true;
    sprite.outOfBoundsKill = true;

    sprite.body.offset.y = this.offset;
    sprite.body.gravity.y = Math.floor(this.referenceGravity * scale);
    sprite.scale.set(-scale, scale);

    sprite.events.onDestroy.add(this.remove, this);
    sprite.events.onOutOfBounds.add(this.remove, this);

    sprite.inputEnabled = true;
    sprite.input.enableDrag();
    sprite.input.useHandCursor = true;
    sprite.events.onDragStart.add(this.onDragStart, this);
    sprite.events.onDragStop.add(this.onDragStop, this);

    this.sprites.push(sprite);

    this.setNextReleaseTime();
    this.game.add.existing(sprite);

    return sprite;
  }

  remove(sprite) {
    const index = this.sprites.indexOf(sprite);

    if (index > -1) {
      this.sprites.splice(index, 1);
    }
  }

  setNextReleaseTime() {
    const values = [
      Math.floor(Math.random() * (900 - 450)) + 450,
      Math.floor(Math.random() * (3000 - 1000)) + 1000,
    ];

    const difference = values[Math.floor(Math.random() * values.length)];
    this.timer = this.game.time.now + difference;
  }

  update(speed) {
    const maxNotReached = this.sprites.length < this.maxVisible;
    const itIsTimeToRelease = this.game.time.now > this.timer;

    if (speed && itIsTimeToRelease && maxNotReached) {
      this.release();
    }

    this.sprites.forEach((sprite) => {
      if (!sprite.input.isDragged) {
        sprite.move(speed);
        sprite.updateAngle();
      }
    });
  }

  resize(scale) {
    const { height } = this.game.world;

    this.sprites.forEach((sprite) => {
      const xScale = sprite.scale.x < 0 ? -1 : 1;
      sprite.body.y = height;
      sprite.body.gravity.y = Math.floor(this.referenceGravity * scale);
      sprite.scale.set(xScale * scale, scale);
    });
  }

  onDragStart(sprite, pointer) {
    sprite.body.moves = false;
  }

  onDragStop(sprite, pointer) {
    const mouseOverCat = this.cat.sprite.getBounds()
      .contains(pointer.x, pointer.y);

    if (mouseOverCat) {
      sprite.destroy();
      this.cat.speedUp();
    } else {
      sprite.body.moves = true;
    }
  }
}

export default Mouse;
