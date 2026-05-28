import * as React from 'react';

type ViewTransitionProps = {
  children?: React.ReactNode;
  name?: string;
  default?: string;
  enter?: string;
  exit?: string;
  share?: string;
  update?: string;
};

type ReactViewTransitionExports = {
  ViewTransition?: React.ComponentType<ViewTransitionProps>;
  unstable_ViewTransition?: React.ComponentType<ViewTransitionProps>;
};

const reactViewTransition = React as unknown as ReactViewTransitionExports;

const NativeViewTransition =
  reactViewTransition.ViewTransition ?? reactViewTransition.unstable_ViewTransition;

const ViewTransition = ({ children, ...props }: ViewTransitionProps) => {
  if (!NativeViewTransition) {
    return <>{children}</>;
  }

  return <NativeViewTransition {...props}>{children}</NativeViewTransition>;
};

export { ViewTransition };
