import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { ProjectFormFields } from '../../shared/ui/project-form-fields';
import type { ProjectFormValues } from '../../shared/model/types';

interface EditProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
}

const EditProjectDialog = ({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
}: EditProjectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-[5010] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form id="edit-project-form" className="space-y-3 p-1" onSubmit={onSubmit}>
          <ProjectFormFields form={form} idPrefix="edit-project" />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-project-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditProjectDialog };
