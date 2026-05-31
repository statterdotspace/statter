import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { ProjectService } from '../project.service';

@Injectable()
export class ProjectExistsGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const projectId = request.params?.['projectId'];
    const workspaceId = request.workspace?.id ?? request.workspaceId;

    if (!projectId || typeof projectId !== 'string' || !workspaceId) {
      return true;
    }

    const project = await this.projectService.findByIdAndWorkspaceId(projectId, workspaceId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    request.project = project;
    return true;
  }
}
