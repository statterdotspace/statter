import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { workspaceApi } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';
import type { Workspace } from '@/entities';

export default async function RootPage() {
  const cookieStore = await cookies();

  let workspaces: Workspace[] = [];

  try {
    workspaces = await workspaceApi.list();
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
