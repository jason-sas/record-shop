import { describe, it, beforeEach } from '@jest/globals';
import { resolve } from 'path';
import fs from 'fs';
import * as wish from 'wish';
// eslint-disable-next-line import/named
import { processRule, removeUnderscoresRule } from './rename';

const {
  existsSync, mkdirSync, writeFileSync, rmdirSync,
} = fs;

const directories = ['test', 'test/test_1', 'test/test_2', 'test/test_3'];

const files = [
  'control.mp4',
  '693casd1_1080_8000_foo+ifm_-_lorem+ipsum+foo.mp4',
  'lorem_ipsum_foo.mp4',
];

describe('Rename tests', () => {
  beforeEach((done) => {
    if (existsSync('test')) rmdirSync('test', { recursive: true });
    directories.forEach((directory) => {
      mkdirSync(resolve(directory), { recursive: true });
      files.forEach((file) => writeFileSync(resolve(`${directory}/${file}`), 'This is a test file'));
    });
    done();
  });

  it('should process rule 1 - Underscores and prefix', (done) => {
    const result = processRule(removeUnderscoresRule, 'test/test_1/lorem_ipsum_foo.mp4');
    wish(result === 'test/test_1/lorem_ipsum_foo.mp4');
    done();
  });

  it('should process rule 2 - Underscores only', (done) => {
    done();
  });
});
