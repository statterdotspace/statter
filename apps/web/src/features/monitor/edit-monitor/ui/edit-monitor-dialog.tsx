import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { MonitorFormFields } from '../../shared/ui/monitor-form-fields';
import type { EditMonitorPayload } from '../../shared/model/types';

interface EditMonitorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EditMonitorPayload>;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  isSubmitting: boolean;
}

const EditMonitorDialog = ({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
}: EditMonitorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Monitor</DialogTitle>
        </DialogHeader>

        <form id="edit-monitor-form" className="space-y-3 p-1" onSubmit={onSubmit}>
          <MonitorFormFields form={form} idPrefix="edit-monitor" />
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="edit-monitor-form" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditMonitorDialog };
