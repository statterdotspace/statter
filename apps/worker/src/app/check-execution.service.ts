import { Injectable, Logger } from '@nestjs/common';
import { CheckJobPayload, CheckResultPayload } from '@statter/utils';
import { CheckerRegistryService } from './checkers/checker-registry.service';

@Injectable()
export class CheckExecutionService {
  private readonly logger = new Logger(CheckExecutionService.name);

  constructor(private readonly checkerRegistryService: CheckerRegistryService) {}

  async execute(job: CheckJobPayload): Promise<CheckResultPayload | null> {
    const checker = this.checkerRegistryService.resolve(job);
    if (!checker) {
      this.logger.warn(`Unsupported monitor type "${job.type}" for monitor=${job.monitorId}`);
      return null;
    }

    return await checker.execute(job);
  }
}
