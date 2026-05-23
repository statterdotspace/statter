import axios from 'axios';
import { ENV_CONFIG } from '../config/env.config';

interface ServerClientOptions {
  cookieHeader?: string;
  workspaceId?: string;
}

const createServerApiClient = ({ cookieHeader, workspaceId }: ServerClientOptions = {}) => {
  const headers: Record<string, string> = {};

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  if (workspaceId) {
    headers['x-workspace-id'] = workspaceId;
  }

  return axios.create({
    baseURL: ENV_CONFIG.API_URL,
    headers,
    withCredentials: true,
  });
};

export { createServerApiClient };
