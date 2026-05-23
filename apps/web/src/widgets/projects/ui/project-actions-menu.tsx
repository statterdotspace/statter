import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface ProjectActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectActionsMenu = ({ onEdit, onDelete }: ProjectActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            className="rounded-xl border border-transparent text-neutral-600 hover:border-neutral-200"
          />
        }
      >
        <EllipsisVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onEdit}>Edit project</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          Delete project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ProjectActionsMenu };
