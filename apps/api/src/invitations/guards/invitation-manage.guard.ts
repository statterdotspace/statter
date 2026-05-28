import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InvitationStatus, WorkspaceMemberRole } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';
import { InvitationsService } from '../invitations.service';

@Injectable()
export class InvitationManageGuard implements CanActivate {
  constructor(private readonly invitationsService: InvitationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const invitationId = request.params?.['invitationId'];
    const workspaceId = request.workspace?.id ?? request.workspaceId;

    if (!invitationId || !workspaceId) {
      return true;
    }

    const member = request.workspaceMember;

    if (!member?.role) {
      return true;
    }

    const invitation = await this.invitationsService.findByIdAndWorkspaceId(
      invitationId,
      workspaceId
    );

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('Invitation is no longer pending');
    }

    const memberRole = member.role;
    const targetRole = invitation.role;

    const canManageRole =
      memberRole === WorkspaceMemberRole.OWNER ||
      (memberRole === WorkspaceMemberRole.ADMIN && targetRole === WorkspaceMemberRole.MEMBER);

    if (!canManageRole) {
      throw new ForbiddenException('You do not have permission for this role');
    }

    request.currentInvitation = invitation;

    return true;
  }
}
