import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { MAILER_ERRORS } from './mailer.constants';
import { SendMailPayload } from './mailer.types';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resendApiKey: string;
  private readonly fromEmail: string;
  private readonly client: Resend | null;

  constructor(private readonly configService: ConfigService) {
    this.resendApiKey = this.configService.get<string>('mail.resendApiKey') ?? '';
    this.fromEmail = this.configService.get<string>('mail.fromEmail') ?? '';

    this.client = this.resendApiKey ? new Resend(this.resendApiKey) : null;

    if (!this.resendApiKey) {
      this.logger.warn(MAILER_ERRORS.API_KEY_MISSING);
    }

    if (!this.fromEmail) {
      this.logger.warn(MAILER_ERRORS.FROM_EMAIL_MISSING);
    }
  }

  async send(payload: SendMailPayload): Promise<void> {
    if (!this.client || !this.fromEmail) {
      this.logger.warn(`Skipping email sending for ${payload.to}: mailer is not configured`);
      return;
    }

    try {
      await this.client.emails.send({
        from: payload.from ?? this.fromEmail,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error);
    }
  }
}
