import type {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
  Workspace,
} from '@/entities';
import type { SuccessResponse, UploadUrlPayload, UploadUrlResponse } from './types';
import { apiClient } from './api-client';

const workspaceApi = {
  async list(): Promise<Workspace[]> {
    const response = await apiClient.get<Workspace[]>('/workspaces');
    return response.data;
  },

  async getCurrent(): Promise<Workspace> {
    const response = await apiClient.get<Workspace>('/workspaces/current');
    return response.data;
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.post<Workspace>('/workspaces', payload);
    return response.data;
  },

  async updateCurrent(payload: UpdateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.patch<Workspace>('/workspaces/current', payload);
    return response.data;
  },

  async deleteCurrent(): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>('/workspaces/current');
    return response.data;
  },

  async generateLogoUploadUrl(payload: UploadUrlPayload): Promise<UploadUrlResponse> {
    const response = await apiClient.post<UploadUrlResponse>(
      '/workspaces/current/logo/upload-url',
      payload
    );
    return response.data;
  },
};

export { workspaceApi };
