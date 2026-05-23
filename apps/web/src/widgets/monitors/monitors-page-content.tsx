'use client';

import {
  DeleteMonitorDialog,
  EditMonitorDialog,
  useDeleteMonitor,
  useEditMonitor,
  useMonitorSelection,
} from '@/features/monitor';
import { MonitorList } from './ui/monitor-list';
import { ListFooterBar } from '@/shared/ui/list-footer-bar';
import { useMonitors } from '@/entities/monitor';

interface MonitorsPageContentProps {
  projectId?: string;
}

const MonitorsPageContent = ({ projectId }: MonitorsPageContentProps) => {
  const { page, perPage, setPage, listQuery } = useMonitors({
    projectId,
  });
  const monitors = listQuery.data?.data ?? [];

  const editMonitor = useEditMonitor();
  const deleteMonitor = useDeleteMonitor();
  const monitorSelection = useMonitorSelection({ monitors });

  return (
    <div className="space-y-4">
      <EditMonitorDialog
        isOpen={editMonitor.isOpen}
        onOpenChange={editMonitor.handleOpenChange}
        form={editMonitor.form}
        onSubmit={editMonitor.handleSubmit}
        isSubmitting={editMonitor.isSubmitting}
      />

      <DeleteMonitorDialog
        isOpen={deleteMonitor.isOpen}
        monitor={deleteMonitor.monitor}
        onOpenChange={deleteMonitor.handleOpenChange}
        onConfirm={deleteMonitor.handleConfirm}
        isSubmitting={deleteMonitor.isSubmitting}
      />

      <DeleteMonitorDialog
        isOpen={monitorSelection.isBulkDeleteDialogOpen}
        monitor={null}
        selectedCount={monitorSelection.selectedMonitorIds.size}
        onOpenChange={monitorSelection.setIsBulkDeleteDialogOpen}
        onConfirm={monitorSelection.handleBulkDeleteConfirm}
        isSubmitting={monitorSelection.isDeletingSelection}
      />

      <MonitorList
        isLoading={listQuery.isLoading}
        monitors={monitors}
        selectedMonitorIds={monitorSelection.selectedMonitorIds}
        onToggleSelect={monitorSelection.handleToggleSelection}
        onEdit={editMonitor.openForEdit}
        onDelete={deleteMonitor.openForDelete}
      />

      {listQuery.data?.meta ? (
        <ListFooterBar
          selectedCount={monitorSelection.selectedMonitorIds.size}
          itemLabel="monitors"
          isDeletingSelection={monitorSelection.isDeletingSelection}
          onClearSelection={monitorSelection.clearSelection}
          onDeleteSelected={monitorSelection.handleDeleteSelected}
          page={page}
          perPage={perPage}
          total={listQuery.data.meta.total}
          totalPages={listQuery.data.meta.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
};

export { MonitorsPageContent };
