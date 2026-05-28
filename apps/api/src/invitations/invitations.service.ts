import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationOrm, InvitationStatus } from '@statter/database';
import { In, MoreThan, Repository } from 'typeorm';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(InvitationOrm)
    private readonly invitationRepo: Repository<InvitationOrm>
  ) {}

  async listPendingByWorkspaceId(workspaceId: string, now: Date) {
    return await this.invitationRepo.find({
      where: { workspaceId, status: InvitationStatus.PENDING, expiresAt: MoreThan(now) },
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingByWorkspaceAndEmail(workspaceId: string, email: string) {
    return await this.invitationRepo.findOne({
      where: { workspaceId, email, status: InvitationStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingByWorkspaceAndEmails(workspaceId: string, emails: string[]) {
    if (emails.length === 0) {
      return [];
    }

    return await this.invitationRepo.find({
      where: {
        workspaceId,
        status: InvitationStatus.PENDING,
        email: In(emails),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByIdAndWorkspaceId(invitationId: string, workspaceId: string) {
    return await this.invitationRepo.findOne({
      where: { id: invitationId, workspaceId },
      relations: { workspace: true },
    });
  }

  async findByToken(token: string) {
    return await this.invitationRepo.findOne({
      where: { token },
      relations: { workspace: true },
    });
  }

  async create(params: Partial<InvitationOrm>) {
    return await this.invitationRepo.save(params);
  }

  async update(id: string, params: Partial<InvitationOrm>) {
    return this.invitationRepo.save({ id, ...params });
  }

  async createMany(params: Partial<InvitationOrm>[]) {
    return await this.invitationRepo.save(params);
  }

  async updateMany(params: Partial<InvitationOrm>[]) {
    return await this.invitationRepo.save(params.map((param) => ({ id: param.id, ...param })));
  }

  async expirePending(workspaceId: string, now: Date) {
    await this.invitationRepo
      .createQueryBuilder()
      .update(InvitationOrm)
      .set({ status: InvitationStatus.EXPIRED, respondedAt: now })
      .where('workspace_id = :workspaceId', { workspaceId })
      .andWhere('status = :status', { status: InvitationStatus.PENDING })
      .andWhere('expires_at < :now', { now })
      .execute();
  }
}
