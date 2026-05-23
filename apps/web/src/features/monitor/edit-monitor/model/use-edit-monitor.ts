'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createMonitorSchema } from '@/entities';
import type { Monitor } from '@/entities';
import { getErrorMessage, monitorApi } from '@/shared/api';
import type { EditMonitorPayload } from '../../shared/model/types';
import { toast } from 'sonner';

const editMonitorSchema = createMonitorSchema.omit({ projectId: true });

const editMonitorDefaults: EditMonitorPayload = {
  name: '',
  description: '',
  url: '',
  type: 'https',
  region: 'eu',
  intervalSeconds: 60,
  timeoutMs: 10000,
  expectedStatus: 200,
  status: 'active',
};

interface UseEditMonitorOptions {
  monitorId?: string;
}

const useEditMonitor = ({ monitorId }: UseEditMonitorOptions = {}) => {
  const queryClient = useQueryClient();
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const updateMutation = useMutation({
    mutationFn: ({ monitorId: id, payload }: { monitorId: string; payload: EditMonitorPayload }) =>
      monitorApi.update(id, payload),
    onSuccess: async () => {
      toast.success('Monitor updated');
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const form = useForm<EditMonitorPayload>({
    resolver: zodResolver(editMonitorSchema),
    defaultValues: editMonitorDefaults,
  });

  const reset = () => {
    form.reset(editMonitorDefaults);
  };

  const close = () => {
    setEditingMonitor(null);
    reset();
  };

  const openForEdit = (monitor: Monitor) => {
    setEditingMonitor(monitor);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  useEffect(() => {
    if (!editingMonitor) {
      reset();
      return;
    }

    form.reset({
      name: editingMonitor.name,
      description: editingMonitor.description ?? '',
      url: editingMonitor.url,
      type: editingMonitor.type,
      region: editingMonitor.region,
      intervalSeconds: editingMonitor.intervalSeconds,
      timeoutMs: editingMonitor.timeoutMs,
      expectedStatus: editingMonitor.expectedStatus,
      status: editingMonitor.status,
    });
  }, [editingMonitor]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const targetMonitorId = editingMonitor?.id ?? monitorId;
    if (!targetMonitorId) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        monitorId: targetMonitorId,
        payload: values,
      });

      close();
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  return {
    form,
    monitor: editingMonitor,
    isOpen: Boolean(editingMonitor),
    handleOpenChange,
    handleSubmit,
    openForEdit,
    close,
    reset,
    isSubmitting: updateMutation.isPending,
  };
};

export { useEditMonitor };
