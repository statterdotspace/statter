export const PROVIDER_METADATA = {
  google: {
    issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://oauth2.googleapis.com/token',
    userinfo_endpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
    jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
  },
  github: {
    issuer: 'https://github.com',
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    token_endpoint: 'https://github.com/login/oauth/access_token',
    userinfo_endpoint: 'https://api.github.com/user',
  },
  gitlab: {
    issuer: 'https://gitlab.com',
    authorization_endpoint: 'https://gitlab.com/oauth/authorize',
    token_endpoint: 'https://gitlab.com/oauth/token',
    userinfo_endpoint: 'https://gitlab.com/oauth/userinfo',
  },
} as const;
