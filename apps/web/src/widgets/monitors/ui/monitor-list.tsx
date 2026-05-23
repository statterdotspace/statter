import type { Monitor } from '@/entities';
import { Skeleton } from '@/shared/ui/skeleton';
import { MonitorListItem } from './monitor-list-item';

interface MonitorListProps {
  isLoading: boolean;
  monitors: Monitor[];
  selectedMonitorIds: ReadonlySet<string>;
  onToggleSelect: (monitorId: string, checked: boolean) => void;
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
}

const MonitorList = ({
  isLoading,
  monitors,
  selectedMonitorIds,
  onToggleSelect,
  onEdit,
  onDelete,
}: MonitorListProps) => {
  return (
    <section className="space-y-3">
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      ) : (
        <>
          {monitors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
              No monitors yet.
            </div>
          ) : (
            <div className="space-y-3">
              {monitors.map((monitor) => (
                <MonitorListItem
                  key={monitor.id}
                  monitor={monitor}
                  isSelected={selectedMonitorIds.has(monitor.id)}
                  onToggleSelect={onToggleSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export { MonitorList };
