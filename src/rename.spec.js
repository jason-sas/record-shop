import { describe, it, beforeEach } from '@jest/globals';
import { resolve } from 'path';
import fs from 'fs';
import * as wish from 'wish';
// eslint-disable-next-line import/named
import { processRule, removeUnderscoresRule } from './rename';

const {
  existsSync, mkdirSync, writeFileSync, rmdirSync,
} = fs;

const directories = ['test', 'test/rename_tests', 'test/rename_tests/test_1', 'test/rename_tests/test_2', 'test/rename_tests/test_3'];

const files = [
  'control.mp4',
  '693casd1_1080_8000_foo+ifm_-_lorem+ipsum+foo.mp4',
  'lorem_ipsum_foo.mp4',
];

beforeEach(() => {
  if (existsSync('test/rename_tests')) rmdirSync('test/rename_tests', { recursive: true });
  directories.forEach((directory) => {
    try {
      mkdirSync(resolve(directory), { recursive: true });
      console.info(`Created directory ${directory}`);
    } catch (e) {
      console.error(e.message);
      throw e;
    }
    files.forEach((file) => {
      try {
        writeFileSync(resolve(`${directory}/${file}`), 'This is a test file');
        console.info(`Created file ${directory}/${file}`);
      } catch (e) {
        console.error(e.message);
        throw e;
      }
    });
  });
});

describe('Rename tests', () => {
  it('should process rule 1 - Underscores and prefix', (done) => {
    const result = processRule(removeUnderscoresRule, 'test/rename_tests/test_1/lorem_ipsum_foo.mp4');
    wish(result === 'test/rename_tests/test_1/lorem_ipsum_foo.mp4');
    done();
  });

  it('should process rule 2 - Underscores only', (done) => {
    done();
  });
});
