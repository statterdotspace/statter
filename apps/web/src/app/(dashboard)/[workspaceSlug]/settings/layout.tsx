import { SettingsSidebar } from '@/widgets/navigation';
import { PageHeader, PageTitle } from '@/shared/ui/page-wrapper';

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ workspaceSlug: string }>;
}

export default async function SettingsLayout({ children, params }: SettingsLayoutProps) {
  const { workspaceSlug } = await params;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-50">
      <PageHeader>
        <PageTitle>Settings</PageTitle>
      </PageHeader>
      {/* Below the header: settings nav sidebar + page content side by side */}
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar workspaceSlug={workspaceSlug} />
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
