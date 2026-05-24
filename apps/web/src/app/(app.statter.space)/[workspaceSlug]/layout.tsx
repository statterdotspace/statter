import { notFound, redirect } from 'next/navigation';
import { AxiosError } from 'axios';
import { WorkspaceContextInit } from '@/features/workspace';
import { AppSidebar, MainNavbar } from '@/widgets/navigation';
import { workspaceApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import type { Workspace } from '@/entities';

interface AppLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { workspaceSlug } = await params;

  let workspaces: Workspace[] = [];

  try {
    workspaces = await workspaceApi.list();
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
    <div className="h-screen w-full overflow-hidden bg-neutral-300/80 p-3">
      <WorkspaceContextInit workspaceId={selectedWorkspaceId} />
      <div className="mx-auto flex h-full max-w-[1920px] gap-2">
        <AppSidebar
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
          selectedWorkspaceSlug={selectedWorkspaceSlug}
        />
        <MainNavbar workspaceSlug={selectedWorkspaceSlug} />
        {children}
      </div>
    </div>
  );
}
