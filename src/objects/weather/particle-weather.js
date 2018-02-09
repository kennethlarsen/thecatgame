class ParticleWeather {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;

    this.frontEmitter = null;
    this.midEmitter = null;
    this.backEmitter = null;

    this.sounds = [];
  }

  add() {
    console.warn('Please overwrite add() in your weather object!');
  }

  remove() {
    this.frontEmitter.kill();
    this.midEmitter.kill();
    this.backEmitter.kill();

    this.stopSounds();
  }

  resize(scale) {
    const { width, centerX } = this.game.world;

    this.frontEmitter.scale.set(scale);
    this.midEmitter.scale.set(scale);
    this.backEmitter.scale.set(scale);

    this.frontEmitter.x = centerX;
    this.midEmitter.x = centerX;
    this.backEmitter.x = centerX;

    const emitterWidth = Math.floor((2 * width) / scale);

    this.frontEmitter.width = emitterWidth;
    this.midEmitter.width = emitterWidth;
    this.backEmitter.width = emitterWidth;
  }

  startSounds() {
    const { sounds } = this.config;

    if (!sounds) {
      return;
    }

    sounds.forEach((sound) => {
      const audio = this.game.add.audio(sound.key);
      this.sounds.push(audio);
      audio.loopFull(sound.level || 1);
    });
  }

  stopSounds() {
    this.sounds.forEach(sound => sound.stop());
    this.sounds = [];
  }

  setParticleXSpeed(particle, max, maxOffset = 30) {
    particle.body.velocity.x = max - Math.floor(Math.random() * maxOffset);
  }

  setParticleRotation(particle, offset) {
    particle.rotation = Math.atan(offset / particle.body.velocity.y);
  }
}

export default ParticleWeather;
