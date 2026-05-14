import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { WorkspaceOrm } from './workspace.entity';
import { UserOrm } from './user.entity';
import { InvitationStatus, WorkspaceMemberRole } from './enums';

@Entity('invitations')
export class InvitationOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId!: string;

  @ManyToOne(() => WorkspaceOrm, (workspace) => workspace.invitations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceOrm;

  @Index()
  @Column({ type: 'varchar' })
  email!: string;

  @Column({ name: 'invited_user_id', type: 'uuid', nullable: true })
  invitedUserId?: string;

  @ManyToOne(() => UserOrm, (user) => user.invitations, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'invited_user_id' })
  invitedUser?: UserOrm;

  @Column({ name: 'invited_by_id', type: 'uuid' })
  invitedById!: string;

  @ManyToOne(() => UserOrm, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy!: UserOrm;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role!: WorkspaceMemberRole;

  @Index({ unique: true })
  @Column({ type: 'varchar' })
  token!: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status!: InvitationStatus;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date;
}
