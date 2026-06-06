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
    className={cn('inline-block size-12 rounded-sm', className)}
  >
    {props.mode === 'light' ? (
      <>
        <rect width="512" height="512" fill="#181818" />
        <rect x="76" y="243.5" width="75" height="156.25" rx="10" fill="#EFEFEF" />
        <rect x="171" y="111" width="75" height="288.75" rx="10" fill="#E7E7E7" />
        <rect x="266" y="196" width="75" height="205" rx="10" fill="#DCDCDC" />
        <rect x="361" y="162.25" width="75" height="237.5" rx="10" fill="#D6D6D6" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M222.875 258.5L76 391.625V364.125L222.875 236.625L336.625 312.875L436 233.5V252.057L336.625 334.125L222.875 258.5Z"
          fill="#181818"
        />
      </>
    ) : (
      <>
        <rect width="512" height="512" fill="#181818" />
        <rect x="76" y="243.5" width="75" height="156.25" rx="10" fill="#EFEFEF" />
        <rect x="171" y="111" width="75" height="288.75" rx="10" fill="#E7E7E7" />
        <rect x="266" y="196" width="75" height="205" rx="10" fill="#DCDCDC" />
        <rect x="361" y="162.25" width="75" height="237.5" rx="10" fill="#D6D6D6" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M222.875 258.5L76 391.625V364.125L222.875 236.625L336.625 312.875L436 233.5V252.057L336.625 334.125L222.875 258.5Z"
          fill="#181818"
        />
      </>
    )}
  </svg>
));

Logotype.displayName = 'Logotype';

export { Logotype };
