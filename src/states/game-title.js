import Phaser from 'phaser';
import config from '../config';
import CatWalking from '../sprites/cat-walking';
import scaleFactor from '../utils/scale-factor';
import destroy from '../utils/safe-destroy';
import enableFullscreen from '../utils/enable-fullscreen';

export default class extends Phaser.State {
  init() {
    this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
    this.scale.setResizeCallback(this.resize, this);

    enableFullscreen(this.game);
  }

  create() {
    this.draw();
    this.resize();
  }

  draw(scale = 1) {
    this.addTitle(scale);
    this.addStartButton(scale);
    this.addCat(scale);
  }

  resize() {
    const width = Math.floor(window.innerWidth * window.devicePixelRatio);
    const height = Math.floor(window.innerHeight * window.devicePixelRatio);

    this.scale.updateDimensions(width, height, true);
    const scale = scaleFactor(this.game);

    this.draw(scale);
  }

  addTitle(scale) {
    destroy(this.title);

    const { centerX, centerY } = this.game.world;
    const y = Math.floor(centerY - (300 * scale));
    const fontSize = 50 * scale;

    this.title = this.add.text(centerX, y, config.gameName, {
      font: `${fontSize}px ${config.fonts.secondary}`,
      fill: config.fontColor,
      align: 'center',
    });

    this.title.anchor.set(0.5);
  }

  addCat(scale) {
    destroy(this.cat);

    const { centerX, centerY } = this.game.world;
    const y = Math.floor(centerY + (200 * scale));

    this.cat = new CatWalking({
      game: this.game,
      x: centerX,
      y,
      asset: 'cat-walking',
    });

    this.cat.scale.setTo(scale);
    this.game.add.existing(this.cat);
    this.cat.walk();
  }

  addStartButton(scale) {
    destroy(this.startButton);

    const { centerX, centerY } = this.game.world;
    const fontSize = 45 * scale;

    this.startButton = this.add.text(centerX, centerY, 'start', {
      font: `${fontSize}px ${config.fonts.secondary}`,
      fill: config.fontColor,
      align: 'center',
    });

    this.startButton.anchor.set(0.5);
    this.startButton.inputEnabled = true;
    this.startButton.events.onInputOver.add(this.over, this);
    this.startButton.events.onInputOut.add(this.out, this);
    this.startButton.events.onInputUp.add(this.startGame, this);
  }

  over(item) {
    item.fill = config.textHoverColor;
    this.game.canvas.style.cursor = 'pointer';
  }

  out(item) {
    item.fill = config.fontColor;
    this.game.canvas.style.cursor = 'default';
  }

  startGame() {
    const localStorageKey = `${config.localStorageName}-watchedIntro`;
    const watchedIntro = window.localStorage.getItem(localStorageKey);

    if (watchedIntro) {
      this.game.state.start('Main');
    } else {
      this.game.state.start('Intro');
    }
  }
}
