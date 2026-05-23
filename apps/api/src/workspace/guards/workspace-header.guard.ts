import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class WorkspaceHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const rawHeader = request.headers['x-workspace-id'];
    const workspaceId = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (!workspaceId || typeof workspaceId !== 'string') {
      throw new BadRequestException('x-workspace-id header is required');
    }

    if (!UUID_REGEX.test(workspaceId)) {
      throw new BadRequestException('x-workspace-id must be a valid UUID');
    }

    request.workspaceId = workspaceId;
    return true;
  }
}
