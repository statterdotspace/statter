'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Monitor,
  Settings,
  FileBarChart2,
  Siren,
  Activity,
  LogOut,
  FolderKanban,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { authApi, setWorkspaceId } from '@/shared/api';
import { WORKSPACE_COOKIE_NAME } from '@/shared/config';
import type { Workspace } from '@/entities';

interface AppShellProps {
  children: React.ReactNode;
  workspaces: Workspace[];
  initialWorkspaceId: string;
  workspaceSlug: string;
}

const buildNavItems = (workspaceSlug: string) => [
  { href: `/${workspaceSlug}`, label: 'Dashboard', icon: LayoutDashboard },
  { href: `/${workspaceSlug}/projects`, label: 'Projects', icon: FolderKanban },
  { href: `/${workspaceSlug}/monitors`, label: 'Monitors', icon: Monitor },
  { href: `/${workspaceSlug}/settings`, label: 'Settings', icon: Settings },
  { href: `/${workspaceSlug}/reports`, label: 'Reports', icon: FileBarChart2 },
  { href: `/${workspaceSlug}/incidents`, label: 'Incidents', icon: Siren },
  { href: `/${workspaceSlug}/status`, label: 'Status', icon: Activity },
];

const setWorkspaceCookie = (workspaceId: string) => {
  document.cookie = `${WORKSPACE_COOKIE_NAME}=${encodeURIComponent(workspaceId)};path=/;max-age=31536000;samesite=lax`;
};

const AppShell = ({ children, workspaces, initialWorkspaceId, workspaceSlug }: AppShellProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [workspaceId, setCurrentWorkspaceId] = useState(initialWorkspaceId);
  const navItems = buildNavItems(workspaceSlug);

  useEffect(() => {
    setWorkspaceId(workspaceId);
    setWorkspaceCookie(workspaceId);
  }, [workspaceId]);

  const handleWorkspaceChange = (nextWorkspaceId: string) => {
    setCurrentWorkspaceId(nextWorkspaceId);
    setWorkspaceId(nextWorkspaceId);
    setWorkspaceCookie(nextWorkspaceId);
    const nextWorkspace = workspaces.find((workspace) => workspace.id === nextWorkspaceId);
    if (!nextWorkspace) {
      return;
    }

    router.push(`/${nextWorkspace.slug}`);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.replace('/sign-in');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="w-[270px] border-r border-neutral-200 bg-white px-4 py-5">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-neutral-500">Workspace</p>
            <Select
              value={workspaceId}
              onValueChange={(nextWorkspaceId) => {
                if (!nextWorkspaceId) {
                  return;
                }
                handleWorkspaceChange(nextWorkspaceId);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-primary/10 text-primary' : 'text-neutral-600 hover:bg-neutral-100'}`}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export { AppShell };
