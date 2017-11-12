import Phaser from 'phaser';

export default class extends Phaser.State {
  create() {
  }

  restartGame() {
    this.game.state.start('Main');
  }
}
