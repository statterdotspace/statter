'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { monitorApi } from '@/shared/api';

interface UseMonitorsOptions {
  projectId?: string;
}

const useMonitors = ({
  projectId,
}: UseMonitorsOptions = {}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const projectKey = projectId ?? 'all';

  const listQuery = useQuery({
    queryKey: ['monitors', page, perPage, projectKey],
    queryFn: () =>
      monitorApi.list({
        page,
        perPage,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        projectId,
      }),
  });

  return useMemo(
    () => ({
      page,
      perPage,
      setPage,
      setPerPage,
      listQuery,
      projectId,
    }),
    [page, perPage, listQuery, projectId]
  );
};

export { useMonitors };
