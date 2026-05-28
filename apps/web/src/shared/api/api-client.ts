import axios, { InternalAxiosRequestConfig } from 'axios';
import { ENV_CONFIG, WORKSPACE_COOKIE_NAME } from '@/shared/config';

const getCookieValue = (cookieString: string, name: string): string | undefined => {
  const match = cookieString.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

const axiosWithToken = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  withCredentials: true,
});

const axiosDefault = axios.create({
  baseURL: ENV_CONFIG.API_URL,
  withCredentials: true,
});

axiosWithToken.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (typeof window === 'undefined') {
    const { cookies, headers } = await import('next/headers');

    const cookieHeader = (await headers()).get('cookie');
    const workspaceId = (await cookies()).get(WORKSPACE_COOKIE_NAME)?.value;

    if (cookieHeader) {
      config.headers.set('Cookie', cookieHeader);
    }

    if (workspaceId) {
      config.headers.set('x-workspace-id', workspaceId);
    }
  } else {
    const workspaceId = getCookieValue(document.cookie, WORKSPACE_COOKIE_NAME);

    if (workspaceId) {
      config.headers.set('x-workspace-id', workspaceId);
    }
  }

  return config;
});

export { axiosWithToken, axiosDefault, axiosWithToken as apiClient, axiosDefault as apiDefault };
