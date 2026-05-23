import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckOrm } from '@statter/database';
import { Repository } from 'typeorm';

@Injectable()
export class CheckService {
  constructor(
    @InjectRepository(CheckOrm)
    private readonly checkRepo: Repository<CheckOrm>
  ) {}

  async findManyByMonitorId(monitorId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.checkRepo.findAndCount({
      where: { monitorId },
      order: { checkedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        perPage: limit,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findLatestByMonitorId(monitorId: string) {
    return await this.checkRepo.findOne({
      where: { monitorId },
      order: { checkedAt: 'DESC' },
    });
  }
}
