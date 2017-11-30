import Phaser from 'phaser';
import config from '../config';
import CatWalking from '../sprites/cat-walking';

export default class extends Phaser.State {
  create() {
    this.addTitle();
    this.addCat();
    this.addStartButton();
  }

  addTitle() {
    this.add.text(
      this.game.world.centerX,
      this.game.world.centerY - (this.game.world.centerY * 0.8),
      'The Cat Game',
      {
        font: `50px ${config.font}`,
        fill: config.fontColor,
        align: 'center',
      },
    ).anchor.set(0.5);
  }

  addCat() {
    const cat = new CatWalking({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + (this.world.centerY * 0.4),
      asset: 'cat-walking',
    });

    this.game.add.existing(cat);
    cat.walk();
  }

  addStartButton() {
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
    item.fill = config.textHoverColor;
    this.game.canvas.style.cursor = 'pointer';
  }

  out(item) {
    item.fill = config.fontColor;
    this.game.canvas.style.cursor = 'default';
  }

  startGame() {
    this.game.state.start('Intro');
  }
}
