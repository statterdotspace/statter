'use client';

import { useRouter } from 'next/navigation';
import { workspaceApi } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';

const useAuthSuccessRedirect = () => {
  const router = useRouter();

  const redirectAfterAuth = async () => {
    const workspaces = await workspaceApi.list();
    const firstWorkspace = workspaces[0];

    if (!firstWorkspace) {
      router.replace(ROUTES.CREATE_WORKSPACE);
      router.refresh();
      return;
    }

    document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(firstWorkspace.id)};path=/;max-age=31536000;samesite=lax`;

    router.replace(`/${firstWorkspace.slug}`);
    router.refresh();
  };

  return { redirectAfterAuth };
};

export { useAuthSuccessRedirect };
