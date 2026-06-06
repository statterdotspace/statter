'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '@/entities/workspace';
import { useWorkspaceLogoUpload, useWorkspaceSettingsForm } from '@/features/workspace';
import { workspaceApi } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { PageContainer, PageContent } from '@/shared/ui/page-wrapper';
import { WorkspaceGeneralSettings } from '@/widgets/settings';

const SettingsPageClient = () => {
  const router = useRouter();
  const params = useParams<{ workspaceSlug: string }>();
  const currentWorkspaceSlug = params?.workspaceSlug;

  const {
    workspaceQuery,
    updateWorkspaceMutation,
    uploadWorkspaceLogoMutation,
    deleteWorkspaceMutation,
  } = useSettings();

  const workspaceSettings = useWorkspaceSettingsForm({
    workspace: workspaceQuery.data,
    onSave: async (payload) => {
      const updatedWorkspace = await updateWorkspaceMutation.mutateAsync(payload);

      if (payload.slug && updatedWorkspace.slug && updatedWorkspace.slug !== currentWorkspaceSlug) {
        router.replace(`/${updatedWorkspace.slug}/settings`);
        router.refresh();
        return updatedWorkspace;
      }

      router.refresh();
      return updatedWorkspace;
    },
    isPending: updateWorkspaceMutation.isPending,
  });

  const workspaceLogoUpload = useWorkspaceLogoUpload({
    onUpload: async (file) => {
      await uploadWorkspaceLogoMutation.mutateAsync(file);
      router.refresh();
    },
    isPending: uploadWorkspaceLogoMutation.isPending,
  });

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspaceMutation.mutateAsync();
      document.cookie = `${WORKSPACE_COOKIE_NAME}=;path=/;max-age=0;samesite=lax`;

      const workspaces = await workspaceApi.list();
      const nextWorkspace = workspaces[0];

      if (!nextWorkspace) {
        router.replace(ROUTES.CREATE_WORKSPACE);
        router.refresh();
        return;
      }

      document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(nextWorkspace.id)};path=/;max-age=31536000;samesite=lax`;
      router.replace(`/${nextWorkspace.slug}/settings`);
      router.refresh();
    } catch {
      // Mutation hook handles toast errors.
    }
  };

  return (
    <PageContainer>
      <PageContent>
        <WorkspaceGeneralSettings
          workspaceName={workspaceSettings.workspaceName}
          workspaceSlug={workspaceSettings.workspaceSlug}
          workspaceLogoUrl={workspaceQuery.data?.logoUrl ?? null}
          isLoading={workspaceQuery.isLoading}
          isSaving={workspaceSettings.isSubmitting}
          isUploadingLogo={workspaceLogoUpload.isSubmitting}
          isDeleting={deleteWorkspaceMutation.isPending}
          onWorkspaceNameChange={workspaceSettings.onWorkspaceNameChange}
          onWorkspaceSlugChange={workspaceSettings.onWorkspaceSlugChange}
          onSaveWorkspaceName={workspaceSettings.handleSaveWorkspaceName}
          onSaveWorkspaceSlug={workspaceSettings.handleSaveWorkspaceSlug}
          logoInputRef={workspaceLogoUpload.inputRef}
          onLogoFileChange={workspaceLogoUpload.onFileChange}
          onSelectLogo={workspaceLogoUpload.selectFile}
          onUploadLogo={workspaceLogoUpload.uploadSelected}
          hasSelectedLogo={workspaceLogoUpload.hasFile}
          selectedLogoFileName={workspaceLogoUpload.fileName}
          onConfirmDelete={handleDeleteWorkspace}
        />
      </PageContent>
    </PageContainer>
  );
};

export { SettingsPageClient };
