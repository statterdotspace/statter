import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface MonitorDetailsPageHeaderProps {
  workspaceSlug: string;
}

const MonitorDetailsPageHeader = ({ workspaceSlug }: MonitorDetailsPageHeaderProps) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link
        href={`/${workspaceSlug}/monitors`}
        className="inline-flex h-8 items-center gap-1 rounded-lg border border-neutral-200 px-2.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Link>
      <p className="truncate text-lg leading-tight font-semibold text-neutral-900">Monitor Details</p>
    </div>
  );
};

export { MonitorDetailsPageHeader };
