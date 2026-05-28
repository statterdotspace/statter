// src/monitors/entities/monitor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrm } from './user.entity';
import { ProjectOrm } from './project.entity';
import { WorkspaceOrm } from './workspace.entity';
import { CheckOrm } from './check.entity';
import { MonitorRegion, MonitorStatus, MonitorType } from './enums';

@Entity('monitors')
export class MonitorOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId!: string;

  @ManyToOne(() => WorkspaceOrm, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceOrm;

  @Index()
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => ProjectOrm, (project) => project.monitors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectOrm;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string;

  @ManyToOne(() => UserOrm, (user) => user.createdMonitors, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_id' })
  createdBy?: UserOrm;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'enum', enum: MonitorType })
  type!: MonitorType;

  @Index()
  @Column({ type: 'enum', enum: MonitorRegion })
  region!: MonitorRegion;

  @Column({ name: 'interval_seconds', type: 'int', default: 60 })
  intervalSeconds!: number;

  @Column({ name: 'timeout_ms', type: 'int', default: 10000 })
  timeoutMs!: number;

  @Column({ name: 'expected_status', type: 'int', default: 200 })
  expectedStatus!: number;

  @Index()
  @Column({
    type: 'enum',
    enum: MonitorStatus,
    default: MonitorStatus.ACTIVE,
  })
  status!: MonitorStatus;

  @Column({ name: 'last_check_at', type: 'timestamptz', nullable: true })
  lastCheckAt?: Date | null;

  @Column({ name: 'last_status', type: 'varchar', nullable: true })
  lastStatus?: string | null;

  @Column({ name: 'last_latency_ms', type: 'int', nullable: true })
  lastLatencyMs?: number | null;

  @Column({ name: 'last_queued_at', type: 'timestamptz', nullable: true })
  lastQueuedAt?: Date | null;

  @OneToMany(() => CheckOrm, (check) => check.monitor)
  checks!: CheckOrm[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
