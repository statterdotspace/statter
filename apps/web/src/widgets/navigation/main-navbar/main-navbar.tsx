'use client';

import { IncidentIcon, ServerIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import {
  AppWindowMac,
  ChevronLeft,
  CircleCheckBig,
  FolderKanban,
  MessageCircleWarning,
  Settings,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavSection from './nav-section';

interface ILinkItem {
  name: string;
  path: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface ISection {
  title: string;
  links: ILinkItem[];
}

const buildMainMenu = (workspaceSlug: string): ISection[] => [
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

const buildSettingsMenu = (workspaceSlug: string): ISection[] => [
  {
    title: 'Settings',
    links: [
      { name: 'General', path: `/${workspaceSlug}/settings` },
      { name: 'Members', path: `/${workspaceSlug}/settings/members` },
    ],
  },
];

interface MainNavbarProps {
  workspaceSlug: string;
}

const MainNavbar = ({ workspaceSlug }: MainNavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isSettingsPage = pathname?.startsWith(`/${workspaceSlug}/settings`);
  const [currentNav, setCurrentNav] = useState<'main' | 'settings'>(
    isSettingsPage ? 'settings' : 'main'
  );
  const menuMain = buildMainMenu(workspaceSlug);
  const menuSettings = buildSettingsMenu(workspaceSlug);

  useEffect(() => {
    setCurrentNav(isSettingsPage ? 'settings' : 'main');
  }, [isSettingsPage]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const direction = currentNav === 'settings' ? 1 : -1;

  return (
    <aside className="relative w-[220px] shrink-0 overflow-hidden rounded-xl border-r bg-neutral-100/85">
      <div className="absolute inset-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {currentNav === 'main' ? (
            <motion.div
              key="main"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="flex h-full flex-col justify-between gap-4"
            >
              <nav className="flex flex-col gap-4">
                <h5 className="px-2 text-lg font-semibold">Monitoring</h5>
                {menuMain.map((section) => (
                  <NavSection
                    key={section.title || 'main'}
                    title={section.title}
                    links={section.links}
                    activePath={pathname || ''}
                  />
                ))}
              </nav>

              {/*<section>*/}
              {/*  <h3 className="text-foreground/80 mb-2 text-base font-semibold">Usage</h3>*/}
              {/*  <ul className="text-foreground/80 space-y-2 text-sm">*/}
              {/*    <li className="flex flex-col gap-1">*/}
              {/*      <div className="flex w-full justify-between font-medium">*/}
              {/*        <div className="flex items-center gap-2">*/}
              {/*          <ServerIcon className="size-4.5" />*/}
              {/*          <span>Servers</span>*/}
              {/*        </div>*/}
              {/*        <span>0 of 2</span>*/}
              {/*      </div>*/}
              {/*      <ProgressBar value={20} size="sm" />*/}
              {/*    </li>*/}

              {/*    <li className="flex flex-col gap-1">*/}
              {/*      <div className="flex w-full justify-between font-medium">*/}
              {/*        <div className="flex items-center gap-2">*/}
              {/*          <CircleCheckBig className="size-4.5" />*/}
              {/*          <span>Checks</span>*/}
              {/*        </div>*/}
              {/*        <span>0 of 1k</span>*/}
              {/*      </div>*/}
              {/*      <ProgressBar value={5} size="sm" />*/}
              {/*    </li>*/}
              {/*  </ul>*/}
              {/*  <Button*/}
              {/*    size="sm"*/}
              {/*    className="mt-2 w-full border border-violet-400/40 bg-linear-to-r from-violet-500 to-cyan-500 text-white"*/}
              {/*  >*/}
              {/*    Change Plan*/}
              {/*  </Button>*/}
              {/*</section>*/}
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="flex flex-col gap-6"
            >
              <nav className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Button onClick={() => router.back()} variant="outline" size="icon-sm">
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  <h5 className="text-lg font-semibold">Settings Menu</h5>
                </div>

                {menuSettings.map((section) => (
                  <NavSection
                    key={section.title}
                    title={section.title}
                    links={section.links}
                    activePath={pathname || ''}
                  />
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export { MainNavbar };
