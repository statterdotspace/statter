import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { MonitorService } from '../monitor.service';

@Injectable()
export class MonitorExistsGuard implements CanActivate {
  constructor(private readonly monitorService: MonitorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();

    if (!request.user) {
      return true;
    }

    const monitorId = request.params?.['monitorId'];
    const workspaceId = request.workspace?.id ?? request.workspaceId;

    if (!monitorId || typeof monitorId !== 'string' || !workspaceId) {
      return true;
    }

    const monitor = await this.monitorService.findByIdAndWorkspaceId(monitorId, workspaceId);

    if (!monitor) {
      throw new NotFoundException('Monitor not found');
    }

    request.monitor = monitor;
    return true;
  }
}
