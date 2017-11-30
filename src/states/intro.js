import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {
  create() {
    this.content = [
      `${(new Date()).getFullYear()}.`,
      '',
      'Earth is getting colder.',
      'The world’s governments managaged to avoid all',
      'greenhouse gasses, so climate change got inverted.',
      'Now there is only one cyber-cat who is able to get',
      '[some kind of fancy scientific device here] from the',
      'future to use it in the past and save the world from',
      'freezing.',
      '',
      'Please help us save the planet.',
      'You are our only hope!',
    ];

    this.line = [];

    this.wordIndex = 0;
    this.lineIndex = 0;

    this.wordDelay = 160;
    this.lineDelay = 450;

    this.text = this.game.add.text(
      32,
      32,
      '',
      {
        font: `30px ${config.fonts.primary}`,
        fill: config.fontColor,
      },
    );

    this.nextLine();
  }

  nextLine() {
    if (this.lineIndex === this.content.length) {
      //  We're finished, add start button
      this.addStartButton();
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

  addStartButton() {
    const startButton = this.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      'save the world',
      {
        font: `45px ${config.fonts.secondary}`,
        fill: config.fontColor,
        align: 'center',
      },
    );

    startButton.anchor.set(0.5);
    startButton.inputEnabled = true;
    startButton.events.onInputOver.add(this.over, this);
    startButton.events.onInputOut.add(this.out, this);
    startButton.events.onInputUp.add(this.startGame, this);
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
}
