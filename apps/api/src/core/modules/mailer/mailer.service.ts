import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { SendMailPayload } from './mailer.types';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resendApiKey: string;
  private readonly fromEmail: string;
  private readonly client: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resendApiKey = this.configService.getOrThrow<string>('mail.resendApiKey');
    this.fromEmail = this.configService.getOrThrow<string>('mail.fromEmail');

    this.client = new Resend(this.resendApiKey);
  }

  async send(payload: SendMailPayload): Promise<void> {
    try {
      await this.client.emails.send({
        from: this.fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }

  async sendMany(payloads: SendMailPayload[]): Promise<void> {
    try {
      await this.client.batch.send(
        payloads.map((payload) => ({
          from: this.fromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }))
      );
    } catch (error) {
      this.logger.error('Failed to send emails', error);
    }
  }
}
