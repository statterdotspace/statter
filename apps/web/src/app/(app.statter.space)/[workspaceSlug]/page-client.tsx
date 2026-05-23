'use client';

import { DashboardStatsGrid } from '@/widgets/dashboard';
import { PageContainer, PageContent, PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

const DashboardPageClient = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
      </PageHeader>

      <PageContent className="space-y-4">
        <DashboardStatsGrid />
      </PageContent>
    </PageContainer>
  );
};

export { DashboardPageClient };
