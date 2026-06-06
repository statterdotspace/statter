'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { NotificationChannel, WorkspaceIntegration } from '@/entities';
import { ConnectEmailDialog } from './connect-email-dialog';

interface IntegrationDef {
  channel: NotificationChannel;
  label: string;
  description: string;
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    channel: 'email',
    label: 'Email',
    description: 'Receive alert emails directly to your inbox',
  },
  {
    channel: 'telegram',
    label: 'Telegram',
    description: 'Get instant alerts via Telegram bot',
  },
  {
    channel: 'slack',
    label: 'Slack',
    description: 'Post alerts to a Slack channel via webhook',
  },
];

interface IntegrationsListProps {
  integrations: WorkspaceIntegration[];
  isLoading: boolean;
  onConnectEmail: (email: string) => Promise<void>;
  onConnectTelegram: () => Promise<void>;
  onConnectSlack: () => Promise<void>;
  onDisconnect: (id: string) => void;
  isConnectingEmail: boolean;
  isConnectingTelegram: boolean;
  isConnectingSlack: boolean;
  isDisconnecting: boolean;
}

export const IntegrationsList = ({
  integrations,
  isLoading,
  onConnectEmail,
  onConnectTelegram,
  onConnectSlack,
  onDisconnect,
  isConnectingEmail,
  isConnectingTelegram,
  isConnectingSlack,
  isDisconnecting,
}: IntegrationsListProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const connectedMap = new Map<NotificationChannel, WorkspaceIntegration>(
    integrations.map((i) => [i.channel, i])
  );

  const handleConnect = (channel: NotificationChannel) => {
    if (channel === 'email') {
      setEmailDialogOpen(true);
    } else if (channel === 'telegram') {
      void onConnectTelegram();
    } else if (channel === 'slack') {
      void onConnectSlack();
    }
  };

  const isConnecting = (channel: NotificationChannel) => {
    if (channel === 'email') return isConnectingEmail;
    if (channel === 'telegram') return isConnectingTelegram;
    if (channel === 'slack') return isConnectingSlack;
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg border bg-white" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {INTEGRATIONS.map((def) => {
          const connected = connectedMap.get(def.channel);
          return (
            <div
              key={def.channel}
              className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-neutral-50">
                  <Mail className="h-4 w-4 text-neutral-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{def.label}</p>
                  <p className="text-xs text-neutral-500">{def.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {connected ? (
                  <>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDisconnect(connected.id)}
                      disabled={isDisconnecting}
                      className="text-xs"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConnect(def.channel)}
                    disabled={isConnecting(def.channel)}
                  >
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    {isConnecting(def.channel) ? 'Connecting…' : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConnectEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onConnect={onConnectEmail}
        isLoading={isConnectingEmail}
      />
    </>
  );
};
