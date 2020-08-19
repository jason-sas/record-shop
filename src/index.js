import yargs from 'yargs';
import {
  processDir,
  isWindowsDuplicateMP3,
  dumpToConsole,
  deleteFile,
} from './dedupe';

const videoConfig = {
  rules: [
    {
      id: 1,
      name: 'Prefix, Underscores and Plus Sign',
      matchFn: (filePath) => /^[0-9]+_[0-9]+_[0-9]+_*.mp4$/.test(filePath),
      actionFn: (filePath) => logRuleExecution(this, filePath),
    },
    {
      id: 2,
      name: 'Underscores only',
      matchFn: (filePath) => path.basename(filePath).split('_').length > 1,
      actionFn: (filePath) => logRuleExecution(this, filePath),
    },
  ],
  shouldRecurse: true,
  dryRun: false,
};

const { argv } = yargs
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
  .help();

console.log(argv);
console.info(`Using target directory ${argv._[0]}`);

let processingFn = () => processDir(isWindowsDuplicateMP3);

const { recurse } = argv;

// A dry run
if (argv.dedupe && argv.dryrun) {
  processingFn = processingFn(dumpToConsole);
} else if (argv.dedupe) {
  processingFn = processingFn(deleteFile);
}

const target = argv._[0];

const results = processingFn(recurse, target);

console.log(`${results.length} were found`);
