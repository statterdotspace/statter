import type { Monitor } from '@/entities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';

interface DeleteMonitorDialogProps {
  isOpen: boolean;
  monitor: Monitor | null;
  selectedCount?: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const DeleteMonitorDialog = ({
  isOpen,
  monitor,
  selectedCount,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteMonitorDialogProps) => {
  const isBulkDelete = Boolean(selectedCount && selectedCount > 0);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete monitor?</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulkDelete
              ? `This will permanently delete ${selectedCount} selected monitor${selectedCount === 1 ? '' : 's'}. This action cannot be undone.`
              : monitor
                ? `This will permanently delete “${monitor.name}”. This action cannot be undone.`
                : 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : isBulkDelete ? 'Delete monitors' : 'Delete monitor'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteMonitorDialog };
