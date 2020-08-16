import {
  processDir,
  isWindowsDuplicateMP3,
  dumpToConsole,
  deleteFile,
} from './dedupe';
import yargs from 'yargs';

const argv = yargs
  .command('dedupe <target>', true)
  .option('d', {
    alias: 'dryrun',
    demandOption: false,
    describe: 'Outputs files to be deleted in console.  No files are deleted.',
    type: 'boolean',
    default: false,
  })
  .option('r', {
    alias: 'recurse',
    demandOption: false,
    describe: 'Recurse through subdirectories and process files.',
    type: 'boolean',
    default: false,
  })
  .help().argv;

console.log(argv);
console.info(`Using target directory ${argv._[0]}`);

let processingFn = () => processDir(isWindowsDuplicateMP3);

const recurse = argv.recurse;

// A dry run
if (argv.dedupe && argv.dryrun) {
  processingFn = processingFn(dumpToConsole);
} else if (argv.dedupe) {
  processingFn = processingFn(deleteFile);
}

const target = argv._[0];

const results = processingFn(recurse, target);

console.log(`${results.length} were found`);
