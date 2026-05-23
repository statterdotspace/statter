'use client';

import Link from 'next/link';
import React from 'react';
import { cn } from '@/shared/lib/utils';

type Props = {
  name: string;
  path: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive: boolean;
};

const NavItem = React.memo(
  function NavItem({ name, path, Icon, isActive }: Props) {
    return (
      <li>
        <Link
          href={path}
          className={cn(
            'hover:bg-foreground/5 group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all',
            {
              'bg-primary/10 hover:bg-primary/15 text-primary': isActive,
            }
          )}
        >
          {Icon ? <Icon className="size-4" /> : null}
          {name}
        </Link>
      </li>
    );
  },
  (prev, next) =>
    prev.isActive === next.isActive && prev.name === next.name && prev.path === next.path
);

export default NavItem;
