import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.spritesheet('cat-walking', 'assets/images/cat-walking.png', 500, 236, 10);
    this.load.spritesheet('snowflakes', 'assets/images/snow.png', 20, 20);

    this.load.image('ground-snow', 'assets/images/ground-snow.png');
    this.load.image('background-1', 'assets/images/bg-1.png');
    this.load.image('background-2', 'assets/images/bg-2.png');
    this.load.image('background-3', 'assets/images/bg-3.png');
  }

  create() {
    this.state.start('GameTitle');
  }
}
