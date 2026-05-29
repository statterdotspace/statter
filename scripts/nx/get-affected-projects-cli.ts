import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { formatAffectedProjects, getAffectedProjects } from './get-affected-projects';

(async function () {
  const argv = await yargs(hideBin(process.argv))
    .option('type', {
      type: 'string',
      description: 'Project type (app, lib, e2e)',
      demandOption: true,
    })
    .option('base', {
      type: 'string',
      description: 'Base branch or commit',
      default: 'main',
    })
    .parseAsync();

  try {
    const affectedProjects = await getAffectedProjects(argv.type, argv.base);
    console.log(formatAffectedProjects(affectedProjects));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
