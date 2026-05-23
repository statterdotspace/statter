'use client';

import React from 'react';
import NavItem from './nav-item';

type LinkItem = {
  name: string;
  path: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Props = {
  title?: string;
  links: LinkItem[];
  activePath: string;
};

const NavSection = React.memo(
  function NavSection({ title, links, activePath }: Props) {
    return (
      <div>
        {title ? (
          <h6 className="mb-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            {title}
          </h6>
        ) : null}
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <NavItem
              key={link.path}
              name={link.name}
              path={link.path}
              Icon={link.icon}
              isActive={activePath === link.path}
            />
          ))}
        </ul>
      </div>
    );
  },
  (prev, next) => prev.activePath === next.activePath && prev.links.length === next.links.length
);

export default NavSection;
