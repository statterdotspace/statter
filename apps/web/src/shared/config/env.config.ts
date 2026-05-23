const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:4000/api';
const GOOGLE_AUTH_URL = `${API_URL}/auth/google`;
const GITHUB_AUTH_URL = `${API_URL}/auth/github`;

export const ENV_CONFIG = {
  API_URL,
  GOOGLE_AUTH_URL,
  GITHUB_AUTH_URL,
};
