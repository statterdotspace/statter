import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationOrm, WorkspaceMemberOrm, WorkspaceOrm } from '@statter/database';
import { UsersModule } from '../users/users.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { MembersModule } from '../members/members.module';
import { InvitationsListener } from './listeners/invitations.listener';
import { InvitationsService } from './invitations.service';
import { WorkspaceMembersController } from '../members/members.controller';
import { InvitationsController } from './invitations.controller';
import { InvitationManageGuard } from './guards/invitation-manage.guard';
import { RemovableMemberGuard } from '../members/guards/can-remove-member.guard';
import { InvitationAcceptGuard } from './guards/invitation-accept.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvitationOrm, WorkspaceMemberOrm, WorkspaceOrm]),
    UsersModule,
    WorkspaceModule,
    MembersModule,
  ],
  controllers: [WorkspaceMembersController, InvitationsController],
  providers: [
    InvitationsService,
    InvitationsListener,
    InvitationManageGuard,
    InvitationAcceptGuard,
    RemovableMemberGuard,
  ],
})
export class InvitationsModule {}
