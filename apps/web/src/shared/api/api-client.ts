import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { ENV_CONFIG } from '../config/env.config';
import { WORKSPACE_COOKIE_NAME } from '../config/cookie.config';

interface ApiAuthConfig {
  onUnauthorized: () => void;
}

const defaultAuthConfig: ApiAuthConfig = {
  onUnauthorized: () => undefined,
};

let authConfig = defaultAuthConfig;
let workspaceIdRef: string | null = null;

const apiClient = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  withCredentials: true,
});

const apiDefault = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  withCredentials: true,
});

const isAuthRequest = (url?: string) => url?.startsWith('/auth/') ?? false;

const readWorkspaceIdFromCookie = (): string | null => {
  if (typeof document === 'undefined') {
    return workspaceIdRef;
  }

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${WORKSPACE_COOKIE_NAME}=`));

  return cookie ? decodeURIComponent(cookie.split('=')[1] ?? '') : workspaceIdRef;
};

const resolveWorkspaceId = () => {
  return readWorkspaceIdFromCookie() || workspaceIdRef;
};

const shouldSkipWorkspaceHeader = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return url.startsWith('/auth/') || url === '/workspaces' || url.startsWith('/health');
};

const withWorkspaceHeader = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (shouldSkipWorkspaceHeader(config.url) || config.headers?.['x-workspace-id']) {
    return config;
  }

  const workspaceId = resolveWorkspaceId();
  if (workspaceId) {
    config.headers.set('x-workspace-id', workspaceId);
  }

  return config;
};

apiClient.interceptors.request.use(withWorkspaceHeader);
apiDefault.interceptors.request.use(withWorkspaceHeader);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isAuthRequest(error.config?.url)) {
      authConfig.onUnauthorized();
    }

    return Promise.reject(error);
  }
);

const configureApiAuth = (config: ApiAuthConfig): void => {
  authConfig = config;
};

const setWorkspaceId = (workspaceId: string | null): void => {
  workspaceIdRef = workspaceId;
};

export { apiClient, apiDefault, configureApiAuth, setWorkspaceId };
