import {readdirSync} from "fs";
import {concat, filter, map} from "ramda";

const pornConfig = {
    rules: [
        {
            matchFn: path => /^[0-9]+_[0-9]+_[0-9]+_/.test(path),
            actionFn: (path) => {
                console.log(path);
            },
        }
    ],
    shouldRecurse: true,
    dryRun: false,
}

function processRule(rule, target){
    if(rule.matchFn(target)) {
        return rule.actionFn(target);
    } else {
        return undefined;
    }
}


function processDir(config, target){
    const dirEntries = readdirSync(target, { withFileTypes: true });
    const files = filter(file => file.isFile(), dirEntries);
    const paths = map((file) => `${target}/${file.name}`, files);
    let filesOutput = [];
    for(const path in paths){
        for(const rule in config.rules){
            const ruleResult = processRule(rule,path);
            if(ruleResult) filesOutput.push(ruleResult);
        }
    }

    if (config.shouldRecurse) {
        const dirs = filter((dir) => dir.isDirectory(), dirEntries);
        const subDirFilesOutput = map(
            async (dir) =>
                processDir(config, `${target}/${dir.name}`),
            dirs
        );
        filesOutput = concat(filesOutput, subDirFilesOutput);
    }

    return filesOutput;

}


export { processDir }