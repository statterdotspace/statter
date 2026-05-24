'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Plus, Settings, UserPlus2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CreateWorkspaceForm } from '@/features/workspace';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Label } from '@/shared/ui/label';
import { Logotype } from '@/shared/ui/logotype';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import type { Workspace } from '@/entities';
import { toast } from 'sonner';

interface AppSidebarProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  selectedWorkspaceSlug: string;
}

const toPlanLabel = (plan: Workspace['plan']) => {
  if (plan === 'pro') {
    return 'Pro';
  }

  if (plan === 'enterprise') {
    return 'Enterprise';
  }

  return 'Free';
};

const AppSidebar = ({
  workspaces,
  selectedWorkspaceId,
  selectedWorkspaceSlug,
}: AppSidebarProps) => {
  const router = useRouter();
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(selectedWorkspaceId);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);

  useEffect(() => {
    setCurrentWorkspaceId(selectedWorkspaceId);
    setIsSwitching(false);
  }, [selectedWorkspaceId]);

  const currentWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? workspaces[0];
  }, [currentWorkspaceId, workspaces]);

  const membersCount = currentWorkspace?.membersCount ?? 1;
  const membersText = `${membersCount} ${membersCount === 1 ? 'Member' : 'Members'}`;

  const persistWorkspaceSelection = (workspaceId: string) => {
    document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    if (!workspaceId || workspaceId === currentWorkspaceId) {
      return;
    }

    const nextWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);
    if (!nextWorkspace) {
      return;
    }

    setCurrentWorkspaceId(nextWorkspace.id);
    persistWorkspaceSelection(nextWorkspace.id);
    setIsSwitching(true);
    router.push(`/${nextWorkspace.slug}`);
  };

  return (
    <aside className="shrink-0 rounded-xl px-2 py-3">
      <div className="flex flex-col items-center gap-2">
        <Link href={`/${selectedWorkspaceSlug}`}>
          <Logotype className="size-9" mode="dark" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" className="w-12 justify-between gap-1 px-2 py-2" />}
          >
            <>
              {currentWorkspace?.logoUrl ? (
                <img
                  src={currentWorkspace.logoUrl}
                  alt={`${currentWorkspace.name} logo`}
                  className="size-5 rounded-sm object-cover"
                />
              ) : (
                <Building2 className="size-4.5 text-neutral-700" />
              )}
              <ChevronDown className="size-3.5 text-neutral-600" />
            </>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" sideOffset={8} className="z-40 w-80 p-0">
            <div className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                {currentWorkspace?.logoUrl ? (
                  <img
                    src={currentWorkspace.logoUrl}
                    alt={`${currentWorkspace.name} logo`}
                    className="size-12 rounded-lg border border-neutral-200 object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-lg border border-neutral-300 bg-white">
                    <Building2 className="size-6 text-neutral-700" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-neutral-900">
                    {currentWorkspace?.name ?? 'Workspace'}
                  </p>
                  <p className="text-neutral-500">
                    {toPlanLabel(currentWorkspace?.plan ?? 'free')} · {membersText}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/${currentWorkspace?.slug ?? selectedWorkspaceSlug}/settings`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Settings className="size-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-start gap-2"
                  onClick={() => toast('Invite flow will be added soon')}
                >
                  <UserPlus2 className="size-4" />
                  Invite members
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                  Workspaces
                </Label>

                <Select
                  value={currentWorkspaceId}
                  disabled={isSwitching}
                  onValueChange={(workspaceId) => {
                    if (!workspaceId) {
                      return;
                    }
                    handleWorkspaceChange(workspaceId);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id} className="px-3 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {workspace.logoUrl ? (
                            <img
                              src={workspace.logoUrl}
                              alt={`${workspace.name} logo`}
                              className="size-5 rounded-sm object-cover"
                            />
                          ) : (
                            <Building2 className="size-4 text-neutral-500" />
                          )}
                          <span className="truncate">{workspace.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setIsCreateWorkspaceModalOpen(true)}
                >
                  <Plus className="size-4" />
                  Create workspace
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isCreateWorkspaceModalOpen} onOpenChange={setIsCreateWorkspaceModalOpen}>
          <DialogContent className="z-[5010] max-h-[90vh] overflow-y-auto sm:max-w-md">
            <CreateWorkspaceForm
              variant="modal"
              onSuccess={() => setIsCreateWorkspaceModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
};

export { AppSidebar };
