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
    this.spriteYOffset = gameConfig.groundHeight;
    this.spriteBodyYOffset = -86;
  }

  get anyReleased() {
    return this.sprites.length > 0;
  }

  release(x) {
    const { width, height } = this.game.world;
    const scale = scaleFactor(this.game);
    const spriteOffset = Math.ceil(this.spriteYOffset * scale);

    const sprite = new MouseSprite({
      game: this.game,
      x: (x || width + Math.floor(60 * scale)),
      y: Math.floor(height - spriteOffset),
      asset: this.config.asset,
    });

    sprite.scale.set(-scale, scale);
    sprite.body.gravity.y = Math.floor(this.referenceGravity * scale);
    sprite.body.offset.y = Math.floor(this.spriteBodyYOffset * scale);

    sprite.checkWorldBounds = true;
    sprite.outOfBoundsKill = true;

    sprite.events.onDestroy.add(this.remove, this);
    sprite.events.onOutOfBounds.add(this.remove, this);

    sprite.inputEnabled = true;
    sprite.input.enableDrag();
    sprite.input.useHandCursor = true;
    sprite.events.onDragStart.add(this.onDragStart, this);
    sprite.events.onDragStop.add(this.onDragStop, this);

    this.sprites.push(sprite);
    this.game.add.existing(sprite);

    this.setNextReleaseTime();

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

        if (speed > 0) {
          sprite.updateAngle();
        }

        this.game.physics.arcade.collide(this.ground.sprite, sprite);
        // this.ensureSpriteOffset(sprite);
      }
    });
  }

  resize(scale) {
    const { height } = this.game.world;

    this.sprites.forEach((sprite) => {
      const { x } = sprite.scale;
      const xScale = x < 0 ? -1 : 1;
      sprite.scale.set(xScale * scale, scale);
      sprite.body.y = Math.floor(height - (this.spriteYOffset * scale))
      sprite.body.offset.y = Math.floor(this.spriteBodyYOffset * scale);

      this.game.physics.arcade.collide(this.ground.sprite, sprite);
    });
  }

  ensureSpriteOffset(sprite) {
    const { height } = this.game.world;
    const scale = scaleFactor(this.game);
    const spriteOffset = Math.ceil(this.spriteYOffset * scale);
    const bodyOffset = Math.floor(this.spriteBodyYOffset * scale);
    const beyondGround = sprite.y > height - spriteOffset;

    if (beyondGround) {
      sprite.y = Math.floor(height - spriteOffset);
      sprite.body.offset.y = bodyOffset;
    }
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
