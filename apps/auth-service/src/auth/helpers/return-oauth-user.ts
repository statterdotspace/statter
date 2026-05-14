import type { OAuthProvider } from '../types/oauth.types';
import { EnumUserProvider, EnumUserRole, UserOrm } from '@statter/database';

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
): UserOrm => {
  const now = new Date();

  return {
    id: '',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    email: email ?? '',
    passwordHash: null,
    avatarUrl,
    verifiedAt: now,
    isTwoFactorEnabled: false,
    role: EnumUserRole.USER,
    provider: mapProvider(provider),
    username: username ?? '',
    firstName: firstName ?? '',
    lastName,
    workspaceMemberships: [],
    invitations: [],
    createdProjects: [],
    createdMonitors: [],
  };
};
