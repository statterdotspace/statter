import { PageContainer, PageContent, PageHeader } from '@/shared/ui/page-wrapper';
import { Skeleton } from '@/shared/ui/skeleton';

const MonitorDetailsLoadingState = () => {
  return (
    <PageContainer>
      <PageHeader>
        <Skeleton className="h-8 w-48" />
      </PageHeader>
      <PageContent className="space-y-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </PageContent>
    </PageContainer>
  );
};

export { MonitorDetailsLoadingState };
