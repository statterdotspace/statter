import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceMemberRole, UserOrm, WorkspaceOrm } from '@statter/database';
import { slugify, toDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StorageService } from '../core/modules/storage/storage.service';
import { UploadUrlResponseDto } from '../core/modules/storage/dto/response/upload-url-response.dto';
import { CurrentWorkspace } from './decorators/current-workspace.decorator';
import { CreateWorkspaceDto } from './dto/request/create-workspace.dto';
import { GenerateWorkspaceLogoUploadUrlDto } from './dto/request/generate-workspace-logo-upload-url.dto';
import { UpdateWorkspaceDto } from './dto/request/update-workspace.dto';
import { WorkspaceResponseDto } from './dto/response/workspace-response.dto';
import { WorkspaceExistsGuard } from './guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from './guards/workspace-header.guard';
import { WorkspaceLastRemainingGuard } from './guards/workspace-last-remaining.guard';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { WorkspaceWriteGuard } from './guards/workspace-write.guard';
import { WorkspaceService } from './workspace.service';

@Auth()
@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  async create(@CurrentUser() user: UserOrm, @Body() dto: CreateWorkspaceDto) {
    const workspace = await this.workspaceService.create({
      name: dto.name,
      slug: dto.slug ? slugify(dto.slug) : slugify(dto.name),
      logoUrl: dto.logoUrl ?? null,
    });

    await this.workspaceService.createMembership({
      workspaceId: workspace.id,
      userId: user.id,
      role: WorkspaceMemberRole.OWNER,
    });

    return toDto(WorkspaceResponseDto, workspace);
  }

  @Get()
  async list(@CurrentUser() user: UserOrm) {
    const workspaces = await this.workspaceService.findWorkspacesByUserId(user.id);
    return workspaces.map((workspace) => toDto(WorkspaceResponseDto, workspace));
  }

  @Get('current')
  @UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard)
  getCurrent(@CurrentWorkspace() workspace: WorkspaceOrm) {
    return toDto(WorkspaceResponseDto, workspace);
  }

  @Patch('current')
  @UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard, WorkspaceWriteGuard)
  async update(@CurrentWorkspace() workspace: WorkspaceOrm, @Body() dto: UpdateWorkspaceDto) {
    const updated = await this.workspaceService.update(workspace.id, {
      name: dto.name,
      logoUrl: dto.logoUrl,
      slug: dto.slug ? slugify(dto.slug) : undefined,
    });

    return toDto(WorkspaceResponseDto, updated);
  }

  @Delete('current')
  @UseGuards(
    WorkspaceHeaderGuard,
    WorkspaceExistsGuard,
    WorkspaceMemberGuard,
    WorkspaceWriteGuard,
    WorkspaceLastRemainingGuard
  )
  async remove(@CurrentWorkspace() workspace: WorkspaceOrm) {
    await this.workspaceService.delete(workspace.id);
    return { success: true };
  }

  @Post('current/logo/upload-url')
  @UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard, WorkspaceWriteGuard)
  async generateWorkspaceLogoUploadUrl(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Body() dto: GenerateWorkspaceLogoUploadUrlDto
  ) {
    const payload = await this.storageService.generatePresignedUploadUrl({
      ownerPath: `workspaces/${workspace.id}/logo`,
      fileName: dto.fileName,
      contentType: dto.contentType,
    });

    return toDto(UploadUrlResponseDto, payload);
  }
}
