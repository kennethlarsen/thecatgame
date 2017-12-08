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
    this.load.spritesheet('obstacles', 'assets/images/obstacles.png', 100, 100);

    this.load.image('ground-snow', 'assets/images/ground-snow.png');
    this.load.image('ground-grass', 'assets/images/ground-grass.png');
    this.load.image('ground-earth', 'assets/images/ground-earth.png');
    this.load.image('ground-sand', 'assets/images/ground-sand.png');
    this.load.image('ground-stone', 'assets/images/ground-stone.png');

    this.load.image('background-1', 'assets/images/bg-1.png');
    this.load.image('background-2', 'assets/images/bg-2.png');
    this.load.image('background-3', 'assets/images/bg-3.png');
    this.load.image('background-4', 'assets/images/bg-4.png');
    this.load.image('background-5', 'assets/images/bg-5.png');
    this.load.image('background-6', 'assets/images/bg-6.png');
    this.load.image('background-7', 'assets/images/bg-7.png');
    this.load.image('background-8', 'assets/images/bg-8.png');
    this.load.image('background-9', 'assets/images/bg-9.png');
    this.load.image('background-10', 'assets/images/bg-10.png');
    this.load.image('background-11', 'assets/images/bg-11.png');
    this.load.image('background-12', 'assets/images/bg-12.png');

    this.load.audio('furry-cat', 'assets/sounds/furry_cat.mp3');
    this.load.audio('meow', 'assets/sounds/cat.wav');
  }

  create() {
    this.state.start('GameTitle');
  }
}
