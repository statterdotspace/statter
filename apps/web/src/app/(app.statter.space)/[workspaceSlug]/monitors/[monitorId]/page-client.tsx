'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMonitorDetailsInsights } from '@/features/monitor';
import { checkApi, monitorApi } from '@/shared/api';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { getCookieValue } from '@/shared/lib/utils';
import { useChecksRealtime, type Check, type ChecksRealtimeEvent, type Monitor } from '@/entities';
import {
  MonitorDetailsLoadingState,
  MonitorDetailsNotFoundState,
  MonitorDetailsPageHeader,
  MonitorDetailsStatsGrid,
  MonitorDetailsSummaryCard,
  MonitorIncidentsCard,
  MonitorLatencyChartCard,
} from '@/widgets/monitors';
import { PageContainer, PageContent, PageHeader } from '@/shared/ui/page-wrapper';

interface MonitorDetailsPageClientProps {
  workspaceSlug: string;
  monitorId: string;
}

const historyQueryDays = 30;
const historyQueryLimit = 2000;

const MonitorDetailsPageClient = ({ workspaceSlug, monitorId }: MonitorDetailsPageClientProps) => {
  const queryClient = useQueryClient();
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();

  const monitorQuery = useQuery({
    queryKey: ['monitor', monitorId],
    queryFn: () => monitorApi.getById(monitorId),
    enabled: Boolean(workspaceId),
  });

  const historyQuery = useQuery({
    queryKey: ['monitor-check-history', monitorId, historyQueryDays, historyQueryLimit],
    queryFn: () => checkApi.history(monitorId, { days: historyQueryDays, limit: historyQueryLimit }),
    enabled: Boolean(workspaceId),
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    setWorkspaceId(getCookieValue(document.cookie, WORKSPACE_COOKIE_NAME));
  }, []);

  const handleCheckEvent = useCallback(
    (event: ChecksRealtimeEvent) => {
      if (event.monitorId !== monitorId) {
        return;
      }

      queryClient.setQueryData<Monitor>(['monitor', monitorId], (monitor) => {
        if (!monitor) {
          return monitor;
        }

        return {
          ...monitor,
          lastCheckAt: event.monitor.lastCheckAt,
          lastStatus: event.monitor.lastStatus ?? undefined,
          lastLatencyMs: event.monitor.lastLatencyMs ?? undefined,
          lastCheck: event.check,
        };
      });

      queryClient.setQueriesData<Check[]>(
        { queryKey: ['monitor-check-history', monitorId] },
        (checks) => {
          if (!checks) {
            return checks;
          }

          const withoutDuplicate = checks.filter((item) => item.id !== event.check.id);
          return [event.check, ...withoutDuplicate].slice(0, historyQueryLimit);
        }
      );
    },
    [monitorId, queryClient]
  );

  useChecksRealtime({
    workspaceId,
    onEvent: handleCheckEvent,
  });

  const isLoading = !workspaceId || monitorQuery.isLoading || historyQuery.isLoading;
  const monitor = monitorQuery.data ?? null;
  const checks = historyQuery.data ?? [];

  const monitorDetailsInsights = useMonitorDetailsInsights({ checks });

  if (isLoading) {
    return <MonitorDetailsLoadingState />;
  }

  if (!monitor) {
    return <MonitorDetailsNotFoundState />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <MonitorDetailsPageHeader workspaceSlug={workspaceSlug} />
      </PageHeader>

      <PageContent className="space-y-4">
        <MonitorDetailsSummaryCard monitor={monitor} />

        <MonitorDetailsStatsGrid
          availability24h={monitorDetailsInsights.availability24h}
          avgLatencyMs={monitorDetailsInsights.avgLatencyMs}
          checks24hCount={monitorDetailsInsights.checks24hCount}
          failed24hCount={monitorDetailsInsights.failed24hCount}
        />

        <MonitorLatencyChartCard
          chartData={monitorDetailsInsights.chartData}
          timeRange={monitorDetailsInsights.timeRange}
          timeRangeLabel={monitorDetailsInsights.timeRangeLabel}
          isHourlyRange={monitorDetailsInsights.isHourlyRange}
          onTimeRangeChange={monitorDetailsInsights.setTimeRange}
        />

        <MonitorIncidentsCard
          incidents={monitorDetailsInsights.incidents}
          timeRangeLabel={monitorDetailsInsights.timeRangeLabel}
        />
      </PageContent>
    </PageContainer>
  );
};

export { MonitorDetailsPageClient };
