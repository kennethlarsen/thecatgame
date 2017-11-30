import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Boot from './states/boot';
import Preload from './states/preload';
import GameTitle from './states/game-title';
import Main from './states/main';
import GameOver from './states/game-over';
import Intro from './states/intro';

class Game extends Phaser.Game {
  constructor() {
    super('100%', '100%', Phaser.CANVAS, 'content', null);

    this.state.add('Boot', Boot, false);
    this.state.add('Preload', Preload, false);
    this.state.add('GameTitle', GameTitle, false);
    this.state.add('Intro', Intro, false);
    this.state.add('Main', Main, false);
    this.state.add('GameOver', GameOver, false);

    // with Cordova with need to wait that the device is ready so we will call
    // the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot');
    }
  }
}

window.game = new Game();

if (window.cordova) {
  const app = {
    initialize() {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false,
      );
    },

    // deviceready Event Handler
    //
    onDeviceReady() {
      this.receivedEvent('deviceready');

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot');
    },

    receivedEvent(id) {
      console.log(`Received Event: ${id}`);
    },
  };

  app.initialize();
}
