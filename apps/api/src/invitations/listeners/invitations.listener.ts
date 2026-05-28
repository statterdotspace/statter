import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '../../core/modules/mailer/mailer.service';
import {
  INVITATION_EMAIL_REQUESTED_EVENT,
  INVITATIONS_EMAIL_REQUESTED_EVENT,
} from '../events/invitation-email-requested.event';
import type {
  InvitationEmailRequestedEvent,
  InvitationsEmailRequestedEvent,
} from '../events/invitation-email-requested.event';
import { buildInvitationEmail } from '../helpers/build-invitation-email';

@Injectable()
export class InvitationsListener {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent(INVITATION_EMAIL_REQUESTED_EVENT)
  async handleWorkspaceInvitationEmailRequested(
    event: InvitationEmailRequestedEvent
  ): Promise<void> {
    const emailPayload = buildInvitationEmail({
      workspaceName: event.workspaceName,
      role: event.role,
      inviteUrl: event.inviteUrl,
    });

    await this.mailerService.send({
      to: event.email,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    });
  }

  @OnEvent(INVITATIONS_EMAIL_REQUESTED_EVENT)
  async handleWorkspaceInvitationsEmailRequested(
    event: InvitationsEmailRequestedEvent
  ): Promise<void> {
    await this.mailerService.sendMany(
      event.invitations.map((invitation) => {
        const emailPayload = buildInvitationEmail({
          workspaceName: invitation.workspaceName,
          role: invitation.role,
          inviteUrl: invitation.inviteUrl,
        });

        return {
          to: invitation.email,
          subject: emailPayload.subject,
          text: emailPayload.text,
          html: emailPayload.html,
        };
      })
    );
  }
}
