import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkspaceOrm } from '@statter/database';
import { toDto } from '@statter/utils';
import * as crypto from 'crypto';
import { Auth } from '../auth/decorators/auth.decorator';
import { RedisService } from '../core/modules/redis/redis.service';
import { CurrentWorkspace } from '../workspace/decorators/current-workspace.decorator';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { WorkspaceWriteGuard } from '../workspace/guards/workspace-write.guard';
import { CreateNotificationIntegrationDto } from './dto/request/create-notification-integration.dto';
import { UpdateNotificationIntegrationDto } from './dto/request/update-notification-integration.dto';
import { WorkspaceIntegrationResponseDto } from './dto/response/notification-integration-response.dto';
import { NotificationsService } from './notifications.service';

const TELEGRAM_CONNECT_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

@Controller('notifications')
@UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard)
@Auth()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
  ) {}

  // ─── Integrations CRUD ───────────────────────────────────────────────────

  @Post()
  @UseGuards(WorkspaceWriteGuard)
  async create(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Body() dto: CreateNotificationIntegrationDto
  ) {
    const existing = await this.notificationsService.findByWorkspaceAndChannel(
      workspace.id,
      dto.channel
    );
    if (existing) {
      throw new ConflictException(`Integration for channel "${dto.channel}" already exists`);
    }

    const integration = await this.notificationsService.create({
      workspaceId: workspace.id,
      channel: dto.channel,
      config: dto.config,
      enabled: dto.enabled ?? true,
    });

    return toDto(WorkspaceIntegrationResponseDto, integration);
  }

  @Get()
  async list(@CurrentWorkspace() workspace: WorkspaceOrm) {
    const integrations = await this.notificationsService.findAllByWorkspaceId(workspace.id);
    return integrations.map((i) => toDto(WorkspaceIntegrationResponseDto, i));
  }

  @Get(':integrationId')
  async getById(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Param('integrationId', ParseUUIDPipe) integrationId: string
  ) {
    const integration = await this.notificationsService.findById(integrationId);
    if (!integration || integration.workspaceId !== workspace.id) {
      throw new NotFoundException('Integration not found');
    }
    return toDto(WorkspaceIntegrationResponseDto, integration);
  }

  @Patch(':integrationId')
  @UseGuards(WorkspaceWriteGuard)
  async update(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Param('integrationId', ParseUUIDPipe) integrationId: string,
    @Body() dto: UpdateNotificationIntegrationDto
  ) {
    const integration = await this.notificationsService.findById(integrationId);
    if (!integration || integration.workspaceId !== workspace.id) {
      throw new NotFoundException('Integration not found');
    }
    const updated = await this.notificationsService.update(integrationId, dto);
    return toDto(WorkspaceIntegrationResponseDto, updated!);
  }

  @Delete(':integrationId')
  @UseGuards(WorkspaceWriteGuard)
  async remove(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Param('integrationId', ParseUUIDPipe) integrationId: string
  ) {
    const integration = await this.notificationsService.findById(integrationId);
    if (!integration || integration.workspaceId !== workspace.id) {
      throw new NotFoundException('Integration not found');
    }
    await this.notificationsService.delete(integrationId);
    return { success: true };
  }

  // ─── Connection links ─────────────────────────────────────────────────────

  @Get('telegram/connect-link')
  async getTelegramConnectLink(@CurrentWorkspace() workspace: WorkspaceOrm) {
    const token = crypto.randomBytes(16).toString('hex');
    await this.redisService.set(
      `tg:connect:${token}`,
      workspace.id,
      TELEGRAM_CONNECT_TOKEN_TTL_MS
    );
    const botUsername = this.configService.getOrThrow<string>('telegram.botUsername');
    return { url: `https://t.me/${botUsername}?start=${token}` };
  }

  @Get('slack/oauth-url')
  async getSlackOAuthUrl(@CurrentWorkspace() workspace: WorkspaceOrm) {
    const clientId = this.configService.getOrThrow<string>('slack.clientId');
    const redirectUri = this.configService.getOrThrow<string>('slack.redirectUri');
    const scope = 'incoming-webhook';
    const url =
      `https://slack.com/oauth/v2/authorize` +
      `?client_id=${clientId}` +
      `&scope=${scope}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${workspace.id}`;
    return { url };
  }
}
