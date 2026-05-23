import type { UpdateAvatarPayload, User } from '@/entities';
import type { UploadUrlPayload, UploadUrlResponse } from './types';
import { apiClient } from './api-client';

const userApi = {
  async generateAvatarUploadUrl(payload: UploadUrlPayload): Promise<UploadUrlResponse> {
    const response = await apiClient.post<UploadUrlResponse>('/users/me/avatar/upload-url', payload);
    return response.data;
  },

  async updateAvatar(payload: UpdateAvatarPayload): Promise<User> {
    const response = await apiClient.patch<User>('/users/me/avatar', payload);
    return response.data;
  },
};

export { userApi };
