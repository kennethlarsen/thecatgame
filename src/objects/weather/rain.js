import ParticleWeather from './particle-weather';

export default class extends ParticleWeather {
  add() {
    this.backEmitter = this.game.add.emitter(this.game.world.centerX, -32, 300);
    this.backEmitter.makeParticles('rain', [0, 1, 2, 3, 4, 5]);
    this.backEmitter.maxParticleScale = 0.7;
    this.backEmitter.minParticleScale = 0.4;
    this.backEmitter.gravity = 0;
    this.backEmitter.setXSpeed(-5, 0);
    this.backEmitter.setYSpeed(600, 800);
    this.backEmitter.width = this.game.world.width * 2;
    this.backEmitter.minRotation = 0;
    this.backEmitter.maxRotation = 0;

    this.midEmitter = this.game.add.emitter(this.game.world.centerX, -32, 200);
    this.midEmitter.makeParticles('rain', [0, 1, 2, 3, 4, 5]);
    this.midEmitter.maxParticleScale = 1.0;
    this.midEmitter.minParticleScale = 0.8;
    this.midEmitter.gravity = 0;
    this.midEmitter.setXSpeed(-10, 0);
    this.midEmitter.setYSpeed(900, 1100);
    this.midEmitter.width = this.game.world.width * 2;
    this.midEmitter.minRotation = 0;
    this.midEmitter.maxRotation = 0;

    this.frontEmitter = this.game.add.emitter(this.game.world.centerX, -32, 1000);
    this.frontEmitter.makeParticles('rain', [0, 1, 2, 3, 4, 5]);
    this.frontEmitter.maxParticleScale = 0.8;
    this.frontEmitter.minParticleScale = 0.5;
    this.frontEmitter.gravity = 0;
    this.frontEmitter.setXSpeed(-25, 0);
    this.frontEmitter.setYSpeed(1100, 1300);
    this.frontEmitter.width = this.game.world.width * 2;
    this.frontEmitter.minRotation = 0;
    this.frontEmitter.maxRotation = 0;

    this.backEmitter.start(false, 2000, 5, 0);
    this.midEmitter.start(false, 1500, 5);
    this.frontEmitter.start(false, 1000, 5);

    this.startSounds();
  }

  update(speed) {
    const offset = speed * 20;
    this.frontEmitter.setXSpeed(-5 - offset, -offset);
    this.midEmitter.setXSpeed(-10 - offset, -offset);
    this.backEmitter.setXSpeed(-25 - offset, -offset);

    this.frontEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
    this.midEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);
    this.backEmitter.forEachAlive(this.setParticleXSpeed, this, -offset);

    this.frontEmitter.forEachAlive(this.setParticleRotation, this, 5 + offset);
    this.midEmitter.forEachAlive(this.setParticleRotation, this, 10 + offset);
    this.backEmitter.forEachAlive(this.setParticleRotation, this, 25 + offset);
  }
}
