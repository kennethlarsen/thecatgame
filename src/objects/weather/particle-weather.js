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
  }

  remove() {
    this.frontEmitter.kill();
    this.midEmitter.kill();
    this.backEmitter.kill();

    this.stopSounds();
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
  }

  setParticleXSpeed(particle, max, maxOffset = 30) {
    particle.body.velocity.x = max - Math.floor(Math.random() * maxOffset);
  }

  setParticleRotation(particle, offset) {
    particle.rotation = Math.atan(offset / particle.body.velocity.y);
  }
}

export default ParticleWeather;
