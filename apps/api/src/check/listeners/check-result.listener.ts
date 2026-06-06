import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckGateway } from '../check.gateway';
import {
  CHECK_RESULT_INGESTED_EVENT,
  CheckResultIngestedEvent,
} from '../events/check-result-ingested.event';

@Injectable()
export class CheckResultListener {
  constructor(private readonly checkGateway: CheckGateway) {}

  @OnEvent(CHECK_RESULT_INGESTED_EVENT)
  handleCheckResultIngested(event: CheckResultIngestedEvent): void {
    this.checkGateway.emitCheckResult({
      workspaceId: event.workspaceId,
      monitorId: event.monitorId,
      check: event.check,
      monitor: event.monitor,
    });
  }
}
