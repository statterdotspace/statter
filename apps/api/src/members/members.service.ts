import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMemberOrm, WorkspaceMemberRole } from '@statter/database';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(WorkspaceMemberOrm)
    private readonly repository: Repository<WorkspaceMemberOrm>
  ) {}

  async findByWorkspaceId(workspaceId: string) {
    return await this.repository.find({
      where: { workspaceId },
      relations: { user: true },
      order: { joinedAt: 'DESC' },
    });
  }

  async findById(workspaceId: string, memberId: string) {
    return await this.repository.findOne({
      where: { id: memberId, workspaceId },
      relations: { user: true },
    });
  }

  async findByUserId(workspaceId: string, userId: string) {
    return await this.repository.findOne({
      where: { workspaceId, userId },
    });
  }

  async countByRole(workspaceId: string, role: WorkspaceMemberRole) {
    return await this.repository.count({
      where: { workspaceId, role },
    });
  }

  async create(params: Partial<WorkspaceMemberOrm>) {
    return await this.repository.save(params);
  }

  async delete(id: string) {
    await this.repository.delete(id);
  }
}
