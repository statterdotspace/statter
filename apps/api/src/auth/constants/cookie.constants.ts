import type { StringValue } from 'ms';

export const TOKEN_NAME = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const TOKEN_TTL = {
  ACCESS_TOKEN: '1d',
  REFRESH_TOKEN: '3d',
} as const satisfies Record<keyof typeof TOKEN_NAME, StringValue>;
