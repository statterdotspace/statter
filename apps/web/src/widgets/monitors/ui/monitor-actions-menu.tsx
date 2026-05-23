import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface MonitorActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const MonitorActionsMenu = ({ onEdit, onDelete }: MonitorActionsMenuProps) => {
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
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-3.5" />
          Edit monitor
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash className="size-3.5" />
          Delete monitor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MonitorActionsMenu };
