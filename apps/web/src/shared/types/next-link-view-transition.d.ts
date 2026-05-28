/* eslint-disable @typescript-eslint/no-unused-vars */
import 'react';

declare module 'react' {
  interface AnchorHTMLAttributes<_T> {
    transitionTypes?: string[];
  }
}
