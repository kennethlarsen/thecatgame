import config from '../config';

// Returns the relative scale factor of the current game height to the
// configured reference game height (see config.height).
export default function scaleFactor(game) {
  return (game.world.height / config.referenceHeight).toFixed(2);
}
