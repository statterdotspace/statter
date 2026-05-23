import type {
  CreateProjectPayload,
  Project,
  ProjectListQuery,
  UpdateProjectPayload,
} from '@/entities';
import type { PaginatedResponse, SuccessResponse } from './types';
import { apiClient } from './api-client';
import { normalizePaginated } from './normalize-paginated';

const projectApi = {
  async list(query: ProjectListQuery = {}): Promise<PaginatedResponse<Project>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const response = await apiClient.get<PaginatedResponse<Project> | Project[]>('/projects', {
      params: query,
    });

    return normalizePaginated(response.data, page, perPage);
  },

  async getById(projectId: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${projectId}`);
    return response.data;
  },

  async getBySlug(projectSlug: string): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/slug/${projectSlug}`);
    return response.data;
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', payload);
    return response.data;
  },

  async update(projectId: string, payload: UpdateProjectPayload): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${projectId}`, payload);
    return response.data;
  },

  async remove(projectId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(`/projects/${projectId}`);
    return response.data;
  },
};

export { projectApi };
