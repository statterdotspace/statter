import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestContext } from '../../core/types/request-context.types';
import { MonitorService } from '../../monitor/monitor.service';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class CheckResultMonitorExistsGuard implements CanActivate {
  constructor(private readonly monitorService: MonitorService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestContext>();
    const monitorId = request.body?.['monitorId'];

    if (typeof monitorId !== 'string' || monitorId.length === 0) {
      throw new BadRequestException('monitorId is required');
    }
    if (!UUID_REGEX.test(monitorId)) {
      throw new BadRequestException('monitorId must be a valid UUID');
    }

    const monitor = await this.monitorService.findById(monitorId);
    if (!monitor) {
      throw new NotFoundException('Monitor not found');
    }

    request.monitor = monitor;
    return true;
  }
}
