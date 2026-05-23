import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectOrm } from '@statter/database';
import { Repository } from 'typeorm';

type ListProjectsParams = {
  page: number;
  perPage: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'ASC' | 'DESC';
};

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectOrm)
    private readonly projectRepo: Repository<ProjectOrm>
  ) {}

  async findManyByWorkspaceId(workspaceId: string, params: ListProjectsParams) {
    const page = params.page;
    const perPage = params.perPage;
    const skip = (page - 1) * perPage;

    const sortFieldByKey: Record<
      NonNullable<ListProjectsParams['sortBy']>,
      'project.createdAt' | 'project.updatedAt' | 'project.name'
    > = {
      createdAt: 'project.createdAt',
      updatedAt: 'project.updatedAt',
      name: 'project.name',
    };

    const sortBy = params.sortBy ?? 'createdAt';
    const sortOrder = params.sortOrder ?? 'DESC';

    const query = this.projectRepo
      .createQueryBuilder('project')
      .where('project.workspaceId = :workspaceId', { workspaceId });

    if (params.search) {
      query.andWhere('(project.name ILIKE :search OR project.description ILIKE :search)', {
        search: `%${params.search}%`,
      });
    }

    const [data, total] = await query
      .orderBy(sortFieldByKey[sortBy], sortOrder)
      .skip(skip)
      .take(perPage)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.max(1, Math.ceil(total / perPage)),
      },
    };
  }

  async findByIdAndWorkspaceId(id: string, workspaceId: string) {
    return await this.projectRepo.findOne({
      where: {
        id,
        workspaceId,
      },
    });
  }

  async findBySlugInWorkspace(workspaceId: string, slug: string) {
    return await this.projectRepo.findOne({
      where: {
        workspaceId,
        slug,
      },
    });
  }

  async create(params: Partial<ProjectOrm>) {
    return await this.projectRepo.save(params);
  }

  async update(id: string, params: Partial<ProjectOrm>) {
    await this.projectRepo.update(id, params);
    return await this.projectRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    await this.projectRepo.delete(id);
  }
}
