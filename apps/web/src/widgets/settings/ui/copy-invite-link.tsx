'use client';

import { Copy, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getErrorMessage, workspaceApi } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

const buildInviteUrl = (code: string) => {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URL(`/invites/${code}`, window.location.origin).toString();
};

const CopyInviteLink = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const ensureInviteCode = async (): Promise<string> => {
    if (inviteCode) {
      return inviteCode;
    }

    setIsLoading(true);
    try {
      const workspace = await workspaceApi.getCurrent();
      setInviteCode(workspace.inviteCode);
      return workspace.inviteCode;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = async (nextOpen: boolean) => {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      return;
    }

    try {
      await ensureInviteCode();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCopyInviteLink = async () => {
    setIsCopying(true);

    try {
      const code = await ensureInviteCode();
      if (!navigator.clipboard) {
        throw new Error('Clipboard API is not available');
      }

      const inviteUrl = buildInviteUrl(code);
      if (!inviteUrl) {
        throw new Error('Invite link is not available');
      }

      await navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCopying(false);
    }
  };

  const handleResetInviteLink = async () => {
    setIsResetting(true);

    try {
      const workspace = await workspaceApi.resetInviteCode();
      setInviteCode(workspace.inviteCode);
      toast.success('Invite link reset.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>Copy invite link</DialogTrigger>

      <DialogContent className="max-w-xl p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 pt-6 pb-5">
          <DialogTitle className="text-2xl">Invite Link</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Allow other people to join your workspace through the link below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="relative">
            <Input
              value={inviteCode ? buildInviteUrl(inviteCode) : ''}
              readOnly
              placeholder={isLoading ? 'Loading invite link...' : 'Invite link'}
              className="pr-10 font-mono"
            />

            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={handleCopyInviteLink}
              disabled={isLoading || isCopying}
            >
              {isCopying ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResetInviteLink}
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : 'Reset invite link'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CopyInviteLink };
