'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Monitor } from '@/entities';
import { getErrorMessage, monitorApi } from '@/shared/api';
import { toast } from 'sonner';

interface UseMonitorSelectionOptions {
  monitors: Monitor[];
}

const useMonitorSelection = ({ monitors }: UseMonitorSelectionOptions) => {
  const queryClient = useQueryClient();
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<Set<string>>(new Set());
  const [isDeletingSelection, setIsDeletingSelection] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: (monitorId: string) => monitorApi.remove(monitorId),
  });

  useEffect(() => {
    setSelectedMonitorIds((previous) => {
      if (!previous.size) {
        return previous;
      }

      const monitorIds = new Set(monitors.map((monitor) => monitor.id));
      const next = new Set(Array.from(previous).filter((monitorId) => monitorIds.has(monitorId)));
      return next.size === previous.size ? previous : next;
    });
  }, [monitors]);

  const handleToggleSelection = (monitorId: string, checked: boolean) => {
    setSelectedMonitorIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(monitorId);
      } else {
        next.delete(monitorId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedMonitorIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (!selectedMonitorIds.size || isDeletingSelection) {
      return;
    }

    setIsBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (!selectedMonitorIds.size || isDeletingSelection) {
      return;
    }

    setIsDeletingSelection(true);

    try {
      const monitorIds = Array.from(selectedMonitorIds);
      const results = await Promise.allSettled(
        monitorIds.map((monitorId) => deleteMutation.mutateAsync(monitorId))
      );
      const failed = results.filter((result) => result.status === 'rejected').length;
      if (failed === 0) {
        toast.success('Selected monitors deleted');
      } else if (failed === monitorIds.length) {
        toast.error('Failed to delete selected monitors');
      } else {
        toast.warning('Some monitors could not be deleted');
      }
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
      clearSelection();
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeletingSelection(false);
    }
  };

  return {
    selectedMonitorIds,
    isDeletingSelection,
    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,
    handleToggleSelection,
    clearSelection,
    handleDeleteSelected,
    handleBulkDeleteConfirm,
  };
};

export { useMonitorSelection };
