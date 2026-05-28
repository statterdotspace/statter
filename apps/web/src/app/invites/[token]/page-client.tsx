'use client';

import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getErrorMessage, workspaceApi } from '@/shared/api';
import { ROUTES, WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

interface InviteTokenPageClientProps {
  token: string;
}

const InviteTokenPageClient = ({ token }: InviteTokenPageClientProps) => {
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const acceptInvitation = async () => {
      try {
        const response = await workspaceApi.acceptInvitation(token);

        document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(response.workspaceId)};path=/;max-age=31536000;samesite=lax`;

        toast.success(`Welcome to ${response.workspaceName}.`);
        router.replace(`/${response.workspaceSlug}/settings/members`);
        router.refresh();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          const redirectPath = encodeURIComponent(`/invites/${token}`);
          router.replace(`${ROUTES.SIGN_IN}?redirect=${redirectPath}`);
          return;
        }

        setErrorMessage(getErrorMessage(error));
      }
    };

    void acceptInvitation();
  }, [router, token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 text-center">
        {errorMessage ? (
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Invitation failed</h1>
            <p className="text-muted-foreground">{errorMessage}</p>
            <Button
              type="button"
              onClick={() => {
                const redirectPath = encodeURIComponent(`/invites/${token}`);
                router.push(`${ROUTES.SIGN_IN}?redirect=${redirectPath}`);
              }}
            >
              Sign in and try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Accepting invitation...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export { InviteTokenPageClient };

