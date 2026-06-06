export interface ChartBucket {
  bucket: string;
  region: string;
  avgMs: number | null;
  p95Ms: number | null;
  totalChecks: number;
  upChecks: number;
}

export interface DailyUptimeBar {
  day: string;
  uptimePct: number;
  totalChecks: number;
}

export interface MonitorStatsResponse {
  period: '24h' | '7d' | '30d';

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

  chart: ChartBucket[];
  dailyUptime: DailyUptimeBar[];
}
