import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { WorkspaceMemberRole } from '@statter/database';

export class CreateInvitationItemDto {
  @IsEmail()
  email!: string;

  @IsIn([WorkspaceMemberRole.ADMIN, WorkspaceMemberRole.MEMBER])
  role!: WorkspaceMemberRole.ADMIN | WorkspaceMemberRole.MEMBER;
}

export class CreateWorkspaceInvitationsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => CreateInvitationItemDto)
  invitations!: CreateInvitationItemDto[];
}
