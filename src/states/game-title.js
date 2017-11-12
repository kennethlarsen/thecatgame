import Phaser from 'phaser';
import config from '../config';

const textHoverColor = '#555555';

export default class extends Phaser.State {
  create() {
    this.add.text(
      this.game.world.centerX,
      100,
      'The Cat Game',
      {
        font: `50px ${config.font}`,
        fill: config.fontColor,
        align: 'center',
      },
    ).anchor.set(0.5);

    const startButton = this.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      'start',
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
