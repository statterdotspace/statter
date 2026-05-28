import { PageContainer, PageHeader } from '@/shared/ui/page-wrapper';

const MonitorDetailsNotFoundState = () => {
  return (
    <PageContainer>
      <PageHeader>
        <div className="text-sm text-neutral-500">Monitor not found.</div>
      </PageHeader>
    </PageContainer>
  );
};

export { MonitorDetailsNotFoundState };
