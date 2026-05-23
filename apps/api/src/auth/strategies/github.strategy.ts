import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { resolveOAuthProfile, strategyConfig } from './oauth.utils';
import type { OAuthProviderConfig } from '@statter/config';
import type { OAuthProfile } from '../types/oauth.types';

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    const settings = configService.get<OAuthProviderConfig>('oauth.github');
    const { options } = strategyConfig('github', settings);

    super(options);
  }

  async validate(accessToken: string): Promise<OAuthProfile> {
    return resolveOAuthProfile('github', accessToken);
  }
}
