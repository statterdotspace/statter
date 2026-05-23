import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { WorkspaceMemberRole } from '@statter/database';
import { RequestContext } from '../../core/types/request-context.types';

@Injectable()
export class ProjectWriteGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const role = request.workspaceMember?.role;
    if (!role) {
      return true;
    }

    if (role !== WorkspaceMemberRole.OWNER && role !== WorkspaceMemberRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to modify projects in this workspace');
    }

    return true;
  }
}
