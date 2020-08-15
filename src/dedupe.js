import fs from "fs";
import { existsSync, unlinkSync, readdirSync } from "fs";
import { curry, filter, map, concat } from "ramda";

function isWindowsDuplicateMP3(filePath) {
  return /\([0-9]*\).mp3$/.test(filePath);
}

function dumpToConsole(filePath) {
  return filePath;
}

function deleteFile(filePath) {
  unlinkSync(filePath);
  return filePath;
}

function processDir(matchFn, actionFn, shouldRecurse, target) {
  const dirEnts = readdirSync(target, { withFileTypes: true });
  const files = filter(
    (file) => file.isFile() && matchFn(`${target}/${file.name}`),
    dirEnts
  );
  const paths = map((file) => `${target}/${file.name}`, files);

  let filesOutput = map(actionFn, paths);

  if (shouldRecurse) {
    const dirs = filter((dir) => dir.isDirectory(), dirEnts);
    const subdirFilesOutput = map(
      async (dir) =>
        processDir(matchFn, actionFn, shouldRecurse, `${target}/${dir.name}`),
      dirs
    );
    filesOutput = concat(filesOutput, subdirFilesOutput);
  }

  return filesOutput;
}

export { processDir, isWindowsDuplicateMP3, dumpToConsole, deleteFile };
