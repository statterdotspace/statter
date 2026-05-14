# Auth Service OAuth

This service exposes OAuth login flows for Google, GitHub, and GitLab using `passport-oauth2`.

## Environment

Required variables:

- `SESSION_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_REDIRECT_URI`
- `GITLAB_CLIENT_ID`
- `GITLAB_CLIENT_SECRET`
- `GITLAB_REDIRECT_URI`

Optional overrides:

- `GOOGLE_ISSUER` (default `https://accounts.google.com`)
- `GITHUB_ISSUER` (default `https://github.com`)
- `GITLAB_ISSUER` (default `https://gitlab.com`)
- `GOOGLE_SCOPE` (default `openid email profile`)
- `GITHUB_SCOPE` (default `read:user user:email`)
- `GITLAB_SCOPE` (default `openid email profile`)

## Endpoints

- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/github`
- `GET /api/auth/github/callback`
- `GET /api/auth/gitlab`
- `GET /api/auth/gitlab/callback`
