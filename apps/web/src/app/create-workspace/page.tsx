import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';
import { workspaceApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { CreateWorkspacePageClient } from './client';

export default async function CreateWorkspacePage() {
  try {
    await workspaceApi.list();
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      redirect(ROUTES.SIGN_IN);
    }
    throw error;
  }

  return <CreateWorkspacePageClient />;
}
