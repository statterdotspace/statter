'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fileApi, getErrorMessage, userApi, workspaceApi } from '@/shared/api';
import type { UpdateWorkspacePayload } from './types';
import { toast } from 'sonner';

const useSettings = () => {
  const queryClient = useQueryClient();

  const workspaceQuery = useQuery({
    queryKey: ['workspace-current'],
    queryFn: () => workspaceApi.getCurrent(),
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: (payload: UpdateWorkspacePayload) => workspaceApi.updateCurrent(payload),
    onSuccess: async () => {
      toast.success('Workspace updated');
      await queryClient.invalidateQueries({ queryKey: ['workspace-current'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const payload = await userApi.generateAvatarUploadUrl({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      });

      await fileApi.upload(payload.uploadUrl, file);
      return await userApi.updateAvatar({ avatarUrl: payload.fileUrl });
    },
    onSuccess: () => {
      toast.success('Avatar updated');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const uploadWorkspaceLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const payload = await workspaceApi.generateLogoUploadUrl({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
      });

      await fileApi.upload(payload.uploadUrl, file);
      return await workspaceApi.updateCurrent({ logoUrl: payload.fileUrl });
    },
    onSuccess: async () => {
      toast.success('Workspace logo updated');
      await queryClient.invalidateQueries({ queryKey: ['workspace-current'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return {
    workspaceQuery,
    updateWorkspaceMutation,
    uploadAvatarMutation,
    uploadWorkspaceLogoMutation,
  };
};

export { useSettings };
