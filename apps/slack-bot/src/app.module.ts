import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackOAuthModule } from './slack/slack-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SlackOAuthModule,
  ],
})
export class AppModule {}
