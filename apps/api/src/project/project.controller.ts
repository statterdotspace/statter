import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ProjectOrm, WorkspaceOrm } from '@statter/database';
import { slugify, toDto, toPaginatedDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentWorkspace } from '../workspace/decorators/current-workspace.decorator';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { WorkspaceWriteGuard } from '../workspace/guards/workspace-write.guard';
import { CreateProjectDto } from './dto/request/create-project.dto';
import { UpdateProjectDto } from './dto/request/update-project.dto';
import { ProjectResponseDto } from './dto/response/project-response.dto';
import { CurrentProject } from './decorators/current-project.decorator';
import { ProjectExistsGuard } from './guards/project-exists.guard';
import { ProjectWriteGuard } from './guards/project-write.guard';
import { ProjectService } from './project.service';
import { ListProjectsQueryDto } from './dto/request/list-projects-query.dto';

@Controller('projects')
@UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard)
@Auth()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProjectDto
  ) {
    const currentWorkspace = this.assertWorkspace(workspace);
    const project = await this.projectService.create({
      workspaceId: currentWorkspace.id,
      createdById: userId,
      name: dto.name,
      slug: slugify(dto.name),
      description: dto.description,
    });

    return toDto(ProjectResponseDto, project);
  }

  @Get()
  async list(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Query() query: ListProjectsQueryDto
  ) {
    const currentWorkspace = this.assertWorkspace(workspace);
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;

    const projects = await this.projectService.findManyByWorkspaceId(currentWorkspace.id, {
      page,
      perPage,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return toPaginatedDto(ProjectResponseDto, projects);
  }

  @Get(':projectId')
  @UseGuards(ProjectExistsGuard)
  getById(
    @Param('projectId', ParseUUIDPipe) _projectId: string,
    @CurrentProject() project: ProjectOrm
  ) {
    return toDto(ProjectResponseDto, project);
  }

  @Get('slug/:projectSlug')
  async getBySlug(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Param('projectSlug') projectSlug: string
  ) {
    const currentWorkspace = this.assertWorkspace(workspace);
    const project = await this.projectService.findBySlugInWorkspace(currentWorkspace.id, projectSlug);

    if (!project) {
      throw new NotFoundException('Project not found in workspace');
    }

    return toDto(ProjectResponseDto, project);
  }

  @Patch(':projectId')
  @UseGuards(ProjectExistsGuard, ProjectWriteGuard)
  async update(
    @Param('projectId', ParseUUIDPipe) _projectId: string,
    @CurrentProject() project: ProjectOrm,
    @Body() dto: UpdateProjectDto
  ) {
    const updated = await this.projectService.update(project.id, {
      name: dto.name,
      description: dto.description,
      slug: dto.slug ? slugify(dto.slug) : project.slug,
    });

    return toDto(ProjectResponseDto, updated);
  }

  @Delete(':projectId')
  @UseGuards(ProjectExistsGuard, ProjectWriteGuard)
  async remove(
    @Param('projectId', ParseUUIDPipe) _projectId: string,
    @CurrentProject() project: ProjectOrm
  ) {
    await this.projectService.delete(project.id);
    return { success: true };
  }
}
