import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMemberOrm, WorkspaceOrm } from '@statter/database';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceOrm)
    private readonly workspaceRepo: Repository<WorkspaceOrm>,
    @InjectRepository(WorkspaceMemberOrm)
    private readonly workspaceMemberRepo: Repository<WorkspaceMemberOrm>
  ) {}

  async findById(id: string) {
    return await this.workspaceRepo.findOne({ where: { id } });
  }

  async findBySlug(slug: string) {
    return await this.workspaceRepo.findOne({ where: { slug } });
  }

  async create(params: Partial<WorkspaceOrm>) {
    return await this.workspaceRepo.save(params);
  }

  async update(id: string, params: Partial<WorkspaceOrm>) {
    await this.workspaceRepo.update(id, params);
    return await this.findById(id);
  }

  async delete(id: string) {
    await this.workspaceRepo.delete(id);
  }

  async createMembership(params: Partial<WorkspaceMemberOrm>) {
    return await this.workspaceMemberRepo.save(params);
  }

  async findMembership(workspaceId: string, userId: string) {
    return await this.workspaceMemberRepo.findOne({
      where: {
        workspaceId,
        userId,
      },
    });
  }

  async countMembershipsByUserId(userId: string) {
    return await this.workspaceMemberRepo.count({ where: { userId } });
  }

  async findWorkspacesByUserId(userId: string) {
    return await this.workspaceRepo
      .createQueryBuilder('workspace')
      .innerJoin('workspace_members', 'member', 'member.workspace_id = workspace.id')
      .where('member.user_id = :userId', { userId })
      .loadRelationCountAndMap('workspace.membersCount', 'workspace.members')
      .orderBy('workspace.created_at', 'DESC')
      .getMany();
  }
}
