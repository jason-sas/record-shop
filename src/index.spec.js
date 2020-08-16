import wish from 'wish';
import { describe, it } from '@jest/globals';

describe('Sample unit tests', () => {
  it('should be true', (done) => {
    wish(true);
    done();
  });
});
