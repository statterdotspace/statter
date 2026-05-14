import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkspaceOrm } from './workspace.entity';
import { UserOrm } from './user.entity';
import { WorkspaceMemberRole } from './enums';

@Entity('workspace_members')
export class WorkspaceMemberOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt!: Date;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId!: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => WorkspaceOrm, (workspace) => workspace.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceOrm;

  @ManyToOne(() => UserOrm, (user) => user.workspaceMemberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrm;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role!: WorkspaceMemberRole;
}
