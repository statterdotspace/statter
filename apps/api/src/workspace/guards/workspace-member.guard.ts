import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const userId = request.user.id;
    const workspaceId = request.workspace?.id ?? request.workspaceId;

    if (!workspaceId) {
      return true;
    }

    const membership = await this.workspaceService.findMembership(workspaceId, userId);

    if (!membership) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    request.workspaceMember = membership;
    return true;
  }
}
