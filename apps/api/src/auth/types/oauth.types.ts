import { EnumUserProvider } from '@statter/database';

export type OAuthProvider = 'google' | 'github' | 'gitlab';

export interface OAuthProfile {
  email: string;
  avatarUrl: string | null;
  username: string;
  firstName: string;
  lastName: string | null;
  provider: EnumUserProvider;
}
