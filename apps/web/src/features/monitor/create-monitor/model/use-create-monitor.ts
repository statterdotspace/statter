'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getErrorMessage, monitorApi } from '@/shared/api';
import { createMonitorSchema } from '@/entities';
import { createMonitorDefaults } from '@/entities/monitor';
import type { CreateMonitorPayload } from '@/entities';
import { toast } from 'sonner';

interface UseCreateMonitorOptions {
  projectId?: string;
}

const useCreateMonitor = ({ projectId }: UseCreateMonitorOptions = {}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const createDefaults = useMemo<CreateMonitorPayload>(
    () => ({
      ...createMonitorDefaults,
      projectId: projectId ?? '',
    }),
    [projectId]
  );

  const form = useForm<CreateMonitorPayload>({
    resolver: zodResolver(createMonitorSchema),
    defaultValues: createDefaults,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateMonitorPayload) => monitorApi.create(payload),
    onSuccess: async () => {
      toast.success('Monitor created');
      await queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const reset = () => {
    form.reset(createDefaults);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }

    setIsOpen(open);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync(values);
      handleOpenChange(false);
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  return {
    form,
    isOpen,
    handleOpenChange,
    handleSubmit,
    isSubmitting: createMutation.isPending,
    reset,
  };
};

export { useCreateMonitor };
