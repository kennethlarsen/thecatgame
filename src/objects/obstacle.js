import ObstacleSprite from '../sprites/obstacle';
import gameConfig from '../config';
import scaleFactor from '../utils/scale-factor';

class Obstacle {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;
    this.maxObstacles = 2;
    this.timer = 0;
    this.sprites = [];

    this.offset = gameConfig.groundHeight - 40;
  }

  release(frame) {
    const { width, height } = this.game.world;
    const scale = scaleFactor(this.game);

    const sprite = new ObstacleSprite({
      game: this.game,
      x: width,
      y: height,
      frame,
    });

    sprite.checkWorldBounds = true;
    sprite.body.collideWorldBounds = true;
    sprite.outOfBoundsKill = true;

    sprite.body.offset.y = this.offset;
    sprite.scale.set(scale);

    sprite.events.onDestroy.add(this.remove, this);
    sprite.events.onOutOfBounds.add(this.remove, this);
    this.sprites.push(sprite);

    this.setNextReleaseTime();

    this.game.add.existing(sprite);
  }

  remove(sprite) {
    const index = this.sprites.indexOf(sprite);

    if (index > -1) {
      this.sprites.splice(index, 1);
    }
  }

  setNextReleaseTime() {
    const values = [
      80,
      100,
      Math.floor(Math.random() * (3000 - 2000)) + 2000,
      Math.floor(Math.random() * (8000 - 5000)) + 5000,
    ];

    const difference = values[Math.floor(Math.random() * values.length)];
    this.timer = this.game.time.now + difference;
  }

  update(speed) {
    const maxNotReached = this.sprites.length < this.maxObstacles;
    const itIsTimeToRelease = this.game.time.now > this.timer;
    const { frames } = this.config;

    if (speed && itIsTimeToRelease && maxNotReached) {
      const frame = frames[Math.floor(Math.random() * frames.length)];
      this.release(frame);
    }

    this.sprites.forEach(sprite => sprite.move(speed));
  }

  resize(scale) {
    const { height } = this.game.world;

    this.sprites.forEach((sprite) => {
      sprite.y = height;
      sprite.scale.set(scale);
    });
  }
}

export default Obstacle;
