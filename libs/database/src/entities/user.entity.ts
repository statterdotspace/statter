import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkspaceMemberOrm } from './workspace-member.entity';
import { InvitationOrm } from './invitations.entity';
import { ProjectOrm } from './project.entity';
import { MonitorOrm } from './monitor.entity';
import { EnumUserProvider, EnumUserRole } from './enums';

@Entity('users')
export class UserOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  passwordHash!: string | null;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName!: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl!: string | null;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true, default: null })
  verifiedAt!: Date | null;

  @Column({ name: 'is_two_factor_enabled', type: 'boolean', default: false })
  isTwoFactorEnabled!: boolean;

  @Column({ type: 'enum', enum: EnumUserRole, default: EnumUserRole.USER })
  role!: EnumUserRole;

  @Column({ type: 'enum', enum: EnumUserProvider, default: EnumUserProvider.EMAIL })
  provider!: EnumUserProvider;

  @OneToMany(() => WorkspaceMemberOrm, (member) => member.user)
  workspaceMemberships!: WorkspaceMemberOrm[];

  @OneToMany(() => InvitationOrm, (invitation) => invitation.invitedUser)
  invitations!: InvitationOrm[];

  @OneToMany(() => ProjectOrm, (project) => project.createdBy)
  createdProjects!: ProjectOrm[];

  @OneToMany(() => MonitorOrm, (monitor) => monitor.createdBy)
  createdMonitors!: MonitorOrm[];
}
