import past1 from './past-1';
import present from './present';
import future1 from './future-1';
import future2 from './future-2';

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
    next: 'future2',
  },
  future2: {
    year: year + 100,
    config: future2,
    previous: 'future1',
  },
};
