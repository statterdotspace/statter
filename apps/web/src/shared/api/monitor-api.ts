import type {
  CreateMonitorPayload,
  Monitor,
  MonitorListQuery,
  UpdateMonitorPayload,
} from '@/entities';
import type { PaginatedResponse, SuccessResponse } from './types';
import { apiClient } from './api-client';
import { normalizePaginated } from './normalize-paginated';

const monitorApi = {
  async list(query: MonitorListQuery = {}): Promise<PaginatedResponse<Monitor>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const response = await apiClient.get<PaginatedResponse<Monitor> | Monitor[]>('/monitors', {
      params: query,
    });

    return normalizePaginated(response.data, page, perPage);
  },

  async getById(monitorId: string): Promise<Monitor> {
    const response = await apiClient.get<Monitor>(`/monitors/${monitorId}`);
    return response.data;
  },

  async create(payload: CreateMonitorPayload): Promise<Monitor> {
    const response = await apiClient.post<Monitor>('/monitors', payload);
    return response.data;
  },

  async update(monitorId: string, payload: UpdateMonitorPayload): Promise<Monitor> {
    const response = await apiClient.patch<Monitor>(`/monitors/${monitorId}`, payload);
    return response.data;
  },

  async remove(monitorId: string): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>(`/monitors/${monitorId}`);
    return response.data;
  },
};

export { monitorApi };
