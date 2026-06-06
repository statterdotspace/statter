'use client';

import { usePathname } from 'next/navigation';
import NavSection from '../main-navbar/nav-section';

const buildSettingsMenu = (workspaceSlug: string) => [
  {
    title: 'Workspace',
    links: [
      { name: 'General', path: `/${workspaceSlug}/settings` },
      { name: 'Members', path: `/${workspaceSlug}/settings/members` },
      { name: 'Integrations', path: `/${workspaceSlug}/settings/integrations` },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Profile', path: `/${workspaceSlug}/settings/profile` },
    ],
  },
];

interface SettingsSidebarProps {
  workspaceSlug: string;
}

const SettingsSidebar = ({ workspaceSlug }: SettingsSidebarProps) => {
  const pathname = usePathname();
  const menu = buildSettingsMenu(workspaceSlug);

  return (
    <aside className="flex h-full w-48 shrink-0 flex-col border-r bg-white">
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex flex-col gap-4">
          {menu.map((section) => (
            <NavSection
              key={section.title}
              title={section.title}
              links={section.links}
              activePath={pathname || ''}
              matchExact
            />
          ))}
        </div>
      </nav>
    </aside>
  );
};

export { SettingsSidebar };
