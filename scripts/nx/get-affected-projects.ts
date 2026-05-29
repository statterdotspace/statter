import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { isSupportedProjectType } from './is-supported-type';

const execAsync = promisify(exec);

export async function getAffectedProjects(
  projectType: string,
  base = 'origin/main'
): Promise<string> {
  if (!isSupportedProjectType(projectType)) {
    throw new Error(`Unsupported project type: ${projectType}`);
  }
  const { stdout } = await execAsync(`nx show projects --type=${projectType}`);
  return stdout;
}

export function formatAffectedProjects(projects: string): string {
  const formattedProjects = projects
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return JSON.stringify(formattedProjects);
}
