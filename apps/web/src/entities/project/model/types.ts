export interface Project {
  id: string;
  workspaceId: string;
  createdById?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListQuery {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateProjectPayload {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  slug?: string;
  description?: string;
}
