import Link from 'next/link';
import { Globe, Link2 } from 'lucide-react';
import type { Monitor } from '@/entities';
import { Checkbox } from '@/shared/ui/checkbox';
import { monitorStatusClass, uptimeFromId } from '@/entities/monitor';
import { MonitorActionsMenu } from './monitor-actions-menu';
import { UptimeBar } from './uptime-bar';

interface MonitorListItemProps {
  monitor: Monitor;
  workspaceSlug: string;
  isSelected: boolean;
  onToggleSelect: (monitorId: string, checked: boolean) => void;
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
}

const MonitorListItem = ({
  monitor,
  workspaceSlug,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: MonitorListItemProps) => {
  const uptime = uptimeFromId(monitor.id);

  return (
    <article className="group flex items-start gap-3 rounded-2xl border border-neutral-200 px-4 py-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50/40">
      <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center">
        <Checkbox
          aria-label={`Select ${monitor.name}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect(monitor.id, checked === true)}
          className="size-11 rounded-full border-neutral-300 bg-transparent opacity-70 transition-opacity group-hover:opacity-100 data-checked:border-neutral-900 data-checked:bg-neutral-900 data-checked:text-white [&_[data-slot=checkbox-indicator]>svg]:size-5"
        />
      </div>

      <Link
        href={`/${workspaceSlug}/monitors/${monitor.id}`}
        className="min-w-0 flex-1 space-y-2.5 px-1 py-0.5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate hover:text-primary transition-colors text-lg leading-none font-semibold text-neutral-900">
            {monitor.name}
          </p>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${monitorStatusClass[monitor.status]}`}
          >
            {monitor.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="size-3.5" />
            <span className="max-w-[520px] truncate">{monitor.url}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3.5" />
            {monitor.region.toUpperCase()} · {monitor.type.toUpperCase()}
          </span>
        </div>

        <UptimeBar uptime={uptime} seed={monitor.id} />
      </Link>

      <MonitorActionsMenu onEdit={() => onEdit(monitor)} onDelete={() => onDelete(monitor)} />
    </article>
  );
};

export { MonitorListItem };
