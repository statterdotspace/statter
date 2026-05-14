import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { resolveOAuthProfile, strategyConfig } from './oauth.utils';
import type { OAuthProviderConfig } from '@statter/config';

@Injectable()
export class GitlabOAuthStrategy extends PassportStrategy(Strategy, 'gitlab') {
  constructor(private readonly configService: ConfigService) {
    const settings = configService.get<OAuthProviderConfig>('oauth.gitlab');
    const { options } = strategyConfig('gitlab', settings);

    super(options);
  }

  async validate(accessToken: string) {
    return resolveOAuthProfile('gitlab', accessToken);
  }
}
