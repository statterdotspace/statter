import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface SlackOAuthResponse {
  ok: boolean;
  error?: string;
  team?: { name: string };
  incoming_webhook?: { url: string; channel: string };
}

@Injectable()
export class SlackOAuthService {
  private readonly logger = new Logger(SlackOAuthService.name);

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly apiUrl: string;
  private readonly internalApiKey: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.clientId = this.configService.getOrThrow<string>('SLACK_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow<string>('SLACK_CLIENT_SECRET');
    this.redirectUri = this.configService.getOrThrow<string>('SLACK_REDIRECT_URI');
    this.apiUrl = this.configService.getOrThrow<string>('API_URL');
    this.internalApiKey = this.configService.getOrThrow<string>('INTERNAL_API_KEY');
    this.frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
  }

  async handleCallback(code: string, workspaceId: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    });

    const response = await firstValueFrom(
      this.httpService.post<SlackOAuthResponse>(
        'https://slack.com/api/oauth.v2.access',
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
    );

    const data = response.data;

    if (!data.ok || !data.incoming_webhook?.url) {
      this.logger.error('Slack OAuth failed', data.error);
      return `${this.frontendUrl}/settings/integrations?error=slack_oauth_failed`;
    }

    await firstValueFrom(
      this.httpService.post(
        `${this.apiUrl}/notifications/internal/slack/connect`,
        {
          workspaceId,
          webhookUrl: data.incoming_webhook.url,
          teamName: data.team?.name ?? '',
        },
        { headers: { 'x-internal-api-key': this.internalApiKey } }
      )
    );

    return `${this.frontendUrl}/settings/integrations?connected=slack`;
  }
}
