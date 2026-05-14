import { Request } from 'express';
import { TOKEN_NAME } from '../constants/cookie.constants';

export const refreshTokenExtractor = (request: Request): string | null => {
  const cookies = request?.cookies as Record<string, unknown> | undefined;
  const token = cookies?.[TOKEN_NAME.REFRESH_TOKEN];

  return typeof token === 'string' ? token : null;
};
