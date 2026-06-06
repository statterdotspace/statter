'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PageContainer, PageContent } from '@/shared/ui/page-wrapper';
import { IntegrationsList, useIntegrations } from '@/features/integrations';

const SettingsIntegrationsPageClient = () => {
  const searchParams = useSearchParams();

  const {
    integrations,
    isLoading,
    connectEmail,
    openTelegramConnect,
    openSlackConnect,
    disconnect,
    isConnectingEmail,
    isConnectingTelegram,
    isConnectingSlack,
    isDisconnecting,
  } = useIntegrations();

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    if (connected === 'slack') {
      toast.success('Slack connected successfully!');
    }
    if (error === 'slack_oauth_failed') {
      toast.error('Failed to connect Slack. Please try again.');
    }
  }, [searchParams]);

  return (
    <PageContainer>
      <PageContent>
        <div className="mb-6">
          <h3 className="font-semibold">Integrations</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Connect notification channels to receive alerts when your monitors go down.
          </p>
        </div>

        <div className="max-w-xl">
          <IntegrationsList
            integrations={integrations}
            isLoading={isLoading}
            onConnectEmail={connectEmail}
            onConnectTelegram={openTelegramConnect}
            onConnectSlack={openSlackConnect}
            onDisconnect={disconnect}
            isConnectingEmail={isConnectingEmail}
            isConnectingTelegram={isConnectingTelegram}
            isConnectingSlack={isConnectingSlack}
            isDisconnecting={isDisconnecting}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export { SettingsIntegrationsPageClient };
