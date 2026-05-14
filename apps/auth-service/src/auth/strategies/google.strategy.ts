import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { resolveOAuthProfile, strategyConfig } from './oauth.utils';
import type { OAuthProviderConfig } from '@statter/config';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const settings = configService.get<OAuthProviderConfig>('oauth.google');
    const { options } = strategyConfig('google', settings);

    super(options);
  }

  async validate(accessToken: string) {
    return resolveOAuthProfile('google', accessToken);
  }
}
