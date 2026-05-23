'use client';

import { useEffect, useMemo } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Toaster } from '@/shared/ui/sonner';
import { configureApiAuth, getErrorMessage } from '@/shared/api';
import { ROUTES } from '@/shared/config';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: Props) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: (error) => toast.error(getErrorMessage(error)) }),
        mutationCache: new MutationCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const cause = error as AxiosError;
              if (cause.response?.status === 401) {
                return false;
              }
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    []
  );

  useEffect(() => {
    configureApiAuth({
      onUnauthorized: () => {
        if (window.location.pathname !== ROUTES.SIGN_IN) {
          window.location.assign(ROUTES.SIGN_IN);
        }
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
};

export { QueryProvider };
