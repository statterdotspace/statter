import type { Monitor, MonitorListQuery, Project, ProjectListQuery, Workspace } from '@/entities';
import { createServerApiClient } from './server-client';
import { normalizePaginated } from './normalize-paginated';
import type { PaginatedResponse } from './types';

interface ServerScopedOptions {
  cookieHeader?: string;
  workspaceId: string;
}

interface ListProjectsOptions extends ServerScopedOptions {
  query?: ProjectListQuery;
}

interface ListMonitorsOptions extends ServerScopedOptions {
  query?: MonitorListQuery;
}

interface GetProjectBySlugOptions extends ServerScopedOptions {
  projectSlug: string;
}

const serverApi = {
  async listWorkspaces(cookieHeader?: string): Promise<Workspace[]> {
    const client = createServerApiClient({ cookieHeader });
    const response = await client.get<Workspace[]>('/workspaces');
    return response.data;
  },

  async getWorkspaceBySlug(workspaceSlug: string, cookieHeader?: string): Promise<Workspace | null> {
    const workspaces = await serverApi.listWorkspaces(cookieHeader);
    return workspaces.find((workspace) => workspace.slug === workspaceSlug) ?? null;
  },

  async listProjects({
    cookieHeader,
    workspaceId,
    query = {},
  }: ListProjectsOptions): Promise<PaginatedResponse<Project>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const client = createServerApiClient({ cookieHeader, workspaceId });
    const response = await client.get<PaginatedResponse<Project> | Project[]>('/projects', {
      params: query,
    });

    return normalizePaginated(response.data, page, perPage);
  },

  async getProjectBySlug({
    cookieHeader,
    workspaceId,
    projectSlug,
  }: GetProjectBySlugOptions): Promise<Project> {
    const client = createServerApiClient({ cookieHeader, workspaceId });
    const response = await client.get<Project>(`/projects/slug/${projectSlug}`);
    return response.data;
  },

  async listMonitors({
    cookieHeader,
    workspaceId,
    query = {},
  }: ListMonitorsOptions): Promise<PaginatedResponse<Monitor>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const client = createServerApiClient({ cookieHeader, workspaceId });
    const response = await client.get<PaginatedResponse<Monitor> | Monitor[]>('/monitors', {
      params: query,
    });

    return normalizePaginated(response.data, page, perPage);
  },
};

export { serverApi };
