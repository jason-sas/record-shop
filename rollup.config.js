export default {
  entry: 'src/index.js',
  dest: 'dist/index.js',
  format: 'cjs',
  external: ['yargs', 'fs', 'sanctuary'],
};
