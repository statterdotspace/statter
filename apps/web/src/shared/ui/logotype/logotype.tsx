import { cn } from '@/shared/lib/utils';
import React, { forwardRef } from 'react';

const Logotype = forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement> & { mode: 'light' | 'dark' }
>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={cn('inline-block size-12', className)}
  >
    {props.mode === 'light' ? (
      <>
        <rect width="512" height="512" rx="130" fill="#EFEFEF" />
      </>
    ) : (
      <>
        <rect width="512" height="512" rx="130" fill="#181818" />
      </>
    )}
  </svg>
));

Logotype.displayName = 'Logotype';

export { Logotype };
