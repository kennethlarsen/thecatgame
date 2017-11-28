class Weather {
  constructor(game) {
    this.game = game;
  }

  addSmog() {
    const fog = this.game.add.bitmapData(this.game.width, this.game.height);

    fog.ctx.rect(0, 0, this.game.width, this.game.height);
    fog.ctx.fillStyle = '#b2ddc8';
    fog.ctx.fill();

    this.fogSprite = this.game.add.sprite(0, 0, fog);

    this.fogSprite.alpha = 0;
    this.game.add.tween(this.fogSprite).to({ alpha: 0.7 }, 6000, null, true);
  }

  removeSmog() {
    const fogTween = this.game.add.tween(this.fogSprite).to({ alpha: 0 }, 6000, null, true);

    fogTween.onComplete.add(() => {
      this.fogSprite.kill();
    }, this);
  }

  addRain() {
    const rainParticle = this.game.add.bitmapData(15, 50);

    rainParticle.ctx.rect(0, 0, 15, 50);
    rainParticle.ctx.fillStyle = '#9cc9de';
    rainParticle.ctx.fill();

    this.rainEmitter = this.game.add.emitter(this.game.world.centerX, -900, 100);

    this.rainEmitter.width = this.game.world.width / 3;

    this.rainEmitter.angle = 90;

    this.rainEmitter.makeParticles(rainParticle);

    this.rainEmitter.minParticleScale = 0.1;
    this.rainEmitter.maxParticleScale = 0.3;

    this.rainEmitter.setYSpeed(600, 1000);
    this.rainEmitter.setXSpeed(-5, 5);

    this.rainEmitter.minRotation = 0;
    this.rainEmitter.maxRotation = 0;

    this.rainEmitter.start(false, 1600, 5, 0);
  }

  removeRain() {
    this.rainEmitter.kill();
  }

  addSnow() {
    this.snowBackEmitter = this.game.add.emitter(this.game.world.centerX, -32, 600);
    this.snowBackEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.snowBackEmitter.maxParticleScale = 0.6;
    this.snowBackEmitter.minParticleScale = 0.2;
    this.snowBackEmitter.setYSpeed(20, 100);
    this.snowBackEmitter.setXSpeed(-100, -50);
    this.snowBackEmitter.gravity = 0;
    this.snowBackEmitter.width = this.game.world.width * 2;
    this.snowBackEmitter.minRotation = -45;
    this.snowBackEmitter.maxRotation = 45;

    this.snowMidEmitter = this.game.add.emitter(this.game.world.centerX, -32, 250);
    this.snowMidEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.snowMidEmitter.maxParticleScale = 1.2;
    this.snowMidEmitter.minParticleScale = 0.8;
    this.snowMidEmitter.setYSpeed(50, 150);
    this.snowMidEmitter.setXSpeed(-50, 0);
    this.snowMidEmitter.gravity = 0;
    this.snowMidEmitter.width = this.game.world.width * 2;
    this.snowMidEmitter.minRotation = -45;
    this.snowMidEmitter.maxRotation = 45;

    this.snowFrontEmitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
    this.snowFrontEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.snowFrontEmitter.maxParticleScale = 1;
    this.snowFrontEmitter.minParticleScale = 0.5;
    this.snowFrontEmitter.setYSpeed(100, 200);
    this.snowFrontEmitter.setXSpeed(-100, 0);
    this.snowFrontEmitter.gravity = 0;
    this.snowFrontEmitter.width = this.game.world.width * 2;
    this.snowFrontEmitter.minRotation = -45;
    this.snowFrontEmitter.maxRotation = 45;

    this.snowBackEmitter.start(false, 14000, 20);
    this.snowMidEmitter.start(false, 12000, 40);
    this.snowFrontEmitter.start(false, 6000, 1000);
  }

  updateSnow(speed) {
    const offset = speed * 7;
    this.snowFrontEmitter.setXSpeed(-100 - offset, -50 - offset);
    this.snowMidEmitter.setXSpeed(-50 - offset, -offset);
    this.snowBackEmitter.setXSpeed(-100 - offset, -offset);

    this.snowFrontEmitter.forEachAlive(this.setParticleXSpeed, this, -50 - offset);
    this.snowMidEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
    this.snowBackEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
  }

  setParticleXSpeed(particle, max) {
    particle.body.velocity.x = max - Math.floor(Math.random() * 30);
  }

  removeSnow() {
    this.snowFrontEmitter.kill();
    this.snowMidEmitter.kill();
    this.snowBackEmitter.kill();
  }
}

export default Weather;
