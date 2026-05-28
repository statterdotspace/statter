'use client';

import type { MouseEvent } from 'react';
import type { WorkspaceMemberRow, WorkspaceMembersListMeta } from '@/entities';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

interface WorkspaceMembersSettingsProps {
  rows: WorkspaceMemberRow[];
  meta?: WorkspaceMembersListMeta;
  isLoading: boolean;
  processingRowId: string | null;
  onRevoke: (invitationId: string) => void;
  onRemove: (memberId: string) => void;
  onPageChange: (page: number) => void;
}

const getVisiblePages = (page: number, totalPages: number) => {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

const WorkspaceMembersSettings = ({
  rows,
  meta,
  isLoading,
  processingRowId,
  onRevoke,
  onRemove,
  onPageChange,
}: WorkspaceMembersSettingsProps) => {
  const currentUserRole = meta?.currentUserRole;
  const canManageRow = (row: WorkspaceMemberRow) => {
    if (currentUserRole === 'owner') {
      return true;
    }

    if (currentUserRole === 'admin' && row.role === 'member') {
      return true;
    }

    return false;
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              </>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No members or invitations yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const isRowPending = processingRowId === row.id;
                const canManage = canManageRow(row);

                return (
                  <TableRow key={`${row.status}-${row.id}`}>
                    <TableCell>{row.email}</TableCell>
                    <TableCell className="capitalize">{row.role}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'active' ? 'outline' : 'secondary'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.status === 'invited' ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRevoke(row.id)}
                          disabled={!canManage || isRowPending}
                        >
                          {isRowPending ? 'Revoking...' : 'Revoke'}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRemove(row.id)}
                          disabled={!canManage || isRowPending}
                        >
                          {isRowPending ? 'Removing...' : 'Remove'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 ? (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  if (meta.page > 1) {
                    onPageChange(meta.page - 1);
                  }
                }}
              />
            </PaginationItem>

            {getVisiblePages(meta.page, meta.totalPages).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === meta.page}
                  onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();
                    onPageChange(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                  event.preventDefault();
                  if (meta.page < meta.totalPages) {
                    onPageChange(meta.page + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </section>
  );
};

export { WorkspaceMembersSettings };
