import fs from 'fs';
import { existsSync } from 'fs';
import { curry, filter, map, concat } from 'ramda'; 
const { readdir, unlink } = fs.promises;

function isWindowsDuplicateMP3(filePath) {
    return /\([0-9]*\).mp3$/.test(filePath);
}

function dumpToConsole(filePath) {
    console.info(filePath + "\n");
    return filePath;
}

function deleteFile(filePath) {
    unlink(filePath);
    return filePath;
}


async function _processDir(matchFn, actionFn, shouldRecurse, target){
    if(!existsSync(target)) throw new Error("Target directory does not exist.");
    const dirEnts = await readdir(target, { withFileTypes });
    const files = filter(file => file.isFile && matchFn(file), dirEnts);
    
    let filesOutput = map(actionFn, files);

    if(shouldRecurse){
        const dirs = filter(dir => dir.isDirectory, dirEnts);
        const subdirFilesOutput = map(async dir => await _processDir(matchFn, actionFn, shouldRecurse, dir.path));
        filesOutput = concat(filesOutput, subdirFilesOutput);
    }

    return filesOutput;
    
}

const procesDir = curry(_processDir);

export { procesDir, isWindowsDuplicateMP3, dumpToConsole, deleteFile };