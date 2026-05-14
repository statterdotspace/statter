import { registerAs } from '@nestjs/config';
import { OAuthProviderConfig } from './types';

export default registerAs(
  'oauth',
  () =>
    ({
      google: {
        issuer: process.env['GOOGLE_ISSUER'] ?? 'https://accounts.google.com',
        clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
        redirectUri: process.env['GOOGLE_REDIRECT_URI'] ?? '',
        scope: process.env['GOOGLE_SCOPE'] ?? 'openid email profile',
      },
      github: {
        issuer: process.env['GITHUB_ISSUER'] ?? 'https://github.com',
        clientId: process.env['GITHUB_CLIENT_ID'] ?? '',
        clientSecret: process.env['GITHUB_CLIENT_SECRET'] ?? '',
        redirectUri: process.env['GITHUB_REDIRECT_URI'] ?? '',
        scope: process.env['GITHUB_SCOPE'] ?? 'read:user user:email',
      },
      gitlab: {
        issuer: process.env['GITLAB_ISSUER'] ?? 'https://gitlab.com',
        clientId: process.env['GITLAB_CLIENT_ID'] ?? '',
        clientSecret: process.env['GITLAB_CLIENT_SECRET'] ?? '',
        redirectUri: process.env['GITLAB_REDIRECT_URI'] ?? '',
        scope: process.env['GITLAB_SCOPE'] ?? 'openid email profile',
      },
    }) satisfies Record<'google' | 'github' | 'gitlab', OAuthProviderConfig>
);
