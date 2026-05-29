import { projectApi } from '@/shared/api';
import { ProjectDetailsPageClient } from './page-client';

interface ProjectDetailsPageProps {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { projectSlug } = await params;
  const project = await projectApi.getBySlug(projectSlug);
  return <ProjectDetailsPageClient project={project} />;
}
