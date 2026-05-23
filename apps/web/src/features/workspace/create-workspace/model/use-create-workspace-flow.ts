'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileApi, setWorkspaceId, workspaceApi, getErrorMessage } from '@/shared/api';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { useSelectedFileRef } from '@/shared/lib/hooks/use-selected-file-ref';
import { createWorkspaceSchema } from '@/entities';
import type { CreateWorkspacePayload } from '@/entities';
import { toast } from 'sonner';

const WORKSPACE_FLOW_MESSAGES = {
  CREATE_SUCCESS: 'Workspace created',
  CREATE_FAILED: 'Failed to create workspace',
  LOGO_UPLOAD_FAILED: 'Workspace created, but logo upload failed',
} as const;

const WORKSPACE_SLUG_SEPARATOR = '-';

const normalizeSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, WORKSPACE_SLUG_SEPARATOR)
    .replace(/-+/g, WORKSPACE_SLUG_SEPARATOR)
    .replace(/^-|-$/g, '');
};

const persistWorkspaceSelection = (workspaceId: string) => {
  setWorkspaceId(workspaceId);
  document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
};

interface UseCreateWorkspaceFlowOptions {
  onSuccess?: () => void;
}

const useCreateWorkspaceFlow = ({ onSuccess }: UseCreateWorkspaceFlowOptions = {}) => {
  const router = useRouter();
  const logoFile = useSelectedFileRef();
  const [isPending, setIsPending] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm<CreateWorkspacePayload>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const workspaceName = form.watch('name');

  const slugPlaceholder = useMemo(() => normalizeSlug(workspaceName ?? ''), [workspaceName]);

  const onNameChange = (name: string) => {
    form.setValue('name', name, { shouldDirty: true, shouldValidate: true });

    if (!isSlugManuallyEdited) {
      form.setValue('slug', normalizeSlug(name), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const onSlugChange = (slug: string) => {
    setIsSlugManuallyEdited(true);
    form.setValue('slug', normalizeSlug(slug), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setIsPending(true);

    try {
      const payload: CreateWorkspacePayload = {
        name: values.name.trim(),
        slug: values.slug ? normalizeSlug(values.slug) : undefined,
      };

      const createdWorkspace = await workspaceApi.create(payload);
      persistWorkspaceSelection(createdWorkspace.id);

      const selectedLogoFile = logoFile.getFile();
      if (selectedLogoFile) {
        try {
          const uploadPayload = await workspaceApi.generateLogoUploadUrl({
            fileName: selectedLogoFile.name,
            contentType: selectedLogoFile.type || 'application/octet-stream',
          });

          await fileApi.upload(uploadPayload.uploadUrl, selectedLogoFile);
          await workspaceApi.updateCurrent({ logoUrl: uploadPayload.fileUrl });
        } catch {
          toast.warning(WORKSPACE_FLOW_MESSAGES.LOGO_UPLOAD_FAILED);
        }
      }

      toast.success(WORKSPACE_FLOW_MESSAGES.CREATE_SUCCESS);
      onSuccess?.();
      router.replace(`/${createdWorkspace.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, WORKSPACE_FLOW_MESSAGES.CREATE_FAILED));
    } finally {
      setIsPending(false);
    }
  });

  return {
    form,
    isPending,
    logoFile,
    slugPlaceholder,
    onNameChange,
    onSlugChange,
    onSubmit,
  };
};

export { useCreateWorkspaceFlow };
