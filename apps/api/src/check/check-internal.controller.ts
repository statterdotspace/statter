import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MonitorOrm } from '@statter/database';
import { CheckService } from './check.service';
import { CreateCheckResultDto } from './dto/request/create-check-result.dto';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { CurrentMonitor } from '../monitor/decorators/current-monitor.decorator';
import { CheckResultMonitorExistsGuard } from './guards/check-result-monitor-exists.guard';

@Controller('internal/check-results')
@UseGuards(InternalApiKeyGuard, CheckResultMonitorExistsGuard)
export class CheckInternalController {
  constructor(private readonly checkService: CheckService) {}

  @Post()
  async ingest(@Body() dto: CreateCheckResultDto, @CurrentMonitor() monitor: MonitorOrm) {
    await this.checkService.ingestCheckResult(dto, monitor);
    return { success: true };
  }
}
