import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '../../core/modules/mailer/mailer.service';
import { buildVerificationEmail } from '../../auth/helpers/verification-email';
import { VerificationCodeService } from '../../auth/services/verification-code.service';
import { VerificationType } from '../../auth/constants/verification.constants';
import { VerificationCodeTriggerEvent } from '../../auth/events/verification-code-trigger-event.type';
import { PASSWORD_CHANGE_REQUEST_EVENT } from '../events/password-change-request.event';

@Injectable()
export class UsersListener {
  private readonly logger = new Logger(UsersListener.name);

  constructor(
    private readonly verificationCodeService: VerificationCodeService,
    private readonly mailerService: MailerService
  ) {}

  @OnEvent(PASSWORD_CHANGE_REQUEST_EVENT)
  async handlePasswordChangeRequest(event: VerificationCodeTriggerEvent): Promise<void> {
    const code = await this.verificationCodeService.create(
      event.identifier,
      VerificationType.CHANGE_PASSWORD
    );

    this.logger.log(`Password change OTP for ${event.identifier} -> ${code}`);

    const emailPayload = buildVerificationEmail(code, VerificationType.CHANGE_PASSWORD);

    await this.mailerService.send({
      to: event.identifier,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    });
  }
}
