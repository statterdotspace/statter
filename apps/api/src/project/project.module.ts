import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectOrm } from '@statter/database';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectExistsGuard } from './guards/project-exists.guard';
import { ProjectWriteGuard } from './guards/project-write.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectOrm]), WorkspaceModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectExistsGuard, ProjectWriteGuard],
  exports: [ProjectService, ProjectExistsGuard, ProjectWriteGuard],
})
export class ProjectModule {}
