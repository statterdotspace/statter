'use client';

import { useParams } from 'next/navigation';
import {
  DeleteProjectDialog,
  EditProjectDialog,
  useDeleteProject,
  useEditProject,
  useProjectSelection,
} from '@/features/project';
import { ProjectList } from './ui/project-list';
import { ListFooterBar } from '@/shared/ui/list-footer-bar';
import { useProjects } from '@/entities/project';

const ProjectsDashboard = () => {
  const params = useParams<{ workspaceSlug: string }>();
  const workspaceSlug = params?.workspaceSlug;
  const { page, perPage, setPage, listQuery } = useProjects();
  const projects = listQuery.data?.data ?? [];

  const editProject = useEditProject();
  const deleteProject = useDeleteProject();
  const projectSelection = useProjectSelection({ projects });

  return (
    <div className="space-y-4">
      <EditProjectDialog
        isOpen={editProject.isOpen}
        onOpenChange={editProject.handleOpenChange}
        form={editProject.form}
        onSubmit={editProject.handleSubmit}
        isSubmitting={editProject.isSubmitting}
      />

      <DeleteProjectDialog
        isOpen={deleteProject.isOpen}
        project={deleteProject.project}
        onOpenChange={deleteProject.handleOpenChange}
        onConfirm={deleteProject.handleConfirm}
        isSubmitting={deleteProject.isSubmitting}
      />

      <DeleteProjectDialog
        isOpen={projectSelection.isBulkDeleteDialogOpen}
        project={null}
        selectedCount={projectSelection.selectedProjectIds.size}
        onOpenChange={projectSelection.setIsBulkDeleteDialogOpen}
        onConfirm={projectSelection.handleBulkDeleteConfirm}
        isSubmitting={projectSelection.isDeletingSelection}
      />

      <ProjectList
        isLoading={listQuery.isLoading}
        projects={projects}
        meta={listQuery?.data?.meta}
        selectedProjectIds={projectSelection.selectedProjectIds}
        onToggleSelect={projectSelection.handleToggleSelection}
        getProjectHref={(project) =>
          workspaceSlug ? `/${workspaceSlug}/projects/${project.slug}` : undefined
        }
        onEdit={editProject.openForEdit}
        onDelete={deleteProject.openForDelete}
      />

      {listQuery.data?.meta ? (
        <ListFooterBar
          selectedCount={projectSelection.selectedProjectIds.size}
          itemLabel="projects"
          isDeletingSelection={projectSelection.isDeletingSelection}
          onClearSelection={projectSelection.clearSelection}
          onDeleteSelected={projectSelection.handleDeleteSelected}
          page={page}
          perPage={perPage}
          total={listQuery.data.meta.total}
          totalPages={listQuery.data.meta.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
};

export { ProjectsDashboard };
