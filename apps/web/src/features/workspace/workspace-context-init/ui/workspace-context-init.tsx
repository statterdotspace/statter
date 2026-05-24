'use client';

import { useEffect } from 'react';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';

interface WorkspaceContextInitProps {
  workspaceId: string;
}

const WorkspaceContextInit = ({ workspaceId }: WorkspaceContextInitProps) => {
  useEffect(() => {
    document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
  }, [workspaceId]);

  return null;
};

export { WorkspaceContextInit };
