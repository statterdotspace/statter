export type CheckStatus = 'up' | 'down' | 'degraded' | 'timeout';

export interface Check {
  id: string;
  monitorId: string;
  checkedAt: string;
  status: CheckStatus;
  statusCode: number | null;
  latencyMs: number | null;
  region: 'eu' | 'ua';
  responseSizeBytes: number | null;
  errorMessage: string | null;
}

export interface CheckListQuery {
  page?: number;
  limit?: number;
}

export interface CheckHistoryQuery {
  days?: number;
  limit?: number;
}

export type StatsPeriod = '24h' | '7d' | '30d';

export interface StatsChartBucket {
  bucket: string;
  region: string;
  avgMs: number | null;
  p95Ms: number | null;
  totalChecks: number;
  upChecks: number;
}

export interface StatsDailyUptime {
  day: string;
  uptimePct: number;
  totalChecks: number;
}

export interface MonitorStats {
  period: StatsPeriod;
  uptimePct: number;
  downtimeMinutes: number;
  avgMs: number | null;
  p50Ms: number | null;
  p95Ms: number | null;
  p99Ms: number | null;
  totalChecks: number;
  upChecks: number;
  downChecks: number;
  timeoutChecks: number;
  degradedChecks: number;
  chart: StatsChartBucket[];
  dailyUptime: StatsDailyUptime[];
}
