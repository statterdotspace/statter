import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckOrm, MonitorOrm, MonitorRegion, MonitorStatus, MonitorType } from '@statter/database';
import { Repository } from 'typeorm';

type ListMonitorsParams = {
  page: number;
  perPage: number;
  projectId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'lastCheckAt';
  sortOrder?: 'ASC' | 'DESC';
  status?: MonitorStatus;
  type?: MonitorType;
  region?: MonitorRegion;
};

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(MonitorOrm)
    private readonly monitorRepo: Repository<MonitorOrm>,
    @InjectRepository(CheckOrm)
    private readonly checkRepo: Repository<CheckOrm>
  ) {}

  async findManyByWorkspaceId(workspaceId: string, params: ListMonitorsParams) {
    const page = params.page;
    const perPage = params.perPage;
    const skip = (page - 1) * perPage;

    const sortFieldByKey: Record<
      NonNullable<ListMonitorsParams['sortBy']>,
      'monitor.createdAt' | 'monitor.updatedAt' | 'monitor.name' | 'monitor.lastCheckAt'
    > = {
      createdAt: 'monitor.createdAt',
      updatedAt: 'monitor.updatedAt',
      name: 'monitor.name',
      lastCheckAt: 'monitor.lastCheckAt',
    };

    const sortBy = params.sortBy ?? 'createdAt';
    const sortOrder = params.sortOrder ?? 'DESC';

    const query = this.monitorRepo
      .createQueryBuilder('monitor')
      .where('monitor.workspaceId = :workspaceId', { workspaceId });

    if (params.projectId) {
      query.andWhere('monitor.projectId = :projectId', { projectId: params.projectId });
    }

    if (params.search) {
      query.andWhere('(monitor.name ILIKE :search OR monitor.description ILIKE :search)', {
        search: `%${params.search}%`,
      });
    }

    if (params.status) {
      query.andWhere('monitor.status = :status', { status: params.status });
    }

    if (params.type) {
      query.andWhere('monitor.type = :type', { type: params.type });
    }

    if (params.region) {
      query.andWhere('monitor.region = :region', { region: params.region });
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
    return await this.monitorRepo.findOne({
      where: {
        id,
        workspaceId,
      },
    });
  }

  async createMonitor(params: Partial<MonitorOrm>) {
    return await this.monitorRepo.save(params);
  }

  async updateMonitorById(id: string, params: Partial<MonitorOrm>) {
    await this.monitorRepo.update(id, params);
    return await this.monitorRepo.findOne({ where: { id } });
  }

  async deleteMonitorById(id: string) {
    await this.monitorRepo.delete(id);
  }

  async findLatestCheckByMonitorId(monitorId: string) {
    return await this.checkRepo.findOne({
      where: { monitorId },
      order: { checkedAt: 'DESC' },
    });
  }

  async findLatestChecksByMonitorIds(monitorIds: string[]) {
    if (monitorIds.length === 0) {
      return new Map<string, CheckOrm | null>();
    }

    const checks = await Promise.all(
      monitorIds.map(async (monitorId) => ({
        monitorId,
        check: await this.findLatestCheckByMonitorId(monitorId),
      }))
    );

    return new Map(checks.map((item) => [item.monitorId, item.check]));
  }
}
