import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberOrm, WorkspaceOrm } from '@statter/database';
import { WorkspaceExistsGuard } from './guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from './guards/workspace-header.guard';
import { WorkspaceLastRemainingGuard } from './guards/workspace-last-remaining.guard';
import { WorkspaceMemberGuard } from './guards/workspace-member.guard';
import { WorkspaceWriteGuard } from './guards/workspace-write.guard';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceOrm, WorkspaceMemberOrm])],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    WorkspaceHeaderGuard,
    WorkspaceExistsGuard,
    WorkspaceLastRemainingGuard,
    WorkspaceMemberGuard,
    WorkspaceWriteGuard,
  ],
  exports: [
    WorkspaceService,
    WorkspaceHeaderGuard,
    WorkspaceExistsGuard,
    WorkspaceLastRemainingGuard,
    WorkspaceMemberGuard,
    WorkspaceWriteGuard,
  ],
})
export class WorkspaceModule {}
