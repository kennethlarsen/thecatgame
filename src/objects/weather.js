class Weather {
  constructor({ game, config }) {
    this.game = game;
    this.config = config;
    this.environments = [];
  }

  add() {
    if (!this.config) {
      return;
    }

    this.config.forEach(environment => this.addWeather(environment));
  }

  addWeather(environment) {
    const WeatherClass = environment.class;

    const weather = new WeatherClass({
      game: this.game,
      config: environment.config,
    });

    this.environments.push(weather);
    weather.add();
  }

  update(speed) {
    this.environments.forEach(weather => weather.update(speed));
  }

  resize(scale) {
    this.environments.forEach(weather => weather.resize(scale));
  }

  remove() {
    this.environments.forEach(weather => weather.remove());
  }
}

export default Weather;
