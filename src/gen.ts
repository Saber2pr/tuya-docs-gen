import { Command } from 'commander';

import { runGen } from './core/runGen';

export const init = async () => {
  const packageJson = require('../package.json');

  new Command('tuya-docs-gen')
    .version(packageJson.version)
    .description(packageJson.description)
    .argument('<path>', 'demo project path')
    .argument('<out-path>', 'out docs dir')
    .action((cwd, out) => runGen({ cwd, out: out }))
    .parse(process.argv)
}