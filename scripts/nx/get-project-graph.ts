import { ProjectGraph, ProjectGraphProjectNode } from 'nx/src/config/project-graph';
import { filterNodes } from 'nx/src/project-graph/operators';
import { createProjectGraphAsync } from 'nx/src/project-graph/project-graph';

function projectExists(projects: ProjectGraphProjectNode[], projectToFind: string): boolean {
  return projects.some((project) => project.name === projectToFind);
}

function hasPath(graph: ProjectGraph, start: string, target: string): boolean {
  if (start === target) return true;
  const stack = [start];
  const visited = new Set<string>([start]);

  while (stack.length > 0) {
    const node = stack.pop() as string;
    const deps = graph.dependencies[node] || [];
    for (const d of deps) {
      if (d.target === target) return true;
      if (!visited.has(d.target)) {
        visited.add(d.target);
        stack.push(d.target);
      }
    }
  }
  return false;
}

function filterGraph(
  graph: ProjectGraph,
  focus: string,
  exclude: string[] = [],
  skipExternal = false
): ProjectGraph {
  const allProjectNames = Object.values(graph.nodes).map((p) => p.name);

  const included = new Set<string>();

  if (focus) {
    for (const p of allProjectNames) {
      // include if there is a path either direction between p and focus
      if (hasPath(graph, p, focus) || hasPath(graph, focus, p)) {
        included.add(p);
      }
    }
  } else {
    for (const p of allProjectNames) included.add(p);
  }

  for (const ex of exclude) included.delete(ex);

  const reduced: ProjectGraph = { nodes: {}, externalNodes: {}, dependencies: {} };
  for (const name of included) {
    if (graph.nodes[name]) reduced.nodes[name] = graph.nodes[name];
    if (graph.dependencies[name]) reduced.dependencies[name] = graph.dependencies[name];
  }

  if (!skipExternal) {
    reduced.externalNodes = graph.externalNodes;
  }

  return reduced;
}

export async function getProjectGraph(
  exclude: string[] = [],
  focus = '',
  skipExternal = false
): Promise<ProjectGraph> {
  let graph = await createProjectGraphAsync();
  if (skipExternal) {
    graph = filterNodes()(graph);
  }

  const projects = Object.values(graph.nodes).sort((a, b) => a.name.localeCompare(b.name));
  if (focus && !projectExists(projects, focus)) {
    throw new Error(`Project '${focus}' does not exist.`);
  }

  if (focus || exclude.length) {
    graph = filterGraph(graph, focus, exclude, skipExternal);
  }

  return graph;
}
