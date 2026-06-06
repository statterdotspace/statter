import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel } from '@statter/database';
import { NotificationPayload } from './types/notification.types';
import { INotificationProvider } from './providers/notification-provider.interface';
import { EmailNotificationProvider } from './providers/email.notification-provider';
import { TelegramNotificationProvider } from './providers/telegram.notification-provider';
import { SlackNotificationProvider } from './providers/slack.notification-provider';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsDispatcher {
  private readonly logger = new Logger(NotificationsDispatcher.name);
  private readonly providers: Map<NotificationChannel, INotificationProvider>;

  constructor(
    private readonly notificationsService: NotificationsService,
    emailProvider: EmailNotificationProvider,
    telegramProvider: TelegramNotificationProvider,
    slackProvider: SlackNotificationProvider
  ) {
    this.providers = new Map<NotificationChannel, INotificationProvider>([
      [NotificationChannel.EMAIL, emailProvider],
      [NotificationChannel.TELEGRAM, telegramProvider],
      [NotificationChannel.SLACK, slackProvider],
    ]);
  }

  async dispatch(workspaceId: string, payload: NotificationPayload): Promise<void> {
    const integrations = await this.notificationsService.findEnabledByWorkspaceId(workspaceId);

    await Promise.allSettled(
      integrations.map(async (integration) => {
        const provider = this.providers.get(integration.channel);
        if (!provider) {
          this.logger.warn(`No provider for channel: ${integration.channel}`);
          return;
        }
        try {
          await provider.send(payload, integration.config);
        } catch (error) {
          this.logger.error(`Failed to dispatch via ${integration.channel}`, error);
        }
      })
    );
  }
}
