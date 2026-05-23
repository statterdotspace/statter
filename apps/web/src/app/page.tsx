import { AxiosError } from 'axios';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverApi } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';
import type { Workspace } from '@/entities';

export default async function RootPage() {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const cookieHeader = headerStore.get('cookie') ?? '';

  let workspaces: Workspace[] = [];

  try {
    workspaces = await serverApi.listWorkspaces(cookieHeader);
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      redirect(ROUTES.SIGN_IN);
    }

    throw err;
  }

  if (!workspaces.length) {
    redirect(ROUTES.CREATE_WORKSPACE);
  }

  const workspaceIdFromCookie = cookieStore.get(WORKSPACE_COOKIE_NAME)?.value;
  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === workspaceIdFromCookie) ?? workspaces[0];

  if (!selectedWorkspace?.slug) {
    redirect(ROUTES.SIGN_IN);
  }

  redirect(`/${selectedWorkspace.slug}`);
}
