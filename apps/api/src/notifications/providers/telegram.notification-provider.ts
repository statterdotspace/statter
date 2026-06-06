import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NotificationChannel } from '@statter/database';
import { INotificationProvider } from './notification-provider.interface';
import { NotificationPayload, TelegramNotificationConfig } from '../types/notification.types';

@Injectable()
export class TelegramNotificationProvider implements INotificationProvider {
  readonly channel = NotificationChannel.TELEGRAM;
  private readonly logger = new Logger(TelegramNotificationProvider.name);

  constructor(private readonly httpService: HttpService) {}

  async send(payload: NotificationPayload, config: Record<string, unknown>): Promise<void> {
    const { botToken, chatId } = config as unknown as TelegramNotificationConfig;
    if (!botToken || !chatId) return;

    const text = this.buildMessage(payload);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      await firstValueFrom(
        this.httpService.post(url, { chat_id: chatId, text, parse_mode: 'HTML' })
      );
    } catch (error) {
      this.logger.error('Failed to send Telegram notification', error);
    }
  }

  private buildMessage(payload: NotificationPayload): string {
    const statusEmoji = payload.status === 'down' ? '🔴' : '🟡';
    const lines = [
      `${statusEmoji} <b>Monitor Alert: ${payload.monitorName}</b>`,
      `<b>Status:</b> ${payload.status.toUpperCase()}`,
      `<b>URL:</b> ${payload.monitorUrl}`,
    ];

    if (payload.statusCode) lines.push(`<b>Status Code:</b> ${payload.statusCode}`);
    if (payload.latencyMs) lines.push(`<b>Latency:</b> ${payload.latencyMs}ms`);
    if (payload.errorMessage) lines.push(`<b>Error:</b> ${payload.errorMessage}`);

    lines.push(`<b>Region:</b> ${payload.region}`);
    lines.push(`<b>Time:</b> ${payload.checkedAt.toISOString()}`);

    return lines.join('\n');
  }
}
