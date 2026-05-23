import Link from 'next/link';
import { FolderKanban, Hash } from 'lucide-react';
import type { Project } from '@/entities';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import { ProjectActionsMenu } from './project-actions-menu';

interface ProjectListItemProps {
  project: Project;
  projectHref?: string;
  isSelected: boolean;
  onToggleSelect: (projectId: string, checked: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectListItem = ({
  project,
  projectHref,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}: ProjectListItemProps) => {
  return (
    <article className="group flex items-start gap-3 rounded-2xl border border-neutral-200 px-4 py-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50/40">
      <div className="relative mt-0.5 flex size-11 shrink-0 items-center justify-center">
        <div
          className={cn(
            'pointer-events-none absolute flex size-11 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-opacity',
            isSelected ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
          )}
        >
          <FolderKanban className="size-5" />
        </div>

        <Checkbox
          aria-label={`Select ${project.name}`}
          checked={isSelected}
          onCheckedChange={(checked) => onToggleSelect(project.id, checked === true)}
          className={cn(
            'size-11 rounded-full border-neutral-300 bg-transparent transition-opacity data-checked:border-neutral-900 data-checked:bg-neutral-900 data-checked:text-white [&_[data-slot=checkbox-indicator]>svg]:size-5',
            isSelected
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
          )}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-2.5 text-left">
        <Link
          href={projectHref ?? '#'}
          onClick={(event) => {
            if (!projectHref) {
              event.preventDefault();
            }
          }}
          className="block truncate text-lg leading-none font-semibold text-neutral-900 transition-colors hover:text-primary group-hover:text-primary"
        >
          {project.name}
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <Hash className="size-3.5" />
            {project.slug}
          </span>
        </div>
        {project.description?.length ? (
          <p className="truncate text-sm text-neutral-500">{project.description}</p>
        ) : null}
      </div>

      <ProjectActionsMenu onEdit={() => onEdit(project)} onDelete={() => onDelete(project)} />
    </article>
  );
};

export { ProjectListItem };
