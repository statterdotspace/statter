import type { Project } from '@/entities';
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

interface DeleteProjectDialogProps {
  isOpen: boolean;
  project: Project | null;
  selectedCount?: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const DeleteProjectDialog = ({
  isOpen,
  project,
  selectedCount,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: DeleteProjectDialogProps) => {
  const isBulkDelete = Boolean(selectedCount && selectedCount > 0);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            {isBulkDelete
              ? `This will permanently delete ${selectedCount} selected project${selectedCount === 1 ? '' : 's'}. This action cannot be undone.`
              : project
                ? `This will permanently delete “${project.name}”. This action cannot be undone.`
                : 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : isBulkDelete ? 'Delete projects' : 'Delete project'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteProjectDialog };
