import past3 from './past-3';
import past2 from './past-2';
import past1 from './past-1';
import present from './present';
import future1 from './future-1';
import future2 from './future-2';

const year = (new Date()).getFullYear();

export default {
  past3: {
    year: year - 150,
    config: past3,
    next: 'past2',
  },
  past2: {
    year: year - 100,
    config: past2,
    next: 'past1',
    previous: 'past3',
  },
  past1: {
    year: year - 50,
    config: past1,
    next: 'present',
    previous: 'past2',
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
