'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { workspaceApi, getErrorMessage } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import type { WorkspaceInvitableRole } from '@/entities';
import { toast } from 'sonner';

interface InviteMembersDialogProps {
  onInvited?: () => Promise<void> | void;
}

interface InviteFormRow {
  id: string;
  email: string;
  role: WorkspaceInvitableRole;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createEmptyRow = (): InviteFormRow => ({
  id: Math.random().toString(36).slice(2),
  email: '',
  role: 'member',
});

const InviteMembersDialog = ({ onInvited }: InviteMembersDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [rows, setRows] = useState<InviteFormRow[]>([createEmptyRow()]);

  const resetRows = () => {
    setRows([createEmptyRow()]);
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetRows();
    }
  };

  const handleAddRow = () => {
    setRows((currentRows) => [...currentRows, createEmptyRow()]);
  };

  const handleRemoveRow = (rowId: string) => {
    setRows((currentRows) => {
      if (currentRows.length <= 1) {
        return currentRows;
      }

      return currentRows.filter((row) => row.id !== rowId);
    });
  };

  const updateRow = (rowId: string, payload: Partial<InviteFormRow>) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, ...payload } : row))
    );
  };

  const getNormalizedPayload = () => {
    const normalizedRows = rows.map((row) => ({
      email: row.email.trim().toLowerCase(),
      role: row.role,
    }));

    if (normalizedRows.some((row) => !row.email)) {
      toast.error('Please fill all email fields.');
      return null;
    }

    if (normalizedRows.some((row) => !EMAIL_REGEX.test(row.email))) {
      toast.error('Please enter valid email addresses.');
      return null;
    }

    const uniqueEmails = new Set<string>();
    for (const row of normalizedRows) {
      if (uniqueEmails.has(row.email)) {
        toast.error('Please remove duplicate emails.');
        return null;
      }
      uniqueEmails.add(row.email);
    }

    return normalizedRows;
  };

  const handleSendInvites = async () => {
    const invitations = getNormalizedPayload();
    if (!invitations) {
      return;
    }

    setIsSending(true);

    try {
      const response = await workspaceApi.inviteMembers({ invitations });

      if (response.meta.invited > 0) {
        toast.success(
          response.meta.invited === 1
            ? '1 invitation sent.'
            : `${response.meta.invited} invitations sent.`
        );
      } else {
        toast.success('No new invitations were sent.');
      }

      if (onInvited) {
        await onInvited();
      }

      setIsOpen(false);
      resetRows();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger render={<Button variant="outline" />}>Invite members</DialogTrigger>

      <DialogContent className="max-w-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 pt-6 pb-5">
          <DialogTitle className="text-2xl">Invite Teammates</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Invite teammates with{' '}
            <a href="#" onClick={(event: MouseEvent<HTMLAnchorElement>) => event.preventDefault()}>
              different roles and permissions
            </a>
            . Invitations will be valid for 14 days.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <Label>Email</Label>

          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.id} className="flex gap-2">
                <Input
                  placeholder="name@company.com"
                  value={row.email}
                  onChange={(event) => updateRow(row.id, { email: event.target.value })}
                />

                <Select
                  value={row.role}
                  onValueChange={(nextRole) =>
                    updateRow(row.id, { role: nextRole as WorkspaceInvitableRole })
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveRow(row.id)}
                  disabled={rows.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={handleAddRow}>
            <Plus className="size-4" />
            Add email
          </Button>
        </div>

        <DialogFooter className="border-t bg-background px-6 py-5">
          <Button type="button" className="w-full" onClick={handleSendInvites} disabled={isSending}>
            {isSending ? 'Sending invite...' : 'Send invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { InviteMembersDialog };
