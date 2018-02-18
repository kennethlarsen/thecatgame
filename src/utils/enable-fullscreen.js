import Phaser from 'phaser';

function toggleFullscreen(game) {
  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  } else {
    game.scale.startFullScreen();
  }
}

export default function enableFullscreen(game) {
  const fullScreenKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
  fullScreenKey.onUp.add(() => toggleFullscreen(game));
}
