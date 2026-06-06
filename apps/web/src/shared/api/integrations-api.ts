import { axiosWithToken } from './api-client';
import type {
  CreateIntegrationPayload,
  UpdateIntegrationPayload,
  WorkspaceIntegration,
} from '@/entities';

export const integrationsApi = {
  list(): Promise<WorkspaceIntegration[]> {
    return axiosWithToken.get('/notifications').then((r) => r.data);
  },

  create(payload: CreateIntegrationPayload): Promise<WorkspaceIntegration> {
    return axiosWithToken.post('/notifications', payload).then((r) => r.data);
  },

  update(id: string, payload: UpdateIntegrationPayload): Promise<WorkspaceIntegration> {
    return axiosWithToken.patch(`/notifications/${id}`, payload).then((r) => r.data);
  },

  delete(id: string): Promise<{ success: boolean }> {
    return axiosWithToken.delete(`/notifications/${id}`).then((r) => r.data);
  },

  getTelegramConnectLink(): Promise<{ url: string }> {
    return axiosWithToken.get('/notifications/telegram/connect-link').then((r) => r.data);
  },

  getSlackOAuthUrl(): Promise<{ url: string }> {
    return axiosWithToken.get('/notifications/slack/oauth-url').then((r) => r.data);
  },
};
