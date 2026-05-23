import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckOrm } from '@statter/database';
import { WorkspaceModule } from '../workspace/workspace.module';
import { MonitorModule } from '../monitor/monitor.module';

@Module({
  imports: [TypeOrmModule.forFeature([CheckOrm]), WorkspaceModule, MonitorModule],
  controllers: [CheckController],
  providers: [CheckService],
  exports: [CheckService],
})
export class CheckModule {}
