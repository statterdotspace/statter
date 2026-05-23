import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { MonitorOrm } from '@statter/database';
import { toDto, toPaginatedDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentMonitor } from '../monitor/decorators/current-monitor.decorator';
import { MonitorExistsGuard } from '../monitor/guards/monitor-exists.guard';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { ListChecksQueryDto } from './dto/request/list-checks-query.dto';
import { CheckResponseDto } from './dto/response/check-response.dto';
import { CheckService } from './check.service';

@Controller('monitors/:monitorId/checks')
@UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard, MonitorExistsGuard)
@Auth()
export class CheckController {
  constructor(private readonly checkService: CheckService) {}

  @Get()
  async list(
    @Param('monitorId', ParseUUIDPipe) _monitorId: string,
    @CurrentMonitor() monitor: MonitorOrm,
    @Query() query: ListChecksQueryDto
  ) {
    const page = query.page ?? 1;
    const limit = query.perPage ?? query.limit ?? 20;

    const checks = await this.checkService.findManyByMonitorId(monitor.id, page, limit);

    return toPaginatedDto(CheckResponseDto, checks);
  }

  @Get('latest')
  async latest(
    @Param('monitorId', ParseUUIDPipe) _monitorId: string,
    @CurrentMonitor() monitor: MonitorOrm
  ) {
    const check = await this.checkService.findLatestByMonitorId(monitor.id);

    return check ? toDto(CheckResponseDto, check) : null;
  }
}
