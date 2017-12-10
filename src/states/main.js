import Phaser from 'phaser';
import config from '../config';
import Cat from '../objects/cat';
import Ground from '../objects/ground';
import Background from '../objects/background';
import Batteries from '../objects/batteries';
import Weather from '../objects/weather';
import Obstacle from '../objects/obstacle';
import TimeMachine from '../objects/time-machine';

export default class extends Phaser.State {
  init(timeMachine) {
    this.timeMachine = timeMachine || new TimeMachine();
    this.time = this.timeMachine.currentTime;
  }

  create() {
    this.moved = false;
    this.game.time.advancedTiming = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.batteries = new Batteries();

    this.background = new Background({
      game: this.game,
      config: this.time.config.background,
    });

    // this.background.use(futureTime1.background);

    this.ground = new Ground({
      game: this.game,
      config: this.time.config.ground,
    });

    this.obstacle = new Obstacle({
      game: this.game,
      frames: this.time.config.obstacles.frames,
    });

    this.weather = new Weather(this.game);

    // Uncomment to add weather effects
    // this.weather.addSmog();
    // this.weather.removeSmog();
    // this.weather.addRain();

    this.cat = new Cat({
      game: this.game,
      x: this.world.centerX - 200,
      y: this.world.centerY + (this.world.centerY * 0.4),
    });

    if (this.time.config.weather === 'snow') {
      this.weather.addSnow();
    }

    this.addEnergyCounter();
    this.addTravelLevel();
    this.addTime();

    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    const loadKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    const travelKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

    this.game.input.onDown.add(() => this.cat.speedUp());
    jumpKey.onDown.add(() => this.cat.jump());
    loadKey.onUp.add(() => this.cat.chargeBatteries(this.batteries));
    travelKey.onUp.add(() => this.travelToFuture());

    const music = this.game.add.audio('furry-cat');
    music.play();
  }

  travelToFuture() {
    const traveled = this.timeMachine.travelToFuture(this.batteries);

    if (traveled) {
      this.game.state.start('Main', true, false, this.timeMachine);
    }
  }

  addEnergyCounter() {
    this.counter = this.add.text(20, 20, this.energyText(), {
      font: `50px ${config.fonts.primary}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  energyText() {
    return `Cat energy: ${this.cat.speed()}`;
  }

  addTravelLevel() {
    this.travelLevel = this.add.text(20, 90, this.travelLevelText(), {
      font: `25px ${config.fonts.primary}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  travelLevelText() {
    const level = this.batteries.isCharged
      ? 'You can travel to the future!'
      : `Charge your batteries: ${this.batteries.chargedCount}/${this.batteries.totalCount}`;

    return level;
  }

  addTime() {
    const x = this.game.world.width - 200;
    const y = 20;
    const text = this.timeMachine.currentYear;

    this.timeLabel = this.add.text(x, y, text, {
      font: `75px ${config.fonts.secondary}`,
      fill: config.fontColor,
      align: 'right',
    });
  }


  update() {
    this.cat.update();
    this.ground.update(this.cat.speed());
    this.background.update(this.cat.speed());
    this.obstacle.update(this.cat.speed());

    if (this.time.config.weather === 'snow') {
      this.weather.updateSnow(this.cat.speed());
    }

    this.counter.text = this.energyText();
    this.travelLevel.text = this.travelLevelText();
    this.timeLabel.text = this.time.year; // this.timeMachine.currentYear;

    this.game.physics.arcade.collide(this.ground.sprite, this.cat.sprite);
    this.cat.collideWithAll(this.obstacle.sprites);

    if (!this.moved && this.cat.hasEnergy()) {
      this.moved = true;
    }

    if (this.moved && !this.cat.hasEnergy()) {
      this.batteries.use();
      this.timeMachine.travelToPast();
      this.game.state.start('Main', true, false, this.timeMachine);
    }
  }

  resize() {
    this.restart();
  }
}
