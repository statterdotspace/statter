import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '@statter/database';
import { MailerService } from '../../core/modules/mailer/mailer.service';
import { INotificationProvider } from './notification-provider.interface';
import { EmailNotificationConfig, NotificationPayload } from '../types/notification.types';

@Injectable()
export class EmailNotificationProvider implements INotificationProvider {
  readonly channel = NotificationChannel.EMAIL;

  constructor(private readonly mailerService: MailerService) {}

  async send(payload: NotificationPayload, config: Record<string, unknown>): Promise<void> {
    const { email } = config as unknown as EmailNotificationConfig;
    if (!email) return;

    await this.mailerService.send({
      to: email,
      subject: `[Statter] Monitor "${payload.monitorName}" is ${payload.status.toUpperCase()}`,
      html: this.buildHtml(payload),
      text: this.buildText(payload),
    });
  }

  private buildHtml(payload: NotificationPayload): string {
    return `
      <h2>Monitor Alert: ${payload.monitorName}</h2>
      <p><strong>Status:</strong> ${payload.status.toUpperCase()}</p>
      <p><strong>URL:</strong> ${payload.monitorUrl}</p>
      ${payload.statusCode ? `<p><strong>Status Code:</strong> ${payload.statusCode}</p>` : ''}
      ${payload.latencyMs ? `<p><strong>Latency:</strong> ${payload.latencyMs}ms</p>` : ''}
      ${payload.errorMessage ? `<p><strong>Error:</strong> ${payload.errorMessage}</p>` : ''}
      <p><strong>Region:</strong> ${payload.region}</p>
      <p><strong>Checked At:</strong> ${payload.checkedAt.toISOString()}</p>
    `.trim();
  }

  private buildText(payload: NotificationPayload): string {
    const lines = [
      `Monitor Alert: ${payload.monitorName}`,
      `Status: ${payload.status.toUpperCase()}`,
      `URL: ${payload.monitorUrl}`,
    ];

    if (payload.statusCode) lines.push(`Status Code: ${payload.statusCode}`);
    if (payload.latencyMs) lines.push(`Latency: ${payload.latencyMs}ms`);
    if (payload.errorMessage) lines.push(`Error: ${payload.errorMessage}`);

    lines.push(`Region: ${payload.region}`);
    lines.push(`Checked At: ${payload.checkedAt.toISOString()}`);

    return lines.join('\n');
  }
}
