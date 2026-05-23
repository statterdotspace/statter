'use client';

import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Project } from '@/entities';
import { projectApi } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { MonitorFormFields } from '../../shared/ui/monitor-form-fields';
import { useCreateMonitor } from '../model/use-create-monitor';

interface CreateMonitorDialogProps {
  projectId?: string;
  projectName?: string;
}

const CreateMonitorDialog = ({ projectId, projectName }: CreateMonitorDialogProps) => {
  const createMonitor = useCreateMonitor({ projectId });

  const projectsQuery = useQuery({
    queryKey: ['projects', 'for-monitor-select'],
    queryFn: () => projectApi.list({ page: 1, perPage: 100 }),
    enabled: !projectId,
  });

  const projects: Project[] = projectsQuery.data?.data ?? [];

  return (
    <Dialog open={createMonitor.isOpen} onOpenChange={createMonitor.handleOpenChange}>
      <DialogTrigger render={<Button size="lg" className="gap-2" />}>
        <Plus className="size-4" />
        Add monitor
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Monitor</DialogTitle>
        </DialogHeader>

        <form
          id="create-monitor-form"
          className="space-y-3 p-1"
          onSubmit={createMonitor.handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="create-monitor-project">Project</Label>
            {projectId ? (
              <Input
                id="create-monitor-project"
                value={projectName ?? 'Current project'}
                disabled
              />
            ) : (
              <Select
                value={createMonitor.form.watch('projectId') || undefined}
                onValueChange={(value) => {
                  if (value) {
                    createMonitor.form.setValue('projectId', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger id="create-monitor-project" className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <MonitorFormFields form={createMonitor.form} idPrefix="create-monitor" />
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => createMonitor.handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-monitor-form" disabled={createMonitor.isSubmitting}>
            {createMonitor.isSubmitting ? 'Adding...' : 'Add monitor'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateMonitorDialog };
