import type { UseFormReturn } from 'react-hook-form';
import type { UpdateWorkspacePayload } from '@/entities';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Skeleton } from '@/shared/ui/skeleton';

interface WorkspaceSettingsCardProps {
  isLoading: boolean;
  form: UseFormReturn<UpdateWorkspacePayload>;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
  children: React.ReactNode;
}

const WorkspaceSettingsCard = ({
  isLoading,
  form,
  onSubmit,
  isSubmitting,
  children,
}: WorkspaceSettingsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-0 text-lg font-semibold">Workspace settings</CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 rounded-lg" />
            <Skeleton className="h-12 rounded-lg" />
          </div>
        ) : (
          <form className="space-y-3 p-1" onSubmit={onSubmit}>
            <div className="flex flex-col gap-1">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" placeholder="Workspace name" {...form.register('name')} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="workspace-slug">Workspace slug</Label>
              <Input id="workspace-slug" placeholder="Workspace slug" {...form.register('slug')} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save workspace'}
              </Button>
              {children}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export { WorkspaceSettingsCard };
