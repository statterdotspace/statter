import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceMemberRole } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';
import { MembersService } from '../members.service';

@Injectable()
export class RemovableMemberGuard implements CanActivate {
  constructor(private readonly membersService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const memberId = request.params?.['memberId'];
    const workspaceId = request.workspace?.id ?? request.workspaceId;

    if (!memberId || !workspaceId) {
      return true;
    }

    const memberRole = request.workspaceMember?.role;

    if (!memberRole) {
      return true;
    }

    const member = await this.membersService.findById(workspaceId, memberId);

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const targetRole = member.role;

    const canManageRole =
      memberRole === WorkspaceMemberRole.OWNER ||
      (memberRole === WorkspaceMemberRole.ADMIN && targetRole === WorkspaceMemberRole.MEMBER);

    if (!canManageRole) {
      throw new ForbiddenException('You do not have permission for this role');
    }

    if (member.role === WorkspaceMemberRole.OWNER) {
      const ownersCount = await this.membersService.countByRole(
        workspaceId,
        WorkspaceMemberRole.OWNER
      );

      if (ownersCount <= 1) {
        throw new ConflictException('Cannot remove the last owner');
      }
    }

    request.currentMember = member;

    return true;
  }
}
