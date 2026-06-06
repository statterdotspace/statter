import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SlackOAuthService } from './slack-oauth.service';
import { SlackOAuthController } from './slack-oauth.controller';

@Module({
  imports: [HttpModule],
  controllers: [SlackOAuthController],
  providers: [SlackOAuthService],
})
export class SlackOAuthModule {}
