import chalk from "chalk";
import {readdirSync} from "fs";
import S from "sanctuary";

const { concat, filter, map } = S;

const None = Object.freeze({});

function logRuleExecution(rule, filePath) {
    console.log(chalk.whiteBright.bgBlue(rule.name) + `: ${filePath}`);
    return filePath;
}

const pornConfig = {
    rules: [
        {
            id: 1,
            name: "Prefix, Underscores and Plus Sign",
            matchFn: filePath => /^[0-9]+_[0-9]+_[0-9]+_*.mp4$/.test(path),
            actionFn: filePath => logRuleExecution(this, filePath),
        },
        {
            id: 2,
            name: "Underscores only",
            matchFn: filePath => path.basename(filePath).split("_").length > 1,
            actionFn: filePath => logRuleExecution(this, filePath),
        }
    ],
    shouldRecurse: true,
    dryRun: false,
}

function processRule(rule, filePath) {
    if (rule.matchFn(filePath)) {
        const retVal = rule.actionFn(filePath);
        logRuleExecution(rule, filePath);
    } else {
        return None;
    }
}


function processDir(config, target) {
    const dirEntries = readdirSync(target, {withFileTypes: true});
    const files = filter(file => file.isFile(), dirEntries);
    const filePaths = map((file) => `${target}/${file.name}`, files);
    let filesOutput = [];
    for (const filePath in filePaths) {

        for (const rule in config.rules) {
            const ruleResult = processRule(rule, filePath);
            if (ruleResult !== None) filesOutput.push(ruleResult);
        }

    }

    if (config.shouldRecurse) {
        const dirs = filter((dir) => dir.isDirectory(), dirEntries);
        const subDirFilesOutput = map((dir) => processDir(config, `${target}/${dir.name}`), dirs);
        filesOutput = concat(filesOutput, subDirFilesOutput);
    }

    return filesOutput;

}


export {processDir}