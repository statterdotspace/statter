'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Monitor } from '@/entities';
import { getErrorMessage, monitorApi } from '@/shared/api';
import { toast } from 'sonner';

interface UseDeleteMonitorOptions {
  monitorId?: string;
}

const useDeleteMonitor = ({ monitorId }: UseDeleteMonitorOptions = {}) => {
  const queryClient = useQueryClient();
  const [deletingMonitor, setDeletingMonitor] = useState<Monitor | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => monitorApi.remove(id),
    onSuccess: async () => {
      toast.success('Monitor deleted');
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const reset = () => {
    setDeletingMonitor(null);
  };

  const openForDelete = (monitor: Monitor) => {
    setDeletingMonitor(monitor);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
  };

  const handleConfirm = async () => {
    const targetMonitorId = deletingMonitor?.id ?? monitorId;
    if (!targetMonitorId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(targetMonitorId);
      reset();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return {
    monitor: deletingMonitor,
    isOpen: Boolean(deletingMonitor),
    openForDelete,
    handleOpenChange,
    handleConfirm,
    reset,
    isSubmitting: deleteMutation.isPending,
  };
};

export { useDeleteMonitor };
