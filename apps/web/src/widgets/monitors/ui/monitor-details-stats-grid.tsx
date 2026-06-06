import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface MonitorDetailsStatsGridProps {
  isLoading: boolean;
  uptimePct: number | null;
  p50Ms: number | null;
  p95Ms: number | null;
  p99Ms: number | null;
  totalChecks: number;
  downChecks: number;
  timeoutChecks: number;
  degradedChecks: number;
}

const fmt = (ms: number | null) => (ms !== null ? `${ms} ms` : '—');

const MonitorDetailsStatsGrid = ({
  isLoading,
  uptimePct,
  p50Ms,
  p95Ms,
  p99Ms,
  totalChecks,
  downChecks,
  timeoutChecks,
  degradedChecks,
}: MonitorDetailsStatsGridProps) => {
  const failedChecks = downChecks + timeoutChecks + degradedChecks;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Uptime (time-weighted)</CardDescription>
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : uptimePct !== null ? (
              `${uptimePct}%`
            ) : (
              '—'
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Latency p50 / p95 / p99</CardDescription>
          <CardTitle className="tabular-nums">
            {isLoading ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <span>
                {fmt(p50Ms)}
                <span className="mx-1 text-neutral-300">/</span>
                <span className={p95Ms !== null && p95Ms > 1000 ? 'text-yellow-600' : ''}>
                  {fmt(p95Ms)}
                </span>
                <span className="mx-1 text-neutral-300">/</span>
                <span className={p99Ms !== null && p99Ms > 2000 ? 'text-rose-600' : ''}>
                  {fmt(p99Ms)}
                </span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Total checks</CardDescription>
          <CardTitle>
            {isLoading ? <Skeleton className="h-7 w-16" /> : totalChecks}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-neutral-200 ring-0">
        <CardHeader className="gap-1">
          <CardDescription>Failed checks</CardDescription>
          <CardTitle className={failedChecks > 0 ? 'text-rose-600' : ''}>
            {isLoading ? <Skeleton className="h-7 w-16" /> : failedChecks}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export { MonitorDetailsStatsGrid };
