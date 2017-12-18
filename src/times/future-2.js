import Snow from '../objects/weather/snow';

export default {
  background: {
    front: {
      asset: 'background-1',
      offset: -50,
    },
    mid: {
      asset: 'background-2',
      offset: 125,
    },
    back: {
      asset: 'background-3',
      offset: 300,
    },
  },
  ground: {
    asset: 'ground-snow',
  },
  obstacles: {
    frames: [0, 1],
  },
  weather: [
    {
      class: Snow,
      config: {
        sounds: [
          {
            key: 'wind-houling',
            level: 0.3,
          },
        ],
      },
    },
  ],
  mice: {
    asset: 'mouse-white',
  },
};
