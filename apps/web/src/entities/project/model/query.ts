'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/shared/api';

const useProjects = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const listQuery = useQuery({
    queryKey: ['projects', page, perPage],
    queryFn: () => projectApi.list({ page, perPage, sortBy: 'createdAt', sortOrder: 'DESC' }),
  });

  return useMemo(
    () => ({
      page,
      perPage,
      setPage,
      setPerPage,
      listQuery,
    }),
    [page, perPage, listQuery]
  );
};

export { useProjects };
