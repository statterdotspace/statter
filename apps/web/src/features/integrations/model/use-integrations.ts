'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationsApi, getErrorMessage } from '@/shared/api';
import type { CreateIntegrationPayload } from '@/entities';
import { toast } from 'sonner';

const INTEGRATIONS_QUERY_KEY = ['workspace-integrations'];

export const useIntegrations = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: INTEGRATIONS_QUERY_KEY,
    queryFn: () => integrationsApi.list(),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY });

  const connectEmailMutation = useMutation({
    mutationFn: (payload: CreateIntegrationPayload) => integrationsApi.create(payload),
    onSuccess: async () => {
      toast.success('Email notifications connected');
      await invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => integrationsApi.delete(id),
    onSuccess: async () => {
      toast.success('Integration disconnected');
      await invalidate();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const getTelegramLinkMutation = useMutation({
    mutationFn: () => integrationsApi.getTelegramConnectLink(),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const getSlackUrlMutation = useMutation({
    mutationFn: () => integrationsApi.getSlackOAuthUrl(),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const connectEmail = async (email: string) => {
    await connectEmailMutation.mutateAsync({
      channel: 'email',
      config: { email },
    });
  };

  const openTelegramConnect = async () => {
    const { url } = await getTelegramLinkMutation.mutateAsync();
    window.open(url, '_blank');
  };

  const openSlackConnect = async () => {
    const { url } = await getSlackUrlMutation.mutateAsync();
    window.location.href = url;
  };

  const disconnect = (id: string) => disconnectMutation.mutate(id);

  return {
    integrations: query.data ?? [],
    isLoading: query.isLoading,
    connectEmail,
    openTelegramConnect,
    openSlackConnect,
    disconnect,
    isConnectingEmail: connectEmailMutation.isPending,
    isConnectingTelegram: getTelegramLinkMutation.isPending,
    isConnectingSlack: getSlackUrlMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
  };
};
