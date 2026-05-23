import { Response } from 'express';
import { TOKEN_NAME, TOKEN_TTL } from '../constants/cookie.constants';
import { ITokens } from '../types/cookies.types';
import { durationToMs } from './parse-duration-to-ms';

const isSecureCookie = process.env['NODE_ENV'] === 'production';

const setRefreshTokenCookie = (response: Response, refreshToken: string): void => {
  response.cookie(TOKEN_NAME.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + durationToMs(TOKEN_TTL.REFRESH_TOKEN)),
  });
};

const setAccessTokenCookie = (response: Response, accessToken: string): void => {
  response.cookie(TOKEN_NAME.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + durationToMs(TOKEN_TTL.ACCESS_TOKEN)),
  });
};

const clearRefreshTokenCookie = (response: Response): void => {
  response.clearCookie(TOKEN_NAME.REFRESH_TOKEN, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
  });
};

const clearAccessTokenCookie = (response: Response): void => {
  response.clearCookie(TOKEN_NAME.ACCESS_TOKEN, {
    httpOnly: true,
    secure: isSecureCookie,
    sameSite: 'lax',
    path: '/',
  });
};

const setTokensCookies = (response: Response, tokens: ITokens): void => {
  setAccessTokenCookie(response, tokens.accessToken);
  setRefreshTokenCookie(response, tokens.refreshToken);
};

const clearTokensCookies = (response: Response): void => {
  clearAccessTokenCookie(response);
  clearRefreshTokenCookie(response);
};

export { setTokensCookies, clearTokensCookies };
