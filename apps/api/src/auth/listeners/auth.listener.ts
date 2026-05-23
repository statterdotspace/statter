import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '../../core/modules/mailer/mailer.service';
import { buildVerificationEmail } from '../helpers/verification-email';
import { VerificationCodeService } from '../services/verification-code.service';
import { VerificationCodeTriggerEvent } from '../events/verification-code-trigger-event.type';
import { REGISTRATION_VERIFICATION_REQUIRED_EVENT } from '../events/registration-verification-required.event';
import { LOGIN_TWO_FACTOR_VERIFICATION_REQUIRED_EVENT } from '../events/login-two-factor-verification-required.event';

@Injectable()
export class AuthListener {
  private readonly logger = new Logger(AuthListener.name);

  constructor(
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService
  ) {}

  @OnEvent(REGISTRATION_VERIFICATION_REQUIRED_EVENT)
  @OnEvent(LOGIN_TWO_FACTOR_VERIFICATION_REQUIRED_EVENT)
  async handle(event: VerificationCodeTriggerEvent): Promise<void> {
    const code = await this.verificationCodeService.create(event.identifier, event.type);

    this.logger.log(`OTP CODE for ${event.identifier} -> ${code}`);

    const emailPayload = buildVerificationEmail(code, event.type);

    await this.mailerService.send({
      to: event.identifier,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    });
  }
}
