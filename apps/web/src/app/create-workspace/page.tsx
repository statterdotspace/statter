import { AxiosError } from 'axios';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { CreateWorkspacePageClient } from './page-client';

export default async function CreateWorkspacePage() {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie') ?? '';

  try {
    await serverApi.listWorkspaces(cookieHeader);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      redirect(ROUTES.SIGN_IN);
    }

    throw error;
  }

  return <CreateWorkspacePageClient />;
}
