import type {
  AuthFlowResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
} from '@/entities';
import type { SuccessResponse } from './types';
import { ENV_CONFIG } from '../config/env.config';
import { apiClient } from './api-client';

const authApi = {
  async login(payload: LoginPayload): Promise<AuthFlowResponse> {
    const response = await apiClient.post<AuthFlowResponse>('/auth/login', payload);
    return response.data;
  },

  async verifyLogin(payload: VerifyOtpPayload): Promise<AuthFlowResponse> {
    const response = await apiClient.post<AuthFlowResponse>('/auth/login/verify', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthFlowResponse> {
    const response = await apiClient.post<AuthFlowResponse>('/auth/register', payload);
    return response.data;
  },

  async verifyRegister(payload: VerifyOtpPayload): Promise<AuthFlowResponse> {
    const response = await apiClient.post<AuthFlowResponse>('/auth/register/verify', payload);
    return response.data;
  },

  async logout(): Promise<SuccessResponse> {
    const response = await apiClient.post<SuccessResponse>('/auth/logout');
    return response.data;
  },

  getGoogleAuthUrl() {
    return ENV_CONFIG.GOOGLE_AUTH_URL;
  },

  getGithubAuthUrl() {
    return ENV_CONFIG.GITHUB_AUTH_URL;
  },
};

export { authApi };
