import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NotificationChannel } from '@statter/database';
import { INotificationProvider } from './notification-provider.interface';
import { NotificationPayload, SlackNotificationConfig } from '../types/notification.types';

@Injectable()
export class SlackNotificationProvider implements INotificationProvider {
  readonly channel = NotificationChannel.SLACK;
  private readonly logger = new Logger(SlackNotificationProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async send(payload: NotificationPayload, config: Record<string, unknown>): Promise<void> {
    const { webhookUrl } = config as unknown as SlackNotificationConfig;
    if (!webhookUrl) return;

    const body = this.buildBody(payload);

    try {
      await firstValueFrom(this.httpService.post(webhookUrl, body));
    } catch (error) {
      this.logger.error('Failed to send Slack notification', error);
    }
  }

  private buildBody(payload: NotificationPayload): object {
    const statusEmoji = payload.status === 'down' ? ':red_circle:' : ':large_yellow_circle:';
    const fields = [
      { type: 'mrkdwn', text: `*URL:*\n${payload.monitorUrl}` },
      { type: 'mrkdwn', text: `*Region:*\n${payload.region}` },
    ];

    if (payload.statusCode) {
      fields.push({ type: 'mrkdwn', text: `*Status Code:*\n${payload.statusCode}` });
    }
    if (payload.latencyMs) {
      fields.push({ type: 'mrkdwn', text: `*Latency:*\n${payload.latencyMs}ms` });
    }
    if (payload.errorMessage) {
      fields.push({ type: 'mrkdwn', text: `*Error:*\n${payload.errorMessage}` });
    }

    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${statusEmoji} Monitor Alert: ${payload.monitorName}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Status:* ${payload.status.toUpperCase()}\n*Time:* ${payload.checkedAt.toISOString()}`,
          },
        },
        { type: 'section', fields },
      ],
    };
  }
}
