'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage, workspaceApi } from '@/shared/api';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';
import { CopyInviteLink, InviteMembersDialog, WorkspaceMembersSettings } from '@/widgets/settings';
import { toast } from 'sonner';

const MEMBERS_PAGE_SIZE = 10;

const SettingsMembersPageClient = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [processingRowId, setProcessingRowId] = useState<string | null>(null);

  const membersQuery = useQuery({
    queryKey: ['workspace-members', page, MEMBERS_PAGE_SIZE],
    queryFn: () =>
      workspaceApi.listMembers({
        page,
        perPage: MEMBERS_PAGE_SIZE,
      }),
  });

  const revokeInvitationMutation = useMutation({
    mutationFn: (invitationId: string) => workspaceApi.revokeInvitation(invitationId),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => workspaceApi.removeMember(memberId),
  });

  const refreshMembers = async () => {
    await queryClient.invalidateQueries({ queryKey: ['workspace-members'] });
  };

  const handleRevokeInvitation = async (invitationId: string) => {
    setProcessingRowId(invitationId);

    try {
      await revokeInvitationMutation.mutateAsync(invitationId);
      toast.success('Invitation revoked.');
      await refreshMembers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessingRowId(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setProcessingRowId(memberId);

    try {
      await removeMemberMutation.mutateAsync(memberId);
      toast.success('Member removed.');
      await refreshMembers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessingRowId(null);
    }
  };

  useEffect(() => {
    const totalPages = membersQuery.data?.meta.totalPages ?? 1;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [membersQuery.data?.meta.totalPages, page]);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Members</PageTitle>
        <div className="flex items-center gap-2">
          <InviteMembersDialog onInvited={refreshMembers} />
          <CopyInviteLink />
        </div>
      </PageHeader>

      <PageContent>
        <WorkspaceMembersSettings
          rows={membersQuery.data?.data ?? []}
          meta={membersQuery.data?.meta}
          isLoading={membersQuery.isLoading}
          processingRowId={processingRowId}
          onRevoke={handleRevokeInvitation}
          onRemove={handleRemoveMember}
          onPageChange={setPage}
        />
      </PageContent>
    </PageContainer>
  );
};

export { SettingsMembersPageClient };

