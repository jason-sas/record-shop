import chalk from 'chalk';
import { readdirSync, renameSync } from 'fs';
import S from 'sanctuary';
import { resolve } from 'path';

const {
  concat,
  filter,
  map,
  Just,
  Nothing,
} = S;

export function logRuleExecution(rule, filePath) {
  // eslint-disable-next-line no-console
  console.log(
    `${chalk.whiteBright.bgBlue(rule.name)}: ${chalk.green(filePath)}`,
  );
  return Just(filePath);
}

export function processRule(rule, filePath) {
  if (rule.matchFn(filePath)) {
    const retVal = rule.actionFn(filePath);
    if (!retVal.isNothing) renameSync(filePath, retVal.value);
    if (!retVal.isNothing) logRuleExecution(rule, filePath);
    return retVal;
  }
  return Nothing;
}

export function processDir(config, target) {
  const absolutePath = resolve(target);
  const dirEntries = readdirSync(absolutePath, { withFileTypes: true });
  const files = filter((file) => file.isFile(), dirEntries);
  const filePaths = map((file) => `${absolutePath}/${file.name}`, files);
  let filesOutput = [];

  filePaths.forEach((filePath) => {
    config.rules.forEach((rule) => {
      const ruleResult = processRule(rule, filePath);
      if (!ruleResult === Nothing) filesOutput.push(ruleResult);
    });
  });

  if (config.shouldRecurse) {
    const dirs = filter((dir) => dir.isDirectory(), dirEntries);
    const subDirFilesOutput = map(
      (dir) => processDir(config, `${target}/${dir.name}`),
      dirs,
    );
    filesOutput = concat(filesOutput, subDirFilesOutput);
  }

  return Just(filesOutput);
}

export function matchUnderscores(filePath) {
  return Just(filePath.split('_').length > 1);
}

export function removeUnderScores(filePath) {
  return Just(filePath.split('_').join(' '));
}

export const removeUnderscoresRule = {
  name: 'Remove Underscores Rule',
  matchFn: matchUnderscores,
  actionFn: removeUnderScores,
};
