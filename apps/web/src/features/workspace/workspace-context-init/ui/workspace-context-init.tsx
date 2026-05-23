'use client';

import { useEffect } from 'react';
import { setWorkspaceId } from '@/shared/api';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';

interface WorkspaceContextInitProps {
  workspaceId: string;
}

const WorkspaceContextInit = ({ workspaceId }: WorkspaceContextInitProps) => {
  setWorkspaceId(workspaceId);

  useEffect(() => {
    setWorkspaceId(workspaceId);
    document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
  }, [workspaceId]);

  return null;
};

export { WorkspaceContextInit };
