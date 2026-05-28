import { CanActivate, ConflictException, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { InvitationStatus } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';
import { InvitationsService } from '../invitations.service';

@Injectable()
export class InvitationAcceptGuard implements CanActivate {
  constructor(private readonly invitationsService: InvitationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();
    const invitation = request.currentInvitation;
    const user = request.user;

    if (!invitation || !user) {
      return true;
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return true;
    }

    const now = new Date();
    if (invitation.expiresAt.getTime() <= now.getTime()) {
      await this.invitationsService.update(invitation.id, {
        status: InvitationStatus.EXPIRED,
        respondedAt: now,
      });
      throw new ConflictException('Invitation has expired');
    }

    if (user.email !== invitation.email) {
      throw new ForbiddenException('This invitation is for a different email address');
    }

    return true;
  }
}
