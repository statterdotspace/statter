import { MonitorDetailsPageClient } from './page-client';

interface MonitorDetailsPageProps {
  params: Promise<{ workspaceSlug: string; monitorId: string }>;
}

export default async function MonitorDetailsPage({ params }: MonitorDetailsPageProps) {
  const { workspaceSlug, monitorId } = await params;

  return <MonitorDetailsPageClient workspaceSlug={workspaceSlug} monitorId={monitorId} />;
}
