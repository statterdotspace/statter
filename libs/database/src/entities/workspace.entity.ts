import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkspaceMemberOrm } from './workspace-member.entity';
import { InvitationOrm } from './invitations.entity';
import { ProjectOrm } from './project.entity';
import { WorkspacePlan } from './enums';

@Entity('workspaces')
export class WorkspaceOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  slug!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl!: string | null;

  @Column({ type: 'enum', enum: WorkspacePlan, default: WorkspacePlan.FREE })
  plan!: WorkspacePlan;

  @Column({ name: 'max_members', type: 'int', default: 1 })
  maxMembers!: number;

  @Column({ name: 'max_projects', type: 'int', default: 3 })
  maxProjects!: number;

  @Column({ name: 'max_monitors', type: 'int', default: 10 })
  maxMonitors!: number;

  @OneToMany(() => WorkspaceMemberOrm, (member) => member.workspace)
  members!: WorkspaceMemberOrm[];

  @OneToMany(() => InvitationOrm, (invitation) => invitation.workspace)
  invitations!: InvitationOrm[];

  @OneToMany(() => ProjectOrm, (project) => project.workspace)
  projects!: ProjectOrm[];
}
