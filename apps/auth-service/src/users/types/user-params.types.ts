import { EnumUserProvider } from '@statter/database';

export interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  provider: EnumUserProvider;
  avatarUrl?: string;
  passwordHash?: string;
}

export interface UpdateUserParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  provider?: EnumUserProvider;
  avatarUrl?: string;
}
