import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface MonitorDetailsStatsGridProps {
  availability24h: number;
  avgLatencyMs: number;
  checks24hCount: number;
  failed24hCount: number;
}

const MonitorDetailsStatsGrid = ({
  availability24h,
  avgLatencyMs,
  checks24hCount,
  failed24hCount,
}: MonitorDetailsStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Availability (24h)</CardDescription>
          <CardTitle>{availability24h}%</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Average latency</CardDescription>
          <CardTitle>{avgLatencyMs} ms</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Total checks (24h)</CardDescription>
          <CardTitle>{checks24hCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Failed checks (24h)</CardDescription>
          <CardTitle className="text-rose-600">{failed24hCount}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export { MonitorDetailsStatsGrid };
