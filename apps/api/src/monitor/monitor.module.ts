import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm } from '@statter/database';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectModule } from '../project/project.module';
import { MonitorExistsGuard } from './guards/monitor-exists.guard';
import { MonitorWriteGuard } from './guards/monitor-write.guard';

@Module({
  imports: [TypeOrmModule.forFeature([MonitorOrm, CheckOrm]), WorkspaceModule, ProjectModule],
  controllers: [MonitorController],
  providers: [MonitorService, MonitorExistsGuard, MonitorWriteGuard],
  exports: [MonitorService, MonitorExistsGuard, MonitorWriteGuard],
})
export class MonitorModule {}
