import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  InvitationOrm,
  InvitationStatus,
  UserOrm,
  WorkspaceMemberRole,
  WorkspaceOrm,
} from '@statter/database';
import { toDto } from '@statter/utils';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AcceptInvitationResponseDto } from './dto/response/accept-invitation-response.dto';
import { InvitationsService } from './invitations.service';
import { MembersService } from '../members/members.service';
import { InvitationNotExistsGuard } from './guards/invitation-not-exist.guard';
import { CurrentInvitation } from '../members/decorators/current-invitation.decorator';
import { CreateWorkspaceInvitationsDto } from './dto/request/create-invitations.dto';
import { WorkspaceMemberRowDto } from '../members/dto/response/workspace-member-row.dto';
import { Member } from '../members/decorators/member.decorator';
import { CurrentWorkspace } from '../workspace/decorators/current-workspace.decorator';
import { WorkspaceExistsGuard } from '../workspace/guards/workspace-exists.guard';
import { WorkspaceHeaderGuard } from '../workspace/guards/workspace-header.guard';
import { WorkspaceMemberGuard } from '../workspace/guards/workspace-member.guard';
import { WorkspaceWriteGuard } from '../workspace/guards/workspace-write.guard';
import { INVITATION_EMAIL_TTL_DAYS } from './constants/invitation.constants';
import {
  INVITATION_EMAIL_REQUESTED_EVENT,
  INVITATIONS_EMAIL_REQUESTED_EVENT,
  InvitationEmailRequestedEvent,
} from './events/invitation-email-requested.event';
import { createInvitationToken } from './helpers/create-invitation-token';
import { UsersService } from '../users/users.service';
import { InvitationManageGuard } from './guards/invitation-manage.guard';
import { deduplicateInvitations } from './helpers/deduplicate-invitations.helper';
import { InvitationAcceptGuard } from './guards/invitation-accept.guard';

@Auth()
@Controller('invitations')
export class InvitationsController {
  private readonly frontendUrl!: string;

  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly membersService: MembersService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService
  ) {
    this.frontendUrl = this.configService.getOrThrow('app.frontendUrl');
  }

  @UseGuards(WorkspaceHeaderGuard, WorkspaceExistsGuard, WorkspaceMemberGuard, WorkspaceWriteGuard)
  @Post()
  async createInvitations(
    @CurrentWorkspace() workspace: WorkspaceOrm,
    @CurrentUser() user: UserOrm,
    @Member('role') memberRole: WorkspaceMemberRole,
    @Body() dto: CreateWorkspaceInvitationsDto
  ) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITATION_EMAIL_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invitations = deduplicateInvitations(dto.invitations);

    for (const invitation of invitations) {
      const canManage =
        memberRole === WorkspaceMemberRole.OWNER ||
        (memberRole === WorkspaceMemberRole.ADMIN &&
          invitation.role === WorkspaceMemberRole.MEMBER);

      if (!canManage) {
        throw new ForbiddenException(
          `You don't have permission to invite members with role ${invitation.role}`
        );
      }
    }

    await this.invitationsService.expirePending(workspace.id, now);

    const members = await this.membersService.findByWorkspaceId(workspace.id);
    const memberEmails = new Set(members.map((member) => member.user.email));

    const invitedRows: WorkspaceMemberRowDto[] = [];
    const invitationsToProcess = invitations.filter(
      (invitationPayload) => !memberEmails.has(invitationPayload.email)
    );
    const invitationEmails = invitationsToProcess.map(
      (invitationPayload) => invitationPayload.email
    );

    const [pendingInvitations, invitedUsers] = await Promise.all([
      this.invitationsService.findPendingByWorkspaceAndEmails(workspace.id, invitationEmails),
      this.usersService.findByEmails(invitationEmails),
    ]);

    const pendingInvitationsByEmail = new Map<string, InvitationOrm>();
    for (const pendingInvitation of pendingInvitations) {
      if (!pendingInvitationsByEmail.has(pendingInvitation.email)) {
        pendingInvitationsByEmail.set(pendingInvitation.email, pendingInvitation);
      }
    }

    const invitedUsersByEmail = new Map<string, UserOrm>();
    for (const invitedUser of invitedUsers) {
      if (!invitedUsersByEmail.has(invitedUser.email)) {
        invitedUsersByEmail.set(invitedUser.email, invitedUser);
      }
    }

    const expiredPendingInvitations = Array.from(pendingInvitationsByEmail.values()).filter(
      (pendingInvitation) => pendingInvitation.expiresAt.getTime() <= now.getTime()
    );

    if (expiredPendingInvitations.length > 0) {
      await this.invitationsService.updateMany(
        expiredPendingInvitations.map((pendingInvitation) => ({
          id: pendingInvitation.id,
          status: InvitationStatus.EXPIRED,
          respondedAt: now,
        }))
      );

      for (const pendingInvitation of expiredPendingInvitations) {
        pendingInvitationsByEmail.delete(pendingInvitation.email);
      }
    }

    const createInvitationParams: Partial<InvitationOrm>[] = [];
    const updateInvitationParams: Partial<InvitationOrm>[] = [];

    for (const invitationPayload of invitationsToProcess) {
      const pendingInvitation = pendingInvitationsByEmail.get(invitationPayload.email);
      const invitedUser = invitedUsersByEmail.get(invitationPayload.email);
      const token = pendingInvitation?.token ?? createInvitationToken();

      if (pendingInvitation) {
        updateInvitationParams.push({
          id: pendingInvitation.id,
          email: invitationPayload.email,
          role: invitationPayload.role,
          invitedById: user.id,
          invitedUserId: invitedUser?.id ?? null,
          token,
          status: InvitationStatus.PENDING,
          expiresAt,
          respondedAt: null,
        });
        continue;
      }

      createInvitationParams.push({
        workspaceId: workspace.id,
        email: invitationPayload.email,
        role: invitationPayload.role,
        invitedById: user.id,
        invitedUserId: invitedUser?.id ?? null,
        token,
        status: InvitationStatus.PENDING,
        expiresAt,
      });
    }

    const [updatedInvitations, createdInvitations] = await Promise.all([
      updateInvitationParams.length > 0
        ? this.invitationsService.updateMany(updateInvitationParams)
        : Promise.resolve<InvitationOrm[]>([]),
      createInvitationParams.length > 0
        ? this.invitationsService.createMany(createInvitationParams)
        : Promise.resolve<InvitationOrm[]>([]),
    ]);

    const invitationsByEmail = new Map<string, InvitationOrm>();
    for (const invitation of [...updatedInvitations, ...createdInvitations]) {
      invitationsByEmail.set(invitation.email, invitation);
    }

    const processedInvitations = invitationsToProcess
      .map((invitationPayload) => invitationsByEmail.get(invitationPayload.email))
      .filter((invitation): invitation is InvitationOrm => invitation !== undefined);

    const invitationEvents: InvitationEmailRequestedEvent[] = processedInvitations.map(
      (invitation) => ({
        email: invitation.email,
        workspaceName: workspace.name,
        role: invitation.role,
        inviteUrl: new URL(`/invites/${invitation.token}`, this.frontendUrl).toString(),
      })
    );

    invitedRows.push(
      ...processedInvitations.map((invitation) =>
        toDto(WorkspaceMemberRowDto, {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: 'invited',
        })
      )
    );

    if (invitationEvents.length === 1) {
      await this.eventEmitter.emitAsync(INVITATION_EMAIL_REQUESTED_EVENT, invitationEvents[0]);
    } else if (invitationEvents.length > 1) {
      await this.eventEmitter.emitAsync(INVITATIONS_EMAIL_REQUESTED_EVENT, {
        invitations: invitationEvents,
      });
    }

    return {
      data: invitedRows,
      meta: {
        requested: invitations.length,
        invited: invitedRows.length,
        skipped: invitations.length - invitedRows.length,
      },
    };
  }

  @UseGuards(
    WorkspaceHeaderGuard,
    WorkspaceExistsGuard,
    WorkspaceMemberGuard,
    WorkspaceWriteGuard,
    InvitationManageGuard
  )
  @Delete(':invitationId')
  async revokeInvitation(
    @Param('invitationId', ParseUUIDPipe) _invitationId: string,
    @CurrentInvitation() invitation: InvitationOrm
  ) {
    const now = new Date();
    if (invitation.expiresAt.getTime() <= now.getTime()) {
      await this.invitationsService.update(invitation.id, {
        status: InvitationStatus.EXPIRED,
        respondedAt: now,
      });
      throw new ConflictException('Invitation has expired');
    }

    await this.invitationsService.update(invitation.id, {
      status: InvitationStatus.DECLINED,
      respondedAt: now,
    });

    return { success: true };
  }

  @UseGuards(InvitationNotExistsGuard, InvitationAcceptGuard)
  @Post('accept/:token')
  async acceptInvitation(
    @Param('token') _token: string,
    @CurrentUser() user: UserOrm,
    @CurrentInvitation() invitation: InvitationOrm
  ) {
    const workspace = invitation.workspace;
    const existingMembership = await this.membersService.findByUserId(workspace.id, user.id);

    if (invitation.status !== InvitationStatus.PENDING) {
      if (existingMembership) {
        return toDto(AcceptInvitationResponseDto, {
          workspaceId: workspace.id,
          workspaceSlug: workspace.slug,
          workspaceName: workspace.name,
        });
      }

      throw new ConflictException('Invitation is no longer active');
    }

    const now = new Date();

    if (!existingMembership) {
      await this.membersService.create({
        workspaceId: workspace.id,
        userId: user.id,
        role: invitation.role,
      });
    }

    await this.invitationsService.update(invitation.id, {
      status: InvitationStatus.ACCEPTED,
      respondedAt: now,
      invitedUserId: user.id,
    });

    return toDto(AcceptInvitationResponseDto, {
      workspaceId: workspace.id,
      workspaceSlug: workspace.slug,
      workspaceName: workspace.name,
    });
  }
}
