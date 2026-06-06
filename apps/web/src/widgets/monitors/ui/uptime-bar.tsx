import type { StatsDailyUptime } from '@/entities';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

type SegmentStatus = 'up' | 'degraded' | 'down' | 'nodata';

function segmentStatus(uptimePct: number): SegmentStatus {
  if (uptimePct >= 99.9) return 'up';
  if (uptimePct >= 95) return 'degraded';
  return 'down';
}

const segmentClass: Record<SegmentStatus, string> = {
  up: 'bg-emerald-500',
  degraded: 'bg-yellow-400',
  down: 'bg-rose-500',
  nodata: 'bg-neutral-200',
};

interface UptimeBarProps {
  dailyUptime: StatsDailyUptime[];
}

const UptimeBar = ({ dailyUptime }: UptimeBarProps) => {
  // Build a 30-slot array (oldest → newest), filling missing days with nodata
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const byDay = new Map(
    dailyUptime.map((d) => {
      const day = new Date(d.day);
      day.setHours(0, 0, 0, 0);
      return [day.getTime(), d];
    })
  );

  const segments = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (29 - i));
    const data = byDay.get(day.getTime());
    return { day, data };
  });

  return (
    <div className="flex h-6 items-end gap-[2px]">
      {segments.map(({ day, data }, i) => {
        const status: SegmentStatus = data ? segmentStatus(data.uptimePct) : 'nodata';
        const label = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const tooltip = data
          ? `${label} — ${data.uptimePct}% uptime (${data.totalChecks} checks)`
          : `${label} — no data`;

        return (
          <Tooltip key={i}>
            <TooltipTrigger>
              <div className={`h-5 w-2 rounded-sm cursor-default ${segmentClass[status]}`} />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export { UptimeBar };
