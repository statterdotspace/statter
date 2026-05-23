import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceExistsGuard implements CanActivate {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const workspaceId = request.workspaceId;
    if (!workspaceId) {
      return true;
    }

    const workspace = await this.workspaceService.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    request.workspace = workspace;
    return true;
  }
}
