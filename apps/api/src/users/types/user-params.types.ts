import { EnumUserProvider } from '@statter/database';

export interface CreateUserParams {
  email: string;
  username: string;
  firstName: string;
  lastName?: string | null;
  provider: EnumUserProvider;
  avatarUrl?: string | null;
  passwordHash?: string | null;
  verifiedAt?: Date | null;
  isTwoFactorEnabled?: boolean;
}

export interface UpdateUserParams {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string | null;
  provider?: EnumUserProvider;
  avatarUrl?: string | null;
  verifiedAt?: Date | null;
  isTwoFactorEnabled?: boolean;
}
