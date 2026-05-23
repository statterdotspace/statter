'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getErrorMessage, projectApi } from '@/shared/api';
import { createProjectSchema } from '@/entities';
import type { CreateProjectPayload } from '@/entities';
import { toast } from 'sonner';

const createProjectDefaults: CreateProjectPayload = {
  name: '',
  description: '',
};

const useCreateProject = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateProjectPayload>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: createProjectDefaults,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectApi.create(payload),
    onSuccess: async () => {
      toast.success('Project created');
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const reset = () => {
    form.reset(createProjectDefaults);
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

export { useCreateProject };
