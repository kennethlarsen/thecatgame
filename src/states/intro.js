import Phaser from 'phaser';
import config from '../config';

const textHoverColor = '#555555';

export default class extends Phaser.State {
  create() {
    this.content = [
      'Earth is getting colder because all the greenhouse gasses got avoided by all governments.',
      'Now there is only one cyber-cat that is able to get',
      '[some kind of fancy scientific device here] from the future to use it in the past to save the world!',
      'Please help us save the planet. You are our only hope!',
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
        font: `30px ${config.font}`,
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
        font: `45px ${config.font}`,
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
    item.fill = textHoverColor;
    this.game.canvas.style.cursor = 'pointer';
  }

  out(item) {
    item.fill = config.fontColor;
    this.game.canvas.style.cursor = 'default';
  }

  startGame() {
    this.game.state.start('Main');
  }
}
