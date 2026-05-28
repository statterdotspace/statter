import { InviteTokenPageClient } from './page-client';

interface InviteTokenPageProps {
  params: Promise<{ token: string }>;
}

export default async function InviteTokenPage({ params }: InviteTokenPageProps) {
  const { token } = await params;
  return <InviteTokenPageClient token={token} />;
}

