'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import type { Project } from '@/entities';
import { useChecksRealtime, type ChecksRealtimeEvent } from '@/entities';
import { useMonitors } from '@/entities/monitor';
import {
  CreateMonitorDialog,
  DeleteMonitorDialog,
  EditMonitorDialog,
  useDeleteMonitor,
  useEditMonitor,
  useMonitorSelection,
} from '@/features/monitor';
import type { Monitor } from '@/entities';
import type { PaginatedResponse } from '@/shared/api';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { getCookieValue } from '@/shared/lib/utils';
import { ListFooterBar } from '@/shared/ui/list-footer-bar';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';
import { MonitorList } from '@/widgets/monitors';

interface ProjectDetailsPageClientProps {
  project: Project;
}

const ProjectDetailsPageClient = ({ project }: ProjectDetailsPageClientProps) => {
  const params = useParams<{ workspaceSlug: string }>();
  const queryClient = useQueryClient();
  const workspaceSlug = params.workspaceSlug;
  const { page, perPage, setPage, listQuery } = useMonitors({ projectId: project.id });
  const monitors = listQuery.data?.data ?? [];

  const editMonitor = useEditMonitor();
  const deleteMonitor = useDeleteMonitor();
  const monitorSelection = useMonitorSelection({ monitors });
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    setWorkspaceId(getCookieValue(document.cookie, WORKSPACE_COOKIE_NAME));
  }, []);

  const handleCheckEvent = useCallback(
    (event: ChecksRealtimeEvent) => {
      if (!workspaceId || event.workspaceId !== workspaceId) {
        return;
      }

      queryClient.setQueriesData<PaginatedResponse<Monitor>>({ queryKey: ['monitors'] }, (cached) => {
        if (!cached?.data?.length) {
          return cached;
        }

        let changed = false;
        const updatedData = cached.data.map((monitor) => {
          if (monitor.id !== event.monitorId) {
            return monitor;
          }

          changed = true;
          return {
            ...monitor,
            lastCheckAt: event.monitor.lastCheckAt,
            lastStatus: event.monitor.lastStatus ?? undefined,
            lastLatencyMs: event.monitor.lastLatencyMs ?? undefined,
            lastCheck: event.check,
          };
        });

        if (!changed) {
          return cached;
        }

        return {
          ...cached,
          data: updatedData,
        };
      });
    },
    [queryClient, workspaceId]
  );

  useChecksRealtime({
    workspaceId,
    onEvent: handleCheckEvent,
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{project.name}</PageTitle>
        <CreateMonitorDialog projectId={project.id} projectName={project.name} />
      </PageHeader>
      <PageContent className="space-y-4">
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
          workspaceSlug={workspaceSlug}
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
      </PageContent>
    </PageContainer>
  );
};

export { ProjectDetailsPageClient };
