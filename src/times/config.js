import past1 from './past-1';
import present from './present';
import future1 from './future-1';

const year = (new Date()).getFullYear();

export default {
  past1: {
    year: year - 50,
    config: past1,
    next: 'present',
  },
  present: {
    year,
    config: present,
    previous: 'past1',
    next: 'future1',
  },
  future1: {
    year: year + 50,
    config: future1,
    previous: 'present',
  },
};
