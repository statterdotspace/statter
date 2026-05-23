import axios from 'axios';
import type { StrategyOptions } from 'passport-oauth2';
import type { OAuthProviderConfig } from '@statter/config';
import type { OAuthProfile, OAuthProvider } from '../types/oauth.types';
import { PROVIDER_METADATA } from '../constants/oauth.constants';
import { returnOAuthUser } from '../helpers/return-oauth-user';

const str = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
};

/**
 * Config mapper for oauth strategy
 * @param provider
 * @param settings
 */
export const strategyConfig = (
  provider: OAuthProvider,
  settings: OAuthProviderConfig
): { options: StrategyOptions } => {
  const metadata = PROVIDER_METADATA[provider];

  return {
    options: {
      authorizationURL: metadata.authorization_endpoint,
      tokenURL: metadata.token_endpoint,
      clientID: settings.clientId,
      clientSecret: settings.clientSecret,
      callbackURL: settings.redirectUri,
      scope: settings.scope,
    },
  };
};

/**
 * Get profile info from oauth provider using access token
 * @param provider
 * @param accessToken
 */
export const resolveOAuthProfile = async (
  provider: OAuthProvider,
  accessToken: string
): Promise<OAuthProfile> => {
  if (!accessToken) {
    throw new Error('Missing access token from OAuth provider');
  }

  if (provider === 'github') {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'statter-auth',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data as Record<string, unknown>;
    const email = await extractGitHubEmail(data, accessToken);
    const name = str(data['name']) ?? '';
    const [firstName, ...lastNameParts] = name.split(' ');
    return returnOAuthUser(
      provider,
      email,
      str(data['avatar_url']),
      str(data['login']),
      firstName,
      lastNameParts.join(' ') || null
    );
  }

  if (provider === 'google') {
    const response = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = response.data as Record<string, unknown>;
    return returnOAuthUser(
      provider,
      str(data['email']),
      str(data['picture']),
      str(data['email'])?.split('@')[0] ?? null,
      str(data['given_name']),
      str(data['family_name'])
    );
  }

  const response = await axios.get('https://gitlab.com/oauth/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = response.data as Record<string, unknown>;
  const gitlabName = str(data['name']) ?? '';
  const [firstName, ...lastNameParts] = gitlabName.split(' ');
  return returnOAuthUser(
    provider,
    str(data['email']),
    str(data['avatar_url']) ?? str(data['picture']),
    str(data['nickname']) ?? str(data['preferred_username']),
    firstName || '',
    lastNameParts.join(' ') || null
  );
};

/**
 * Get GitHub email if user has private account
 * @param accessToken
 */
const fetchGitHubPrimaryEmail = async (accessToken: string): Promise<string | null> => {
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'statter-auth',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const emails = response.data as Array<{ email?: string; primary?: boolean; verified?: boolean }>;
  const primary = emails.find((item) => item.primary && item.verified);
  if (primary?.email) {
    return primary.email;
  }

  return emails.find((item) => item.email)?.email ?? null;
};

/**
 * Extract email from GitHub user data, if email is not public, fetch primary email using GitHub API
 * @param data
 * @param accessToken
 */
const extractGitHubEmail = async (data: unknown, accessToken: string): Promise<string | null> => {
  const obj = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;
  return str(obj['email']) ?? (await fetchGitHubPrimaryEmail(accessToken));
};
