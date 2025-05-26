import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';
import { AppealEntity } from './appeal.entity';

@Entity({ name: 'appeal_status_history' })
@Unique('UQ_appeal_status_timestamp', ['created_at', 'appeal_id', 'status_id'])
export class AppealStatusHistoryEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn()
	created_at!: Date;

	@Column({ type: 'varchar', length: 1000, nullable: true })
	comment?: string;

	@ManyToOne(() => AppealEntity, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'appeal_id' })
	appeal_id!: string;

	@ManyToOne(() => AppealStatusHistoryEntity, { nullable: false })
	@JoinColumn({ name: 'status_id' })
	status_id!: number;
}
