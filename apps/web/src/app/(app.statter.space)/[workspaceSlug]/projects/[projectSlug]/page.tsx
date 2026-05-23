import { AxiosError } from 'axios';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { serverApi } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { ProjectDetailsPageClient } from './page-client';

interface ProjectDetailsPageProps {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const headerStore = await headers();
  const cookieHeader = headerStore.get('cookie') ?? '';
  const { workspaceSlug, projectSlug } = await params;

  try {
    const workspace = await serverApi.getWorkspaceBySlug(workspaceSlug, cookieHeader);
    if (!workspace) {
      notFound();
    }

    const project = await serverApi.getProjectBySlug({
      cookieHeader,
      workspaceId: workspace.id,
      projectSlug,
    });
    return <ProjectDetailsPageClient project={project} />;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        redirect(ROUTES.SIGN_IN);
      }

      if (error.response?.status === 404) {
        notFound();
      }
    }

    throw error;
  }
}
