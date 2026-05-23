import { CreateProjectDialog } from '@/features/project';
import { ProjectsDashboard } from '@/widgets/projects';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

const ProjectsPageClient = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Projects</PageTitle>
        <CreateProjectDialog />
      </PageHeader>
      <PageContent className="space-y-4">
        <ProjectsDashboard />
      </PageContent>
    </PageContainer>
  );
};

export { ProjectsPageClient };
