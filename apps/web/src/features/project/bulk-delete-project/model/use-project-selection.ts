'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project } from '@/entities';
import { getErrorMessage, projectApi } from '@/shared/api';
import { toast } from 'sonner';

interface UseProjectSelectionOptions {
  projects: Project[];
}

const useProjectSelection = ({ projects }: UseProjectSelectionOptions) => {
  const queryClient = useQueryClient();
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());
  const [isDeletingSelection, setIsDeletingSelection] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: (projectId: string) => projectApi.remove(projectId),
  });

  useEffect(() => {
    setSelectedProjectIds((previous) => {
      if (!previous.size) {
        return previous;
      }

      const projectIds = new Set(projects.map((project) => project.id));
      const next = new Set(Array.from(previous).filter((projectId) => projectIds.has(projectId)));
      return next.size === previous.size ? previous : next;
    });
  }, [projects]);

  const handleToggleSelection = (projectId: string, checked: boolean) => {
    setSelectedProjectIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(projectId);
      } else {
        next.delete(projectId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedProjectIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (!selectedProjectIds.size || isDeletingSelection) {
      return;
    }

    setIsBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (!selectedProjectIds.size || isDeletingSelection) {
      return;
    }

    setIsDeletingSelection(true);

    try {
      const projectIds = Array.from(selectedProjectIds);
      const results = await Promise.allSettled(
        projectIds.map((projectId) => deleteMutation.mutateAsync(projectId))
      );
      const failed = results.filter((result) => result.status === 'rejected').length;
      if (failed === 0) {
        toast.success('Selected projects deleted');
      } else if (failed === projectIds.length) {
        toast.error('Failed to delete selected projects');
      } else {
        toast.warning('Some projects could not be deleted');
      }

      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      clearSelection();
      setIsBulkDeleteDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeletingSelection(false);
    }
  };

  return {
    selectedProjectIds,
    isDeletingSelection,
    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,
    handleToggleSelection,
    clearSelection,
    handleDeleteSelected,
    handleBulkDeleteConfirm,
  };
};

export { useProjectSelection };
