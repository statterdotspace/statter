import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MonitorOrm, UserOrm, WorkspaceOrm } from '@statter/database';
import { toDto, toPaginatedDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProjectService } from '../project/project.service';
import { CurrentWorkspace } from '../workspace/decorators/current-workspace.decorator';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { WorkspaceWriteGuard } from '../workspace/guards/workspace-write.guard';
import { CreateMonitorDto } from './dto/request/create-monitor.dto';
import { ListMonitorsQueryDto } from './dto/request/list-monitors-query.dto';
import { UpdateMonitorDto } from './dto/request/update-monitor.dto';
import { MonitorResponseDto } from './dto/response/monitor-response.dto';
import { CurrentMonitor } from './decorators/current-monitor.decorator';
import { MonitorExistsGuard } from './guards/monitor-exists.guard';
import { MonitorWriteGuard } from './guards/monitor-write.guard';
import { MonitorService } from './monitor.service';

@Controller('monitors')
@UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard)
@Auth()
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private readonly projectService: ProjectService
  ) {}

  private assertWorkspace(workspace: WorkspaceOrm | null): WorkspaceOrm {
    if (!workspace) {
      throw new BadRequestException('x-workspace-id header is required');
    }

    return workspace;
  }

  @Post()
  @UseGuards(WorkspaceWriteGuard)
  async create(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @CurrentUser() user: UserOrm,
    @Body() dto: CreateMonitorDto
  ) {
    const currentWorkspace = this.assertWorkspace(workspace);
    const project = await this.projectService.findByIdAndWorkspaceId(
      dto.projectId,
      currentWorkspace.id
    );
    if (!project) {
      throw new NotFoundException('Project not found in workspace');
    }

    const monitor = await this.monitorService.createMonitor({
      workspaceId: currentWorkspace.id,
      projectId: dto.projectId,
      createdById: user.id,
      name: dto.name,
      description: dto.description,
      url: dto.url,
      type: dto.type,
      region: dto.region,
      intervalSeconds: dto.intervalSeconds,
      timeoutMs: dto.timeoutMs,
      expectedStatus: dto.expectedStatus,
      status: dto.status,
    });

    return toDto(MonitorResponseDto, {
      ...monitor,
      lastCheck: null,
    });
  }

  @Get()
  async list(@CurrentWorkspace() workspace: WorkspaceOrm, @Query() query: ListMonitorsQueryDto) {
    const currentWorkspace = this.assertWorkspace(workspace);
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    if (query.projectId) {
      const project = await this.projectService.findByIdAndWorkspaceId(
        query.projectId,
        currentWorkspace.id
      );
      if (!project) {
        throw new NotFoundException('Project not found in workspace');
      }
    }

    const monitors = await this.monitorService.findManyByWorkspaceId(currentWorkspace.id, {
      page,
      perPage,
      projectId: query.projectId,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status,
      type: query.type,
      region: query.region,
    });

    const monitorIds = monitors.data.map((monitor) => monitor.id);

    const [lastCheckByMonitorId, uptime30dByMonitorId] = await Promise.all([
      this.monitorService.findLatestChecksByMonitorIds(monitorIds),
      this.monitorService.getUptime30dBatch(monitorIds),
    ]);

    const data = monitors.data.map((monitor) => ({
      ...monitor,
      lastCheck: lastCheckByMonitorId.get(monitor.id) ?? null,
      uptime30dPct: uptime30dByMonitorId.get(monitor.id) ?? null,
    }));

    return toPaginatedDto(MonitorResponseDto, {
      data,
      meta: monitors.meta,
    });
  }

  @Get(':monitorId')
  @UseGuards(MonitorExistsGuard)
  async getById(
    @Param('monitorId', ParseUUIDPipe) _monitorId: string,
    @CurrentMonitor() monitor: MonitorOrm
  ) {
    const latestCheck = await this.monitorService.findLatestCheckByMonitorId(monitor.id);

    return toDto(MonitorResponseDto, {
      ...monitor,
      lastCheck: latestCheck,
    });
  }

  @Patch(':monitorId')
  @UseGuards(MonitorExistsGuard, MonitorWriteGuard)
  async update(
    @Param('monitorId', ParseUUIDPipe) _monitorId: string,
    @CurrentMonitor() monitor: MonitorOrm,
    @Body() dto: UpdateMonitorDto
  ) {
    const updated = await this.monitorService.updateMonitorById(monitor.id, dto);

    if (!updated) {
      throw new NotFoundException('Monitor not found');
    }

    const latestCheck = await this.monitorService.findLatestCheckByMonitorId(updated.id);

    return toDto(MonitorResponseDto, {
      ...updated,
      lastCheck: latestCheck,
    });
  }

  @Delete(':monitorId')
  @UseGuards(MonitorExistsGuard, MonitorWriteGuard)
  async remove(
    @Param('monitorId', ParseUUIDPipe) _monitorId: string,
    @CurrentMonitor() monitor: MonitorOrm
  ) {
    await this.monitorService.deleteMonitorById(monitor.id);
    return { success: true };
  }
}
