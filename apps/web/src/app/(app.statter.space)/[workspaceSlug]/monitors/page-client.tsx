import { CreateMonitorDialog } from '@/features/monitor';
import { MonitorsPageContent } from '@/widgets/monitors';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

const MonitorsPageClient = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Monitors</PageTitle>
        <CreateMonitorDialog />
      </PageHeader>
      <PageContent className="space-y-4">
        <MonitorsPageContent />
      </PageContent>
    </PageContainer>
  );
};

export { MonitorsPageClient };
