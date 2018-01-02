import MouseSprite from '../sprites/mouse';

class Mouse {
  constructor({ game, ground, cat, config }) {
    this.game = game;
    this.ground = ground;
    this.cat = cat;
    this.config = config;
    this.maxVisible = 5;
    this.timer = 0;
    this.sprites = [];

    this.spriteYOffset = 98;
  }

  release(x) {
    const sprite = new MouseSprite({
      game: this.game,
      x: (x || this.game.world.width + 60),
      y: this.game.world.height - this.spriteYOffset,
      asset: this.config.asset,
    });

    sprite.checkWorldBounds = true;
    sprite.outOfBoundsKill = true;
    sprite.body.offset.y = -85;

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
        sprite.updateAngle();
        this.game.physics.arcade.collide(this.ground.sprite, sprite);
        this.ensureSpriteOffset(sprite);
      }
    });
  }

  ensureSpriteOffset(sprite) {
    const { height } = this.game.world;
    const beyondGround = sprite.y > height - this.spriteYOffset;

    if (beyondGround) {
      sprite.y = height - this.spriteYOffset;
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
