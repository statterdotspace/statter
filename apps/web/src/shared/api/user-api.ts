import type {
  ConfirmPasswordChangePayload,
  ToggleTwoFactorPayload,
  UpdateAvatarPayload,
  UpdateProfilePayload,
  User,
} from '@/entities';
import type { SuccessResponse, UploadUrlPayload, UploadUrlResponse } from './types';
import { apiClient } from './api-client';

const userApi = {
  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.patch<User>('/users/me/profile', payload);
    return response.data;
  },

  async requestPasswordChange(): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>('/users/me/password/request');
    return response.data;
  },

  async confirmPasswordChange(payload: ConfirmPasswordChangePayload): Promise<User> {
    const response = await apiClient.patch<User>('/users/me/password', payload);
    return response.data;
  },

  async toggleTwoFactor(payload: ToggleTwoFactorPayload): Promise<User> {
    const response = await apiClient.patch<User>('/users/me/two-factor', payload);
    return response.data;
  },

  async deleteAccount(): Promise<SuccessResponse> {
    const response = await apiClient.delete<SuccessResponse>('/users/me');
    return response.data;
  },

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
