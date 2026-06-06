import { notFound, redirect } from 'next/navigation';
import { AxiosError } from 'axios';
import { WorkspaceContextInit } from '@/features/workspace';
import { AppSidebar } from '@/widgets/navigation';
import { userApi, workspaceApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import type { User, Workspace } from '@/entities';

interface AppLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { workspaceSlug } = await params;

  let workspaces: Workspace[] = [];
  let currentUser: User | null = null;

  try {
    [workspaces, currentUser] = await Promise.all([
      workspaceApi.list(),
      userApi.getMe(),
    ]);
  } catch (err) {
    console.log(err);
    if (err instanceof AxiosError && err.response?.status === 401) {
      redirect(ROUTES.SIGN_IN);
    }
  }

  if (!workspaces.length) {
    redirect(ROUTES.CREATE_WORKSPACE);
  }

  if (!workspaceSlug) {
    redirect(ROUTES.CREATE_WORKSPACE);
  }

  const selectedWorkspace = workspaces.find((workspace) => workspace.slug === workspaceSlug);
  if (!selectedWorkspace) {
    notFound();
  }

  const selectedWorkspaceId = selectedWorkspace.id;
  const selectedWorkspaceSlug = selectedWorkspace.slug;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <WorkspaceContextInit workspaceId={selectedWorkspaceId} />
      <AppSidebar
        workspaces={workspaces}
        selectedWorkspaceId={selectedWorkspaceId}
        selectedWorkspaceSlug={selectedWorkspaceSlug}
        currentUser={currentUser}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
