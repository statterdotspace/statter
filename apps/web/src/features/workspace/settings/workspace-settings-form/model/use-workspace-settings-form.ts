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

const WORKSPACE_NAME_MAX_LENGTH = 32;
const WORKSPACE_SLUG_MAX_LENGTH = 48;
const WORKSPACE_SLUG_SEPARATOR = '-';

const normalizeWorkspaceName = (value: string): string => {
  return value.slice(0, WORKSPACE_NAME_MAX_LENGTH);
};

const normalizeWorkspaceSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, WORKSPACE_SLUG_SEPARATOR)
    .replace(/-+/g, WORKSPACE_SLUG_SEPARATOR)
    .replace(/^-|-$/g, '')
    .slice(0, WORKSPACE_SLUG_MAX_LENGTH);
};

interface UseWorkspaceSettingsFormOptions {
  workspace?: Workspace;
  onSave: (payload: UpdateWorkspacePayload) => Promise<Workspace>;
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

  const workspaceName = form.watch('name') ?? '';
  const workspaceSlug = form.watch('slug') ?? '';

  const onWorkspaceNameChange = (value: string) => {
    form.setValue('name', normalizeWorkspaceName(value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onWorkspaceSlugChange = (value: string) => {
    form.setValue('slug', normalizeWorkspaceSlug(value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSaveWorkspaceName = form.handleSubmit(async (values) => {
    const name = values.name?.trim() ?? '';
    if (!name) {
      form.setError('name', {
        type: 'validate',
        message: 'Workspace name is required',
      });
      return;
    }

    try {
      await onSave({ name });
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  const handleSaveWorkspaceSlug = form.handleSubmit(async (values) => {
    const slug = normalizeWorkspaceSlug(values.slug ?? '');
    if (!slug) {
      form.setError('slug', {
        type: 'validate',
        message: 'Workspace slug is required',
      });
      return;
    }

    form.setValue('slug', slug, {
      shouldDirty: true,
      shouldValidate: true,
    });

    try {
      await onSave({ slug });
    } catch {
      // Mutation hook handles toast errors.
    }
  });

  return {
    form,
    workspaceName,
    workspaceSlug,
    onWorkspaceNameChange,
    onWorkspaceSlugChange,
    handleSaveWorkspaceName,
    handleSaveWorkspaceSlug,
    isSubmitting: isPending,
    reset,
  };
};

export { useWorkspaceSettingsForm };
