import { createPackageJson } from '@nx/js';
import fs from 'node:fs';
import rootPackageJson from '../../package.json';
import { getProjectGraph } from './get-project-graph';

function sortDependencies(dependencies: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(dependencies).sort());
}

export async function getPackageJson(
  projectName: string,
  root: string,
  skipDevDeps?: boolean,
  skipPeerDeps?: boolean,
  isProduction?: boolean,
  implicitDeps?: string[]
) {
  const graph = await getProjectGraph();
  const { type } = graph.nodes[projectName];
  if (type !== 'app') {
    throw new Error(
      `Project ${projectName} is not an application. Only applications can be packaged.`
    );
  }

  const packageJson = createPackageJson(projectName, graph, {
    root,
    isProduction,
    target: 'build',
  });

  packageJson.main = packageJson.main || 'main.js';
  packageJson.version = rootPackageJson.version;

  const allDeps = rootPackageJson.dependencies as Record<string, string>;
  const allDevDeps = rootPackageJson.devDependencies as Record<string, string>;

  for (const dep of implicitDeps ?? []) {
    packageJson.dependencies ??= {};
    packageJson.dependencies[dep] = allDeps[dep] || allDevDeps[dep];
  }

  packageJson.dependencies = sortDependencies(packageJson.dependencies ?? {});

  if (skipDevDeps || isProduction) {
    delete packageJson.devDependencies;
  } else {
    packageJson.devDependencies = sortDependencies(packageJson.devDependencies ?? {});
  }
  if (skipPeerDeps || isProduction) {
    delete packageJson.peerDependencies;
  } else {
    packageJson.peerDependencies = sortDependencies(packageJson.peerDependencies ?? {});
  }
  return packageJson;
}

export function outputPackageJson(
  {
    output = 'stdout',
    outputPath = process.cwd(),
  }: { output?: 'stdout' | 'file'; outputPath?: string },
  packageJson = {}
): void {
  const serializedPackageJson = JSON.stringify(packageJson, null, 2);
  if (output === 'stdout') {
    console.log(serializedPackageJson);
  } else if (output === 'file') {
    fs.writeFileSync(`${outputPath}/package.json`, `${serializedPackageJson}\n`);
  }
}
