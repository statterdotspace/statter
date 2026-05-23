import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceLastRemainingGuard implements CanActivate {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const workspacesCount = await this.workspaceService.countMembershipsByUserId(request.user.id);
    if (workspacesCount <= 1) {
      throw new ConflictException('At least one workspace must remain');
    }

    return true;
  }
}
