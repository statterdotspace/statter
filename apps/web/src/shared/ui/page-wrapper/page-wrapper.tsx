import { cn } from '@/shared/lib/utils';

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-neutral-50 flex h-full w-full flex-1 flex-col overflow-y-auto rounded-xl">
      {children}
    </main>
  );
};

export const PageHeader = ({ children }: { children: React.ReactNode }) => (
  <div className={'flex h-12 items-center justify-between border-b px-6 sm:h-16'}>{children}</div>
);

export const PageTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="flex items-center text-lg leading-tight font-semibold">{children}</h2>
);

export const PageContent = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <div className={cn('min-h-0 flex-1 px-6 py-4', className)}>{children}</div>;
