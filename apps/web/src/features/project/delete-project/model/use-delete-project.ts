'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project } from '@/entities';
import { getErrorMessage, projectApi } from '@/shared/api';
import { toast } from 'sonner';

interface UseDeleteProjectOptions {
  projectId?: string;
}

const useDeleteProject = ({ projectId }: UseDeleteProjectOptions = {}) => {
  const queryClient = useQueryClient();
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectApi.remove(id),
    onSuccess: async () => {
      toast.success('Project deleted');
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const reset = () => {
    setDeletingProject(null);
  };

  const openForDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
  };

  const handleConfirm = async () => {
    const targetProjectId = deletingProject?.id ?? projectId;
    if (!targetProjectId) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(targetProjectId);
      reset();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return {
    project: deletingProject,
    isOpen: Boolean(deletingProject),
    openForDelete,
    handleOpenChange,
    handleConfirm,
    reset,
    isSubmitting: deleteMutation.isPending,
  };
};

export { useDeleteProject };
