import { AnimatePresence, motion } from 'motion/react';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ListFooterBarProps {
  selectedCount: number;
  itemLabel: string;
  isDeletingSelection?: boolean;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (updater: (prev: number) => number) => void;
}

const ListFooterBar = ({
  selectedCount,
  itemLabel,
  isDeletingSelection = false,
  onClearSelection,
  onDeleteSelected,
  page,
  perPage,
  total,
  totalPages,
  onPageChange,
}: ListFooterBarProps) => {
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = total === 0 ? 0 : Math.min(page * perPage, total);
  const transition = { duration: 0.1, ease: 'easeInOut' } as const;

  return (
    <div className="mt-4 absolute bottom-8 left-[calc(50%-125px)] w-[500px] flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <AnimatePresence mode="wait" initial={false}>
        {selectedCount > 0 ? (
          <motion.div
            key="selection"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={transition}
            className="flex w-full items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <button
                type="button"
                aria-label="Clear selection"
                onClick={onClearSelection}
                className="inline-flex size-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-4" />
              </button>
              <span>{selectedCount} selected</span>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={onDeleteSelected}
              disabled={isDeletingSelection}
            >
              <Trash2 className="size-3.5" />
              {isDeletingSelection ? 'Deleting...' : 'Delete'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="pagination"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={transition}
            className="flex w-full items-center justify-between gap-3"
          >
            <span className="text-sm text-neutral-600">
              Viewing {from}-{to} of {total} {itemLabel}
            </span>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => onPageChange((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => onPageChange((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { ListFooterBar };
