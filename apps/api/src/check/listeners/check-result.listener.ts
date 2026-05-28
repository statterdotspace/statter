import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckStatus } from '@statter/database';
import { CheckGateway } from '../check.gateway';
import {
  CHECK_RESULT_INGESTED_EVENT,
  CheckResultIngestedEvent,
} from '../events/check-result-ingested.event';
import { CheckService } from '../check.service';

@Injectable()
export class CheckResultListener {
  constructor(
    private readonly checkGateway: CheckGateway,
    private readonly checkService: CheckService
  ) {}

  @OnEvent(CHECK_RESULT_INGESTED_EVENT)
  handleCheckResultIngested(event: CheckResultIngestedEvent): void {
    this.checkGateway.emitCheckResult({
      workspaceId: event.workspaceId,
      monitorId: event.monitorId,
      check: event.check,
      monitor: event.monitor,
    });

    if (event.check.status !== CheckStatus.UP) {
      this.checkService.logFailure(event.monitorEntity, event.check);
    }
  }
}
