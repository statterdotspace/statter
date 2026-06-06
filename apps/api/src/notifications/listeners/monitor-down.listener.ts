import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CheckStatus } from '@statter/database';
import {
  CHECK_RESULT_INGESTED_EVENT,
  CheckResultIngestedEvent,
} from '../../check/events/check-result-ingested.event';
import { NotificationsDispatcher } from '../notifications.dispatcher';
import { NotificationPayload } from '../types/notification.types';

@Injectable()
export class MonitorDownListener {
  constructor(private readonly dispatcher: NotificationsDispatcher) {}

  @OnEvent(CHECK_RESULT_INGESTED_EVENT)
  async handleCheckResultIngested(event: CheckResultIngestedEvent): Promise<void> {
    if (event.check.status === CheckStatus.UP) return;

    const payload: NotificationPayload = {
      monitorId: event.monitorEntity.id,
      monitorName: event.monitorEntity.name,
      monitorUrl: event.monitorEntity.url,
      workspaceId: event.workspaceId,
      projectId: event.monitorEntity.projectId,
      region: event.check.region,
      status: event.check.status,
      statusCode: event.check.statusCode,
      latencyMs: event.check.latencyMs,
      errorMessage: event.check.errorMessage,
      checkedAt: event.check.checkedAt,
    };

    await this.dispatcher.dispatch(event.workspaceId, payload);
  }
}
