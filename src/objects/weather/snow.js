import ParticleWeather from './particle-weather';

export default class extends ParticleWeather {
  add() {
    this.backEmitter = this.game.add.emitter(this.game.world.centerX, -32, 600);
    this.backEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.backEmitter.maxParticleScale = 0.6;
    this.backEmitter.minParticleScale = 0.2;
    this.backEmitter.setYSpeed(20, 100);
    this.backEmitter.setXSpeed(-100, -50);
    this.backEmitter.gravity = 0;
    this.backEmitter.width = this.game.world.width * 2;
    this.backEmitter.minRotation = -45;
    this.backEmitter.maxRotation = 45;

    this.midEmitter = this.game.add.emitter(this.game.world.centerX, -32, 250);
    this.midEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.midEmitter.maxParticleScale = 1.2;
    this.midEmitter.minParticleScale = 0.8;
    this.midEmitter.setYSpeed(50, 150);
    this.midEmitter.setXSpeed(-50, 0);
    this.midEmitter.gravity = 0;
    this.midEmitter.width = this.game.world.width * 2;
    this.midEmitter.minRotation = -45;
    this.midEmitter.maxRotation = 45;

    this.frontEmitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
    this.frontEmitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
    this.frontEmitter.maxParticleScale = 1;
    this.frontEmitter.minParticleScale = 0.5;
    this.frontEmitter.setYSpeed(100, 200);
    this.frontEmitter.setXSpeed(-100, 0);
    this.frontEmitter.gravity = 0;
    this.frontEmitter.width = this.game.world.width * 2;
    this.frontEmitter.minRotation = -45;
    this.frontEmitter.maxRotation = 45;

    this.backEmitter.start(false, 14000, 20);
    this.midEmitter.start(false, 12000, 40);
    this.frontEmitter.start(false, 6000, 1000);

    this.startSounds();
  }

  update(speed) {
    const offset = speed * 7;
    this.frontEmitter.setXSpeed(-100 - offset, -50 - offset);
    this.midEmitter.setXSpeed(-50 - offset, -offset);
    this.backEmitter.setXSpeed(-100 - offset, -offset);

    this.frontEmitter.forEachAlive(this.setParticleXSpeed, this, -50 - offset);
    this.midEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
    this.backEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
  }
}
