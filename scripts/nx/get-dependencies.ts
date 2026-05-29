import * as glob from 'glob';
import { minimatch } from 'minimatch';
import { ProjectGraphProjectNode } from 'nx/src/devkit-exports';
import { getProjectGraph } from './get-project-graph';
import { isSupportedProjectType } from './is-supported-type';

export async function getProjects(projectType = 'app'): Promise<string[]> {
  if (!isSupportedProjectType(projectType)) {
    throw new Error(`Unsupported project type: ${projectType}`);
  }

  const graph = await getProjectGraph();

  return Object.values(graph.nodes)
    .map((p) => p.name)
    .filter((name) => graph.nodes[name].type === projectType)
    .sort();
}

export async function getProjectDependenciesFiles({
  context,
  exclude = [],
  include = ['**/*.ts'],
  projectName,
}: {
  context: string;
  exclude?: string[];
  include?: string[];
  projectName: string;
}): Promise<string[]> {
  const graph = await getProjectGraph(exclude, projectName);

  if (!(projectName in graph.dependencies)) {
    throw new Error(`${projectName} not found in dependencies graph`);
  }

  const visited = new Set<string>();

  const collectDependencies = (target: string): string[] => {
    if (visited.has(target)) return [];
    visited.add(target);

    const deps = graph.dependencies[target] ?? [];
    const internalDeps = deps.map((d) => d.target);

    return [target, ...internalDeps.flatMap(collectDependencies)];
  };

  const allTargets = Array.from(new Set(collectDependencies(projectName)));

  const getNode = (target: string): ProjectGraphProjectNode | undefined => graph.nodes[target];

  const getFilesFromNode = (node?: ProjectGraphProjectNode): string[] => {
    if (!node?.data?.sourceRoot) return [];
    const { sourceRoot } = node.data;
    const files = glob.sync(`${sourceRoot}/**/*.ts`, {});
    return files.filter(
      (file) =>
        !exclude.some((val) => minimatch(file, val, { matchBase: true })) &&
        include.some((val) => minimatch(file, val, { matchBase: true }))
    );
  };

  const dependenciesFiles = allTargets.flatMap((target) => {
    const node = getNode(target);
    if (!node) return []; // 🔹 пропускаємо невідомі ноди (наприклад npm)
    return getFilesFromNode(node);
  });

  return context === '.'
    ? dependenciesFiles
    : dependenciesFiles.map((file) => file.replace(context, ''));
}
