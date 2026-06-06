import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceIntegrationOrm } from '@statter/database';
import { MailerModule } from '../core/modules/mailer/mailer.module';
import { RedisModule } from '../core/modules/redis/redis.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { NotificationsService } from './notifications.service';
import { NotificationsDispatcher } from './notifications.dispatcher';
import { NotificationsController } from './notifications.controller';
import { NotificationsInternalController } from './notifications-internal.controller';
import { MonitorDownListener } from './listeners/monitor-down.listener';
import { EmailNotificationProvider } from './providers/email.notification-provider';
import { TelegramNotificationProvider } from './providers/telegram.notification-provider';
import { SlackNotificationProvider } from './providers/slack.notification-provider';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceIntegrationOrm]),
    WorkspaceModule,
    MailerModule,
    RedisModule,
    HttpModule,
  ],
  controllers: [NotificationsController, NotificationsInternalController],
  providers: [
    NotificationsService,
    NotificationsDispatcher,
    MonitorDownListener,
    EmailNotificationProvider,
    TelegramNotificationProvider,
    SlackNotificationProvider,
    InternalApiKeyGuard,
  ],
  exports: [NotificationsService, NotificationsDispatcher],
})
export class NotificationsModule {}
