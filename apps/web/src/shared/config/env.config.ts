const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:4000/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
const GOOGLE_AUTH_URL = `${API_URL}/auth/google`;
const GITHUB_AUTH_URL = `${API_URL}/auth/github`;

export const ENV_CONFIG = {
  API_URL,
  API_ORIGIN,
  GOOGLE_AUTH_URL,
  GITHUB_AUTH_URL,
};
