'use client';

import { useMemo, useState } from 'react';
import type { Check } from '@/entities';

type TimeRange = '12h' | '24h' | '7d' | '14d' | '30d';

interface ChartPoint {
  date: string;
  eu: number | null;
  ua: number | null;
}

interface UseMonitorDetailsInsightsOptions {
  checks: Check[];
}

const rangeMsByTimeRange: Record<TimeRange, number> = {
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '14d': 14 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

const timeRangeLabelByValue: Record<TimeRange, string> = {
  '12h': 'Last 12 hours',
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '14d': 'Last 14 days',
  '30d': 'Last 30 days',
};

const useMonitorDetailsInsights = ({ checks }: UseMonitorDetailsInsightsOptions) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const isHourlyRange = timeRange === '12h' || timeRange === '24h';
  const timeRangeLabel = timeRangeLabelByValue[timeRange];

  const now = Date.now();
  const rangeMs = rangeMsByTimeRange[timeRange];
  const checksInRange = useMemo(
    () => checks.filter((check) => now - new Date(check.checkedAt).getTime() <= rangeMs),
    [checks, now, rangeMs]
  );

  const checks24h = useMemo(
    () => checks.filter((check) => now - new Date(check.checkedAt).getTime() <= 86400000),
    [checks, now]
  );

  const failed24hCount = checks24h.filter((check) => check.status !== 'up').length;
  const latencySamples = checks24h
    .map((check) => check.latencyMs)
    .filter((latency): latency is number => typeof latency === 'number');

  const availability24h =
    checks24h.length > 0
      ? Number((((checks24h.length - failed24hCount) / checks24h.length) * 100).toFixed(2))
      : 100;

  const avgLatencyMs =
    latencySamples.length > 0
      ? Math.round(latencySamples.reduce((sum, value) => sum + value, 0) / latencySamples.length)
      : 0;

  const chartData = useMemo<ChartPoint[]>(() => {
    if (isHourlyRange) {
      return checksInRange
        .filter((check) => typeof check.latencyMs === 'number')
        .sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime())
        .map((check) => ({
          date: check.checkedAt,
          eu: check.region === 'eu' ? (check.latencyMs as number) : null,
          ua: check.region === 'ua' ? (check.latencyMs as number) : null,
        }));
    }

    const groupedLatency = new Map<string, { timestamp: number; eu: number[]; ua: number[] }>();

    for (const check of checksInRange) {
      if (typeof check.latencyMs !== 'number') {
        continue;
      }

      const bucketDate = new Date(check.checkedAt);
      bucketDate.setHours(0, 0, 0, 0);

      const bucketKey = bucketDate.toISOString();
      const entry = groupedLatency.get(bucketKey) ?? {
        timestamp: bucketDate.getTime(),
        eu: [],
        ua: [],
      };

      if (check.region === 'eu') {
        entry.eu.push(check.latencyMs);
      } else if (check.region === 'ua') {
        entry.ua.push(check.latencyMs);
      }

      groupedLatency.set(bucketKey, entry);
    }

    return Array.from(groupedLatency.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .map(([, values]) => ({
        date: new Date(values.timestamp).toISOString(),
        eu:
          values.eu.length > 0
            ? Math.round(values.eu.reduce((sum, value) => sum + value, 0) / values.eu.length)
            : null,
        ua:
          values.ua.length > 0
            ? Math.round(values.ua.reduce((sum, value) => sum + value, 0) / values.ua.length)
            : null,
      }));
  }, [checksInRange, isHourlyRange]);

  const incidents = useMemo(
    () =>
      checksInRange
        .filter((check) => check.status !== 'up')
        .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
        .slice(0, 20),
    [checksInRange]
  );

  return {
    timeRange,
    setTimeRange,
    isHourlyRange,
    timeRangeLabel,
    checks24hCount: checks24h.length,
    failed24hCount,
    availability24h,
    avgLatencyMs,
    chartData,
    incidents,
  };
};

export { useMonitorDetailsInsights };
export type { ChartPoint, TimeRange };
