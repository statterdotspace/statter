import { Globe, Link2, Timer } from 'lucide-react';
import type { Monitor } from '@/entities';
import { monitorStatusClass } from '@/entities/monitor';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

interface MonitorDetailsSummaryCardProps {
  monitor: Monitor;
}

const MonitorDetailsSummaryCard = ({ monitor }: MonitorDetailsSummaryCardProps) => {
  return (
    <Card className="rounded-2xl border border-neutral-200 bg-white ring-0">
      <CardHeader className="gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="truncate text-xl font-semibold text-neutral-900">
            {monitor.name}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn('capitalize border px-2 py-0.5', monitorStatusClass[monitor.status])}
          >
            {monitor.status}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'capitalize',
              monitor.lastCheck?.status === 'up'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            )}
          >
            last check: {monitor.lastCheck?.status ?? 'none'}
          </Badge>
        </div>
        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="size-3.5" />
            {monitor.url}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3.5" />
            {monitor.region.toUpperCase()} · {monitor.type.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Timer className="size-3.5" />
            every {monitor.intervalSeconds}s
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export { MonitorDetailsSummaryCard };
