import { Controller, Delete, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { WorkspaceMemberRole, WorkspaceMemberOrm, WorkspaceOrm } from '@statter/database';
import { toPaginatedDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentWorkspace } from '../workspace/decorators/current-workspace.decorator';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { WorkspaceWriteGuard } from '../workspace/guards/workspace-write.guard';
import { ListWorkspaceMembersQueryDto } from './dto/request/list-workspace-members-query.dto';
import { WorkspaceMemberRowDto } from './dto/response/workspace-member-row.dto';
import { InvitationsService } from '../invitations/invitations.service';
import { CurrentMember } from './decorators/current-member.decorator';
import { Member } from './decorators/member.decorator';
import { UnifiedMemberRow } from './types';
import { RemovableMemberGuard } from './guards/can-remove-member.guard';
import { MembersService } from './members.service';

@Controller('workspaces/current')
@UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard)
@Auth()
export class WorkspaceMembersController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly membersService: MembersService
  ) {}

  @Get('members')
  async listMembers(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @Member('role') memberRole: WorkspaceMemberRole,
    @Query() query: ListWorkspaceMembersQueryDto
  ) {
    const now = new Date();

    await this.invitationsService.expirePending(workspace.id, now);

    const [members, pendingInvitations] = await Promise.all([
      this.membersService.findByWorkspaceId(workspace.id),
      this.invitationsService.listPendingByWorkspaceId(workspace.id, now),
    ]);

    const rows: UnifiedMemberRow[] = [
      ...members.map((member) => ({
        id: member.id,
        email: member.user.email,
        role: member.role,
        status: 'active' as const,
        createdAt: member.joinedAt,
      })),
      ...pendingInvitations.map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: 'invited' as const,
        createdAt: invitation.createdAt,
      })),
    ];

    rows.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

    const page = query.page;
    const perPage = query.perPage;
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const data = rows
      .slice(start, start + perPage)
      .map((row) => ({ id: row.id, email: row.email, role: row.role, status: row.status }));

    return toPaginatedDto(WorkspaceMemberRowDto, {
      data,
      meta: { page, perPage, total, totalPages, currentUserRole: memberRole },
    });
  }

  @Delete('members/:memberId')
  @UseGuards(WorkspaceWriteGuard, RemovableMemberGuard)
  async removeMember(
    @Param('memberId', ParseUUIDPipe) _memberId: string,
    @CurrentMember() member: WorkspaceMemberOrm
  ) {
    await this.membersService.delete(member.id);
    return { success: true };
  }
}
