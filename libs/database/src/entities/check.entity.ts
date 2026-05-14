import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { MonitorOrm } from './monitor.entity';
import { CheckStatus, MonitorRegion } from './enums';

@Entity('checks')
@Index(['monitorId', 'checkedAt'])
export class CheckOrm {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'checked_at' })
  checkedAt!: Date;

  @Index()
  @Column({ name: 'monitor_id', type: 'uuid' })
  monitorId!: string;

  @ManyToOne(() => MonitorOrm, (monitor) => monitor.checks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'monitor_id' })
  monitor!: MonitorOrm;

  @Index()
  @Column({ type: 'enum', enum: CheckStatus })
  status!: CheckStatus;

  @Column({ name: 'status_code', type: 'int', nullable: true })
  statusCode!: number | null;

  @Column({ name: 'latency_ms', type: 'int', nullable: true })
  latencyMs!: number | null;

  @Index()
  @Column({ type: 'enum', enum: MonitorRegion })
  region!: MonitorRegion;

  @Column({ name: 'response_size_bytes', type: 'int', nullable: true })
  responseSizeBytes!: number | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage!: string | null;
}
