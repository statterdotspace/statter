'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { createProjectSchema } from '@/entities';
import type { Project } from '@/entities';
import { getErrorMessage, projectApi } from '@/shared/api';
import type { ProjectFormValues } from '../../shared/model/types';
import { toast } from 'sonner';

const editProjectDefaults: ProjectFormValues = {
  name: '',
  description: '',
};

interface UseEditProjectOptions {
  projectId?: string;
}

const useEditProject = ({ projectId }: UseEditProjectOptions = {}) => {
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const updateMutation = useMutation({
    mutationFn: ({ projectId: id, payload }: { projectId: string; payload: ProjectFormValues }) =>
      projectApi.update(id, payload),
    onSuccess: async () => {
      toast.success('Project updated');
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: editProjectDefaults,
  });

  const reset = () => {
    form.reset(editProjectDefaults);
  };

  const close = () => {
    setEditingProject(null);
    reset();
  };

  const openForEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  useEffect(() => {
    if (!editingProject) {
      reset();
      return;
    }

    form.reset({
      name: editingProject.name,
      description: editingProject.description ?? '',
    });
  }, [editingProject]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const targetProjectId = editingProject?.id ?? projectId;
    if (!targetProjectId) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        projectId: targetProjectId,
        payload: values,
      });

      close();
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  return {
    form,
    project: editingProject,
    isOpen: Boolean(editingProject),
    handleOpenChange,
    handleSubmit,
    openForEdit,
    close,
    reset,
    isSubmitting: updateMutation.isPending,
  };
};

export { useEditProject };
