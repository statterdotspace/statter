import { readProjectConfiguration } from '@nx/devkit';
import chalk from 'chalk';
import { execSync } from 'node:child_process';
import { FsTree } from 'nx/src/generators/tree';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const getAffectedProjects = (projects: string[] = []) => {
  if (projects.length) {
    return projects;
  }
  const affectedLibs = execSync(`npx nx show projects --affected --type=lib`, {
    encoding: 'utf8',
  }).toString();
  const affectedApps = execSync(`npx nx show projects --affected --type=app`, {
    encoding: 'utf8',
  }).toString();

  const splitProjects = (raw: string): string[] => {
    if (!raw) return [];
    return raw
      .split(/[,\n\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  console.log(
    chalk.bgCyan('ALL AFFECTED PROJECTS:'),
    chalk.green(...splitProjects(affectedLibs), ...splitProjects(affectedApps))
  );

  return [...splitProjects(affectedLibs), ...splitProjects(affectedApps)];
};

const exec = (cmd: () => void, type: 'eslint' | 'stylelint') => {
  try {
    cmd();
  } catch {
    throw new Error(`${type} failed, see details in the jobs output`);
  }
};

const getTargetIncludePath = (host: FsTree, projectName: string, target: 'lint'): string[] => {
  const cfg = readProjectConfiguration(host, projectName);
  const lintTarget = cfg.targets?.[target];

  if (!lintTarget || !cfg.root) return [];

  const filePattern = [cfg.root];

  return filePattern.map((path) => `"${path}"`);
};

const getTargetPaths = (host: FsTree, projectNames: string[], target: 'lint'): string => {
  return projectNames
    .flatMap((projectName) => getTargetIncludePath(host, projectName, target))
    .join(' ');
};

const fastLint = ({
  projects,
  verbose = false,
}: {
  projects: string[];
  verbose?: boolean;
}): void => {
  const affectedProjects = getAffectedProjects(projects);
  if (affectedProjects.length === 0) {
    return;
  }
  const host = new FsTree(process.cwd(), verbose);
  const lintProjects = getTargetPaths(host, affectedProjects, 'lint');

  if (verbose) {
    process.env.TIMING = '1';
  }
  if (lintProjects.length) {
    const command = verbose
      ? `npx eslint ${lintProjects} --no-error-on-unmatched-pattern`
      : `npx eslint ${lintProjects} --quiet --no-error-on-unmatched-pattern`;
    exec(() => execSync(command, { stdio: 'inherit' }), 'eslint');
  }
};

(async function () {
  const argv = (await yargs(hideBin(process.argv))
    .usage('Usage: $0 -p [projects]')
    .option('projects', {
      description: 'comma-separated list of projects to lint',
      alias: 'p',
      type: 'string',
      default: '',
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging, prints timings',
    })
    .coerce('projects', (value: string) =>
      typeof value === 'string' && value.length
        ? value
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : []
    ).argv) as unknown as { projects: string[]; verbose?: boolean };

  try {
    fastLint({ projects: argv.projects, verbose: argv.verbose });
    process.exit(0);
  } catch (error: unknown) {
    const err = error as { message?: string } | undefined;
    console.error(err && err.message ? err.message : error);
    process.exit(1);
  }
})();
