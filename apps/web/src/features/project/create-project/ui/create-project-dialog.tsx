'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { ProjectFormFields } from '../../shared/ui/project-form-fields';
import { useCreateProject } from '../model/use-create-project';

const CreateProjectDialog = () => {
  const createProject = useCreateProject();

  return (
    <Dialog open={createProject.isOpen} onOpenChange={createProject.handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg" className="gap-2" />
        }
      >
        <Plus className="size-4" />
        Add project
      </DialogTrigger>

      <DialogContent className="z-[5010] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <form id="create-project-form" className="space-y-3 p-1" onSubmit={createProject.handleSubmit}>
          <ProjectFormFields form={createProject.form} idPrefix="create-project" />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => createProject.handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-project-form" disabled={createProject.isSubmitting}>
            {createProject.isSubmitting ? 'Adding...' : 'Add project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateProjectDialog };
