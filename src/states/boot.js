import Phaser from 'phaser';
import WebFont from 'webfontloader';
import config from '../config';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = config.backgroundColor;
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload() {
    WebFont.load({
      google: {
        families: [config.font],
      },
      active: this.fontsLoaded,
    });

    const text = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'loading fonts…', {
        font: '16px Arial',
        fill: config.fontColor,
        align: 'center',
      },
    );

    text.anchor.setTo(0.5, 0.5);

    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
  }

  render() {
    if (this.fontsReady) {
      this.state.start('Preload');
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
}
