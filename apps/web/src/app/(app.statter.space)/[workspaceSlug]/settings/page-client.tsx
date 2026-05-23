import { SettingsPageContent } from '@/widgets/settings';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

const SettingsPageClient = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
      </PageHeader>
      <PageContent className="space-y-4">
        <SettingsPageContent />
      </PageContent>
    </PageContainer>
  );
};

export { SettingsPageClient };
