'use client';

import { useSettings } from '@/entities/workspace';
import {
  useAvatarUpload,
  useWorkspaceLogoUpload,
  useWorkspaceSettingsForm,
} from '@/features/workspace';
import { ProfileAvatarCard } from './ui/profile-avatar-card';
import { WorkspaceLogoActions } from './ui/workspace-logo-actions';
import { WorkspaceSettingsCard } from './ui/workspace-settings-card';

const SettingsPageContent = () => {
  const {
    workspaceQuery,
    updateWorkspaceMutation,
    uploadAvatarMutation,
    uploadWorkspaceLogoMutation,
  } = useSettings();

  const workspaceSettings = useWorkspaceSettingsForm({
    workspace: workspaceQuery.data,
    onSave: (payload) => updateWorkspaceMutation.mutateAsync(payload),
    isPending: updateWorkspaceMutation.isPending,
  });

  const workspaceLogoUpload = useWorkspaceLogoUpload({
    onUpload: (file) => uploadWorkspaceLogoMutation.mutateAsync(file),
    isPending: uploadWorkspaceLogoMutation.isPending,
  });

  const avatarUpload = useAvatarUpload({
    onUpload: (file) => uploadAvatarMutation.mutateAsync(file),
    isPending: uploadAvatarMutation.isPending,
  });

  return (
    <div className="space-y-4">
      <WorkspaceSettingsCard
        isLoading={workspaceQuery.isLoading}
        form={workspaceSettings.form}
        onSubmit={workspaceSettings.handleSubmit}
        isSubmitting={workspaceSettings.isSubmitting}
      >
        <WorkspaceLogoActions
          inputRef={workspaceLogoUpload.inputRef}
          onFileChange={workspaceLogoUpload.onFileChange}
          onSelect={workspaceLogoUpload.selectFile}
          onUpload={workspaceLogoUpload.uploadSelected}
          hasFile={workspaceLogoUpload.hasFile}
          fileName={workspaceLogoUpload.fileName}
          isUploading={workspaceLogoUpload.isSubmitting}
        />
      </WorkspaceSettingsCard>

      <ProfileAvatarCard
        inputRef={avatarUpload.inputRef}
        onFileChange={avatarUpload.onFileChange}
        onSelect={avatarUpload.selectFile}
        onUpload={avatarUpload.uploadSelected}
        hasFile={avatarUpload.hasFile}
        fileName={avatarUpload.fileName}
        isUploading={avatarUpload.isSubmitting}
      />
    </div>
  );
};

export { SettingsPageContent };
