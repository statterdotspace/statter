// src/projects/entities/project.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { WorkspaceOrm } from './workspace.entity';
import { UserOrm } from './user.entity';
import { MonitorOrm } from './monitor.entity';

@Entity('projects')
@Unique(['workspaceId', 'slug'])
export class ProjectOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId!: string;

  @ManyToOne(() => WorkspaceOrm, (workspace) => workspace.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceOrm;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string;

  @ManyToOne(() => UserOrm, (user) => user.createdProjects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: UserOrm;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => MonitorOrm, (monitor) => monitor.project)
  monitors!: MonitorOrm[];
}
