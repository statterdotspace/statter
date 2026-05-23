import type { Project } from '@/entities';
import { Skeleton } from '@/shared/ui/skeleton';
import { ProjectListItem } from './project-list-item';

interface ProjectListMeta {
  total: number;
  page: number;
  totalPages: number;
}

interface ProjectListProps {
  isLoading: boolean;
  projects: Project[];
  meta?: ProjectListMeta;
  selectedProjectIds: ReadonlySet<string>;
  onToggleSelect: (projectId: string, checked: boolean) => void;
  getProjectHref: (project: Project) => string | undefined;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectList = ({
  isLoading,
  projects,
  meta,
  selectedProjectIds,
  onToggleSelect,
  getProjectHref,
  onEdit,
  onDelete,
}: ProjectListProps) => {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-end px-1">
        {meta ? (
          <span className="text-xs tracking-wide text-neutral-500 uppercase">{meta.total} total</span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
              No projects yet.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                  projectHref={getProjectHref(project)}
                  isSelected={selectedProjectIds.has(project.id)}
                  onToggleSelect={onToggleSelect}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export { ProjectList };
