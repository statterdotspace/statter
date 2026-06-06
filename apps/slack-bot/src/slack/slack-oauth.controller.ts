import { BadRequestException, Controller, Get, Query, Redirect } from '@nestjs/common';
import { SlackOAuthService } from './slack-oauth.service';

@Controller('slack')
export class SlackOAuthController {
  constructor(private readonly slackOAuthService: SlackOAuthService) {}

  @Get('callback')
  @Redirect()
  async callback(@Query('code') code: string, @Query('state') workspaceId: string) {
    if (!code || !workspaceId) {
      throw new BadRequestException('Missing code or state');
    }

    const redirectUrl = await this.slackOAuthService.handleCallback(code, workspaceId);
    return { url: redirectUrl };
  }
}
