import {existsSync, unlinkSync, readdirSync} from "fs";
import S from "sanctuary";

const {concat, filter, map, empty} = S;

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

function processDir(matchFn = () => true, actionFn = input => input, shouldRecurse = false, target = empty(String)) {

    if (target === empty(String) || !existsSync(target))
        throw new Error("Target directory was either not provided or does not exist");

    const dirEntries = readdirSync(target, {withFileTypes: true});
    const files = filter(file => file.isFile() && matchFn(`${target}/${file.name}`), dirEntries);
    const paths = map((file) => `${target}/${file.name}`, files);

    let filesOutput = map(actionFn, paths);

    if (shouldRecurse) {
        const dirs = filter((dir) => dir.isDirectory(), dirEntries);
        const subDirectoryOutput = map(
            async (dir) =>
                processDir(matchFn, actionFn, shouldRecurse, `${target}/${dir.name}`),
            dirs
        );
        filesOutput = concat(filesOutput, subDirectoryOutput);
    }

    return filesOutput;
}

export {processDir, isWindowsDuplicateMP3, dumpToConsole, deleteFile};
