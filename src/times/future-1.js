import Rain from '../objects/weather/rain';

export default {
  background: {
    front: {
      asset: 'background-10',
      offset: 15,
    },
    mid: {
      asset: 'background-11',
      offset: 215,
    },
    back: {
      asset: 'background-12',
      offset: 340,
    },
  },
  ground: {
    asset: 'ground-stone',
  },
  obstacles: {
    frames: [2, 3],
  },
  weather: [
    {
      class: Rain,
      config: {
        sounds: [
          {
            key: 'rain',
            level: 1,
          },
        ],
      },
    },
  ],
  mice: {
    asset: 'mouse-gray',
  },
};
