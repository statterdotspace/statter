import type { Check, CheckHistoryQuery, CheckListQuery } from '@/entities';
import type { PaginatedResponse } from './types';
import { apiClient } from './api-client';

const checkApi = {
  async list(monitorId: string, query: CheckListQuery = {}): Promise<PaginatedResponse<Check>> {
    const response = await apiClient.get<PaginatedResponse<Check>>(
      `/monitors/${monitorId}/checks`,
      {
        params: query,
      }
    );

    return response.data;
  },

  async latest(monitorId: string): Promise<Check | null> {
    const response = await apiClient.get<Check | null>(`/monitors/${monitorId}/checks/latest`);
    return response.data;
  },

  async history(monitorId: string, query: CheckHistoryQuery = {}): Promise<Check[]> {
    const response = await apiClient.get<Check[]>(`/monitors/${monitorId}/checks/history`, {
      params: query,
    });

    return response.data;
  },
};

export { checkApi };
