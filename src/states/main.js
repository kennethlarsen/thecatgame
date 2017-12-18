import Phaser from 'phaser';
import config from '../config';
import Cat from '../objects/cat';
import Ground from '../objects/ground';
import Background from '../objects/background';
import Batteries from '../objects/batteries';
import Weather from '../objects/weather';
import Obstacle from '../objects/obstacle';
import TimeMachine from '../objects/time-machine';
import Mouse from '../objects/mouse';

export default class extends Phaser.State {
  init(timeMachine) {
    this.timeMachine = timeMachine || new TimeMachine();
    this.time = this.timeMachine.currentTime;
  }

  create() {
    this.moved = false;
    this.game.time.advancedTiming = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.background = new Background({
      game: this.game,
      config: this.time.config.background,
    });

    this.ground = new Ground({
      game: this.game,
      config: this.time.config.ground,
    });

    this.obstacle = new Obstacle({
      game: this.game,
      frames: this.time.config.obstacles.frames,
    });

    this.weather = new Weather({
      game: this.game,
      config: this.time.config.weather,
    });

    this.cat = new Cat({
      game: this.game,
      x: this.world.centerX - 200,
      y: this.world.centerY + (this.world.centerY * 0.4),
    });

    this.mouse = new Mouse({
      game: this.game,
      ground: this.ground,
      cat: this.cat,
      config: this.time.config.mice,
    });

    this.mouse.release(this.cat.sprite.centerX + 400);

    this.weather.add();

    this.batteries = new Batteries(this.game);
    this.addTime();

    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    const loadKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    const travelKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

    jumpKey.onDown.add(() => this.cat.jump());
    loadKey.onUp.add(() => this.cat.chargeBatteries(this.batteries));
    travelKey.onUp.add(() => this.travelToFuture());

    const music = this.game.add.audio('furry-cat');
    music.loopFull();
  }

  travelToFuture() {
    const traveled = this.timeMachine.travelToFuture(this.batteries);

    if (traveled) {
      this.weather.remove();
      this.game.state.start('Main', true, false, this.timeMachine);
    }
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

    const { speed, totalEnergy } = this.cat;
    this.mouse.update(speed);
    this.ground.update(speed);
    this.background.update(speed);
    this.obstacle.update(speed);
    this.weather.update(speed);
    this.batteries.update(totalEnergy);

    this.timeLabel.text = this.time.year;

    this.game.physics.arcade.collide(this.ground.sprite, this.cat.sprite);
    this.cat.collideWithAll(this.obstacle.sprites);

    if (!this.moved && this.cat.hasEnergy()) {
      this.moved = true;
    }

    if (this.moved && !this.cat.hasEnergy()) {
      this.batteries.use();
      this.timeMachine.travelToPast();
      this.weather.remove();
      this.game.state.start('Main', true, false, this.timeMachine);
    }
  }

  resize() {
    this.restart();
  }
}
