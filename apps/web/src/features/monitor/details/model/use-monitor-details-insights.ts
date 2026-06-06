'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Check, StatsPeriod } from '@/entities';
import { checkApi } from '@/shared/api';

export type TimeRange = StatsPeriod;

export interface ChartPoint {
  date: string;
  eu: number | null;
  ua: number | null;
}

const timeRangeLabelByValue: Record<TimeRange, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
};

interface UseMonitorDetailsInsightsOptions {
  monitorId: string;
  checks: Check[];
}

const useMonitorDetailsInsights = ({ monitorId, checks }: UseMonitorDetailsInsightsOptions) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const isHourlyRange = timeRange === '24h';
  const timeRangeLabel = timeRangeLabelByValue[timeRange];

  const statsQuery = useQuery({
    queryKey: ['monitor-stats', monitorId, timeRange],
    queryFn: () => checkApi.stats(monitorId, timeRange),
    staleTime: 60_000,
  });

  const stats = statsQuery.data;

  // Build chart points from bucketed stats data
  const chartData = useMemo<ChartPoint[]>(() => {
    if (!stats?.chart.length) return [];

    // Group by bucket timestamp, merge eu+ua per bucket
    const bucketMap = new Map<string, ChartPoint>();
    for (const bucket of stats.chart) {
      const key = bucket.bucket;
      const existing = bucketMap.get(key) ?? { date: key, eu: null, ua: null };
      const value = bucket.p95Ms ?? bucket.avgMs;
      if (bucket.region === 'eu') existing.eu = value;
      if (bucket.region === 'ua') existing.ua = value;
      bucketMap.set(key, existing);
    }

    return Array.from(bucketMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [stats]);

  // Incidents still from raw check history (realtime-aware)
  const now = Date.now();
  const rangeMs =
    timeRange === '24h' ? 86_400_000 : timeRange === '7d' ? 604_800_000 : 2_592_000_000;

  const incidents = useMemo(
    () =>
      checks
        .filter(
          (c) => c.status !== 'up' && now - new Date(c.checkedAt).getTime() <= rangeMs
        )
        .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
        .slice(0, 20),
    [checks, now, rangeMs]
  );

  return {
    timeRange,
    setTimeRange,
    isHourlyRange,
    timeRangeLabel,
    isLoading: statsQuery.isLoading,

    // Metrics from backend SQL
    uptimePct: stats?.uptimePct ?? null,
    downtimeMinutes: stats?.downtimeMinutes ?? null,
    avgMs: stats?.avgMs ?? null,
    p50Ms: stats?.p50Ms ?? null,
    p95Ms: stats?.p95Ms ?? null,
    p99Ms: stats?.p99Ms ?? null,
    totalChecks: stats?.totalChecks ?? 0,
    upChecks: stats?.upChecks ?? 0,
    downChecks: stats?.downChecks ?? 0,
    timeoutChecks: stats?.timeoutChecks ?? 0,
    degradedChecks: stats?.degradedChecks ?? 0,

    // 30-day daily bar (always 30d, from backend)
    dailyUptime: stats?.dailyUptime ?? [],

    chartData,
    incidents,
  };
};

export { useMonitorDetailsInsights };
