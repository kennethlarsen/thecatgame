import Phaser from 'phaser';
import config from '../config';
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
    this.addText();
    this.resize();
    this.typeText();
  }

  addText() {
    const fontSize = config.reference.fontSize.medium;

    this.text = this.game.add.text(0, 0, '', {
      font: `${fontSize}px ${config.fonts.primary}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  typeText() {
    this.content = [
      `${(new Date()).getFullYear()}.`,
      '',
      'Earth is getting colder.',
      'The world’s governments managed to avoid all',
      'greenhouse gasses, so climate change got inverted.',
      'Now there is only one cyber-cat who is able to find',
      'a mysterious artifact in the future and bring it back',
      'to the past to save the world from freezing.',
      '',
      'Please help us save the planet.',
      'You are our only hope!',
    ];

    this.line = [];

    this.wordIndex = 0;
    this.lineIndex = 0;

    this.wordDelay = 160;
    this.lineDelay = 450;

    this.nextLine();
  }

  nextLine() {
    if (this.lineIndex === this.content.length) {
      //  We're finished, add start button
      const scale = scaleFactor(this.game);
      this.addStartButton(scale);
      return;
    }

    this.line = this.content[this.lineIndex].split(' ');
    this.wordIndex = 0;

    this.game.time.events.repeat(this.wordDelay, this.line.length, this.nextWord, this);
    this.lineIndex += 1;
  }

  nextWord() {
    this.text.text = this.text.text.concat(`${this.line[this.wordIndex]} `);
    this.wordIndex += 1;

    if (this.wordIndex === this.line.length) {
      this.text.text = this.text.text.concat('\n');

      this.game.time.events.add(this.lineDelay, this.nextLine, this);
    }
  }

  addStartButton(scale = 1) {
    destroy(this.startButton);

    const fontSize = Math.ceil(45 * scale);
    const { centerX, height } = this.game.world;

    this.startButton = this.add.text(
      centerX,
      height - (300 * scale),
      'save the world',
      {
        font: `${fontSize}px ${config.fonts.secondary}`,
        fill: config.fontColor,
        align: 'center',
      },
    );

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
    window.localStorage.setItem(`${config.localStorageName}-watchedIntro`, true);
    this.game.state.start('Main');
  }

  resize() {
    const width = Math.floor(window.innerWidth * window.devicePixelRatio);
    const height = Math.floor(window.innerHeight * window.devicePixelRatio);

    this.scale.updateDimensions(width, height, true);

    const textMaxWidth = 1120;
    const widthRatio = textMaxWidth > width ? width / textMaxWidth : 1;
    const scale = scaleFactor(this.game) * widthRatio;

    this.text.x = this.game.world.centerX - (textMaxWidth * 0.5 * scale);
    this.text.y = 80 * scale;
    this.text.scale.setTo(scale);

    if (this.startButton) {
      this.addStartButton(scale);
    }
  }
}
