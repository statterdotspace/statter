import type { OAuthProfile, OAuthProvider } from '../types/oauth.types';
import { EnumUserProvider } from '@statter/database';

const mapProvider = (provider: OAuthProvider): EnumUserProvider => {
  if (provider === 'google') return EnumUserProvider.GOOGLE;
  if (provider === 'github') return EnumUserProvider.GITHUB;
  return EnumUserProvider.GITLAB;
};

export const returnOAuthUser = (
  provider: OAuthProvider,
  email: string | null,
  avatarUrl: string | null,
  username: string | null,
  firstName: string | null,
  lastName: string | null
): OAuthProfile => {
  return {
    email: email ?? '',
    avatarUrl,
    provider: mapProvider(provider),
    username: username ?? '',
    firstName: firstName ?? '',
    lastName,
  };
};
