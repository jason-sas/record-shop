import { describe, it, beforeEach } from '@jest/globals';
import wish from 'wish';

import fs from 'fs';
import S from 'sanctuary';
import { deleteFile, isWindowsDuplicateMP3, processDir } from './dedupe';

const { contains } = S;

const {
  existsSync, mkdirSync, writeFileSync, rmdirSync,
} = fs;

describe('Dedupe unit tests', () => {
  const directories = [
    'test',
    'test/dedupe_tests',
    'test/dedupe_tests/test_1',
    'test/dedupe_tests/test_2',
    'test/dedupe_tests/test_3',
    'test/dedupe_tests/test_2/subdirectory_1',
    'test/dedupe_tests/test_2/subdirectory_2',
    'test/dedupe_tests/test_3/subdirectory_1',
    'test/dedupe_tests/test_3/subdirectory_2',
  ];

  const files = ['a.mp3',
    'a (1).mp3', 'a (2).mp3', 'b.mp3'];

  beforeEach((done) => {
    if (existsSync('./test/dedupe_tests')) rmdirSync('./test/dedupe_tests', { recursive: true });

    const makeFiles = function _makeFiles(path) {
      files.forEach((file) => {
        writeFileSync(`${path}/${file}`, 'This is a test.');
      });
    };

    directories.forEach((directory) => {
      mkdirSync(directory, { recursive: true });
      makeFiles(directory);
    });

    done();
  });

  it('should be a Windows duplicate', (done) => {
    wish(isWindowsDuplicateMP3('/Users/Downloads/a (22).mp3'));
    done();
  });

  it('should delete a file', (done) => {
    deleteFile('test/dedupe_tests/test_1/a.mp3');
    wish(!existsSync('test/dedupe_tests/test_1/a.mp3'));
    done();
  });

  it('should process a directory with no subfolders correctly', async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      false,
      'test/test_1',
    );
    wish(!existsSync('test/dedupe_tests/test_1/a (1).mp3'));
    wish(!existsSync('test/dedupe_tests/test_1/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_1/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_1/b.mp3'));
    wish(processedFiles.contains('test/dedupe_tests/test_1/a (1).mp3'));
    done();
  });

  it('should process a directory containing subfolders recursively with flag', async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      true,
      '/mnt/c/',
    );
    wish(!existsSync('test/dedupe_tests/test_2/a (1).mp3'));
    wish(!existsSync('test/dedupe_tests/test_2/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_2/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_2/b.mp3'));
    wish(!existsSync('test/dedupe_tests/test_2/subdirectory_1/a (1).mp3'));
    wish(!existsSync('test/dedupe_tests/test_2/subdirectory_1/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_2/subdirectory_1/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_2/subdirectory_1/b.mp3'));
    wish(!existsSync('test/dedupe_tests/test_2/subdirectory_2/a (1).mp3'));
    wish(!existsSync('test/dedupe_tests/test_2/subdirectory_2/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_2/subdirectory_2/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_2/subdirectory_2/b.mp3'));
    done();
  });

  it('should process a directory containing subfolders non-recursively without the flag', async (done) => {
    const processedFiles = await processDir(
      isWindowsDuplicateMP3,
      deleteFile,
      false,
      'test/dedupe_tests/test_3',
    );
    wish(!existsSync('test/dedupe_tests/test_3/a (1).mp3'));
    wish(!existsSync('test/dedupe_tests/test_3/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_3/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_3/b.mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_1/a (1).mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_1/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_1/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_1/b.mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_2/a (1).mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_2/a (2).mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_2/a.mp3'));
    wish(existsSync('test/dedupe_tests/test_3/subdirectory_2/b.mp3'));
    done();
  });
});
