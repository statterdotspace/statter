import { CheckOrm, MonitorOrm } from '@statter/database';

export const CHECK_RESULT_INGESTED_EVENT = 'check.result.ingested';

export interface CheckRealtimeMonitorSnapshot {
  id: string;
  lastCheckAt: Date;
  lastStatus: string | null;
  lastLatencyMs: number | null;
}

export interface CheckRealtimeEvent {
  workspaceId: string;
  monitorId: string;
  check: CheckOrm;
  monitor: CheckRealtimeMonitorSnapshot;
}

export interface CheckResultIngestedEvent extends CheckRealtimeEvent {
  monitorEntity: MonitorOrm;
}
