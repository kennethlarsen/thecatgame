import Phaser from 'phaser';
import config from '../config';
import Cat from '../objects/cat';
import Ground from '../objects/ground';
import Background from '../objects/background';
import Batteries from '../objects/batteries';
import TimeMachine from '../objects/time-machine';
import Weather from '../objects/weather';

export default class extends Phaser.State {
  create() {
    this.moved = false;
    this.game.time.advancedTiming = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.batteries = new Batteries();
    this.timeMachine = new TimeMachine();

    this.background = new Background({
      game: this.game,
      assets: ['background-1', 'background-2', 'background-3'],
    });

    this.ground = new Ground({
      game: this.game,
      asset: 'ground-snow',
    });

    this.weather = new Weather(this.game);

    // Uncomment to add weather effects
    // this.weather.addSmog();
    // this.weather.removeSmog();
    // this.weather.addRain();

    this.cat = new Cat({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + (this.world.centerY * 0.4),
    });

    this.weather.addSnow();

    this.addEnergyCounter();
    this.addTravelLevel();
    this.addTime();

    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    const loadKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    const travelKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

    this.game.input.onDown.add(() => this.cat.speedUp());
    jumpKey.onDown.add(() => this.cat.jump());
    loadKey.onUp.add(() => this.cat.chargeBatteries(this.batteries));
    travelKey.onUp.add(() => this.timeMachine.travelToFuture(this.batteries));

    const music = this.game.add.audio('furry-cat');

    music.play();
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

    this.time = this.add.text(x, y, text, {
      font: `75px ${config.fonts.secondary}`,
      fill: config.fontColor,
      align: 'right',
    });
  }


  update() {
    this.cat.update();
    this.ground.update(this.cat.speed());
    this.background.update(this.cat.speed());
    this.weather.updateSnow(this.cat.speed());

    this.counter.text = this.energyText();
    this.travelLevel.text = this.travelLevelText();
    this.time.text = this.timeMachine.currentYear;

    this.game.physics.arcade.collide(this.ground.sprite, this.cat.sprite);

    if (!this.moved && this.cat.hasEnergy()) {
      this.moved = true;
    }

    if (this.moved && !this.cat.hasEnergy()) {
      this.timeMachine.travelToPast();
      this.batteries.use();
      this.moved = false;
    }
  }

  resize() {
    this.restart();
  }
}
