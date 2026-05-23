'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateWorkspaceSchema } from '@/entities';
import type { UpdateWorkspacePayload, Workspace } from '@/entities';

const workspaceSettingsDefaults: UpdateWorkspacePayload = {
  name: '',
  slug: '',
};

interface UseWorkspaceSettingsFormOptions {
  workspace?: Workspace;
  onSave: (payload: UpdateWorkspacePayload) => Promise<unknown>;
  isPending: boolean;
}

const useWorkspaceSettingsForm = ({
  workspace,
  onSave,
  isPending,
}: UseWorkspaceSettingsFormOptions) => {
  const form = useForm<UpdateWorkspacePayload>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: workspaceSettingsDefaults,
  });

  const reset = () => {
    if (!workspace) {
      form.reset(workspaceSettingsDefaults);
      return;
    }

    form.reset({ name: workspace.name, slug: workspace.slug });
  };

  useEffect(() => {
    reset();
  }, [workspace]);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: isPending,
    reset,
  };
};

export { useWorkspaceSettingsForm };
