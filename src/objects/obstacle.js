import ObstacleSprite from '../sprites/obstacle';

class Obstacle {
  constructor({ game, frames }) {
    this.game = game;
    this.frames = frames;
    this.maxObstacles = 2;
    this.timer = 0;
    this.sprites = [];
  }

  release(frame) {
    const sprite = new ObstacleSprite({
      game: this.game,
      x: this.game.world.width,
      y: this.game.world.height - 150,
      frame,
    });

    sprite.checkWorldBounds = true;
    sprite.outOfBoundsKill = true;

    this.sprites.push(sprite);
    this.game.add.existing(sprite);
    sprite.events.onDestroy.add(this.remove, this);
    sprite.events.onOutOfBounds.add(this.remove, this);

    this.setNextReleaseTime();
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

    if (speed && itIsTimeToRelease && maxNotReached) {
      const frame = this.frames[Math.floor(Math.random() * this.frames.length)];
      this.release(frame);
    }

    this.sprites.forEach(sprite => sprite.move(speed));
  }
}

export default Obstacle;
