'use client';

import type { Project } from '@/entities';
import { CreateMonitorDialog } from '@/features/monitor';
import { MonitorsPageContent } from '@/widgets/monitors';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

interface ProjectDetailsPageClientProps {
  project: Project;
}

const ProjectDetailsPageClient = ({ project }: ProjectDetailsPageClientProps) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{project.name}</PageTitle>
        <CreateMonitorDialog projectId={project.id} projectName={project.name} />
      </PageHeader>
      <PageContent className="space-y-4">
        <MonitorsPageContent projectId={project.id} />
      </PageContent>
    </PageContainer>
  );
};

export { ProjectDetailsPageClient };
