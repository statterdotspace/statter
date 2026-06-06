'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppWindowMac,
  Building2,
  ChevronDown,
  ChevronsUpDown,
  CircleCheckBig,
  FolderKanban,
  MessageCircleWarning,
  Plus,
  Settings,
  UserPlus2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CreateWorkspaceForm } from '@/features/workspace';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import { Label } from '@/shared/ui/label';
import { Logotype } from '@/shared/ui/logotype';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import { IncidentIcon, ServerIcon } from '@/shared/ui/icons';
import NavSection from '../main-navbar/nav-section';
import type { User, Workspace } from '@/entities';

interface AppSidebarProps {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  selectedWorkspaceSlug: string;
  currentUser: User | null;
}

const toPlanLabel = (plan: Workspace['plan']) => {
  if (plan === 'pro') return 'Pro';
  if (plan === 'enterprise') return 'Enterprise';
  return 'Free';
};

const buildMainMenu = (workspaceSlug: string) => [
  {
    title: '',
    links: [
      { name: 'Dashboard', path: `/${workspaceSlug}`, icon: AppWindowMac },
      { name: 'Projects', path: `/${workspaceSlug}/projects`, icon: FolderKanban },
      { name: 'Monitors', path: `/${workspaceSlug}/monitors`, icon: ServerIcon },
      { name: 'Incidents', path: `/${workspaceSlug}/incidents`, icon: IncidentIcon },
    ],
  },
  {
    title: 'Insights',
    links: [
      { name: 'Reports', path: `/${workspaceSlug}/reports`, icon: MessageCircleWarning },
      { name: 'Status', path: `/${workspaceSlug}/status`, icon: CircleCheckBig },
    ],
  },
  {
    title: 'System',
    links: [{ name: 'Settings', path: `/${workspaceSlug}/settings`, icon: Settings }],
  },
];

const AppSidebar = ({
  workspaces,
  selectedWorkspaceId,
  selectedWorkspaceSlug,
  currentUser,
}: AppSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(selectedWorkspaceId);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCreateWorkspaceModalOpen, setIsCreateWorkspaceModalOpen] = useState(false);

  useEffect(() => {
    setCurrentWorkspaceId(selectedWorkspaceId);
    setIsSwitching(false);
  }, [selectedWorkspaceId]);

  const currentWorkspace = useMemo(
    () => workspaces.find((w) => w.id === currentWorkspaceId) ?? workspaces[0],
    [currentWorkspaceId, workspaces]
  );

  const membersCount = currentWorkspace?.membersCount ?? 1;
  const membersText = `${membersCount} ${membersCount === 1 ? 'Member' : 'Members'}`;

  const persistWorkspaceSelection = (workspaceId: string) => {
    document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    if (!workspaceId || workspaceId === currentWorkspaceId) return;
    const next = workspaces.find((w) => w.id === workspaceId);
    if (!next) return;
    setCurrentWorkspaceId(next.id);
    persistWorkspaceSelection(next.id);
    setIsSwitching(true);
    router.push(`/${next.slug}`);
  };

  const mainMenu = buildMainMenu(selectedWorkspaceSlug);

  const userDisplayName = currentUser
    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ')
    : null;

  const userInitials = currentUser
    ? (currentUser.firstName?.[0] ?? '') + (currentUser.lastName?.[0] ?? '')
    : '?';

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r bg-white">
      {/* Workspace switcher */}
      <div className="flex justify-center items-center border-b h-12 sm:h-16 px-3 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-neutral-100">
            {currentWorkspace?.logoUrl ? (
              <img
                src={currentWorkspace.logoUrl}
                alt={`${currentWorkspace.name} logo`}
                className="size-5 shrink-0 rounded-sm object-cover"
              />
            ) : (
              <div className="flex size-5 shrink-0 items-center justify-center rounded bg-neutral-900 text-[10px] font-bold text-white">
                {currentWorkspace?.name?.[0]?.toUpperCase() ?? 'W'}
              </div>
            )}
            <span className="flex-1 truncate text-sm font-semibold text-neutral-800">
              {currentWorkspace?.name ?? 'Workspace'}
            </span>
            <ChevronsUpDown className="size-3.5 shrink-0 text-neutral-500" />
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
                  <p className="text-sm text-neutral-500">
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
                <Link
                  href={`/${currentWorkspace?.slug ?? selectedWorkspaceSlug}/settings/members`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <UserPlus2 className="size-4" />
                    Invite members
                  </Button>
                </Link>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                  Workspaces
                </Label>

                <Select
                  value={currentWorkspaceId}
                  disabled={isSwitching}
                  onValueChange={(id) => {
                    if (id) handleWorkspaceChange(id);
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex flex-col gap-4">
          {mainMenu.map((section) => (
            <NavSection
              key={section.title || 'main'}
              title={section.title}
              links={section.links}
              activePath={pathname || ''}
            />
          ))}
        </div>
      </nav>

      {/* User block */}
      {currentUser && (
        <div className="border-t px-2 py-2">
          <Link
            href={`/${selectedWorkspaceSlug}/settings/profile`}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-neutral-100"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={userDisplayName ?? 'Avatar'}
                className="size-7 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-semibold text-neutral-600 uppercase">
                {userInitials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-800 leading-tight">
                {userDisplayName}
              </p>
              <p className="truncate text-xs text-neutral-500 leading-tight">{currentUser.email}</p>
            </div>
          </Link>
        </div>
      )}

      <Dialog open={isCreateWorkspaceModalOpen} onOpenChange={setIsCreateWorkspaceModalOpen}>
        <DialogContent className="z-[5010] max-h-[90vh] overflow-y-auto sm:max-w-md">
          <CreateWorkspaceForm
            variant="modal"
            onSuccess={() => setIsCreateWorkspaceModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export { AppSidebar };
