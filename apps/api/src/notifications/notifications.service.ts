import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationChannel, WorkspaceIntegrationOrm } from '@statter/database';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(WorkspaceIntegrationOrm)
    private readonly repo: Repository<WorkspaceIntegrationOrm>
  ) {}

  findAllByWorkspaceId(workspaceId: string) {
    return this.repo.find({ where: { workspaceId } });
  }

  findEnabledByWorkspaceId(workspaceId: string) {
    return this.repo.find({ where: { workspaceId, enabled: true } });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByWorkspaceAndChannel(workspaceId: string, channel: NotificationChannel) {
    return this.repo.findOne({ where: { workspaceId, channel } });
  }

  create(params: Partial<WorkspaceIntegrationOrm>) {
    return this.repo.save(params);
  }

  async update(id: string, params: Partial<WorkspaceIntegrationOrm>) {
    await this.repo.update(id, params);
    return this.findById(id);
  }

  async upsert(workspaceId: string, channel: NotificationChannel, config: Record<string, unknown>) {
    const existing = await this.findByWorkspaceAndChannel(workspaceId, channel);
    if (existing) {
      return this.update(existing.id, { config, enabled: true });
    }
    return this.create({ workspaceId, channel, config, enabled: true });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
