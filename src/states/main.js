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
import scaleFactor from '../utils/scale-factor';
import destroy from '../utils/safe-destroy';

export default class extends Phaser.State {
  init(timeMachine) {
    this.timeMachine = timeMachine || new TimeMachine();
    this.time = this.timeMachine.currentTime;

    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.setResizeCallback(this.resize, this);
  }

  create() {
    this.moved = false;
    this.game.time.advancedTiming = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.left = false;
    this.game.physics.arcade.checkCollision.right = false;

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
      config: this.time.config.obstacles,
    });

    this.weather = new Weather({
      game: this.game,
      config: this.time.config.weather,
    });

    this.cat = new Cat({ game: this.game });

    this.mouse = new Mouse({
      game: this.game,
      ground: this.ground,
      cat: this.cat,
      config: this.time.config.mice,
    });

    this.releaseInitialMouse();
    this.weather.add();

    this.batteries = new Batteries(this.game);
    this.addTime();

    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    const loadKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    const travelKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
    const fullScreenKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

    jumpKey.onDown.add(() => this.cat.jump());
    loadKey.onUp.add(() => this.cat.chargeBatteries(this.batteries));
    travelKey.onUp.add(() => this.travelToFuture());
    fullScreenKey.onUp.add(() => this.goFullscreen());

    const music = this.game.add.audio('furry-cat');
    music.loopFull();
    this.resize();
  }

  goFullscreen() {
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen();
    } else {
      this.game.scale.startFullScreen();
    }
  }

  travelToFuture() {
    const traveled = this.timeMachine.travelToFuture(this.batteries);

    if (traveled) {
      this.weather.remove();
      this.game.state.start('Main', true, false, this.timeMachine);
    }
  }

  addTime(scale = 1) {
    const x = Math.floor(this.game.world.width - (200 * scale));
    const y = Math.floor(20 * scale);
    const text = this.timeMachine.currentYear;
    const fontSize = Math.floor(config.reference.fontSize.large * scale);

    destroy(this.timeLabel);

    this.timeLabel = this.add.text(x, y, text, {
      font: `${fontSize}px ${config.fonts.secondary}`,
      fill: config.fontColor,
      align: 'right',
    });
  }

  releaseInitialMouse() {
    const { centerX, width } = this.cat.sprite;
    return this.mouse.release(Math.floor(centerX + (width * 0.8)));
  }

  update() {
    this.cat.update();

    const { speed, totalEnergy } = this.cat;
    this.ground.update(speed);
    this.background.update(speed);
    this.mouse.update(speed);
    this.obstacle.update(speed);
    this.weather.update(speed);
    this.batteries.update(totalEnergy);

    this.timeLabel.text = this.time.year;

    this.cat.collideWithAll(this.obstacle.sprites);

    if (!this.moved && this.cat.hasEnergy()) {
      this.moved = true;
    }

    if (!this.moved && !this.mouse.anyReleased) {
      this.releaseInitialMouse();
    }

    if (this.moved && !this.cat.hasEnergy()) {
      this.batteries.use();
      this.timeMachine.travelToPast();
      this.weather.remove();
      this.game.state.start('Main', true, false, this.timeMachine);
    }
  }

  resize() {
    const width = Math.floor(window.innerWidth * window.devicePixelRatio);
    const height = Math.floor(window.innerHeight * window.devicePixelRatio);

    this.scale.updateDimensions(width, height, true);
    const scale = scaleFactor(this.game);

    this.background.resize(scale);
    this.ground.resize(scale);
    this.cat.resize(scale);
    this.mouse.resize(scale);
    this.obstacle.resize(scale);
    this.weather.resize(scale);

    this.addTime(scale);
  }
}
