import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

import { AppealEntity } from '../../appeals/entities/appeal.entity';
import { AppealStatusEntity } from '../../appeal-status/entities/appeal-status.entity';

@Entity({ name: 'appeal_status_history' })
@Unique('UQ_appeal_status_timestamp', ['created_at', 'appeal', 'status'])
export class AppealStatusHistoryEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	created_at!: Date;

	@Column({ type: 'varchar', length: 1000, nullable: true })
	comment?: string;

	@ManyToOne(() => AppealEntity, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'appeal_id' })
	appeal!: AppealEntity;

	@ManyToOne(() => AppealStatusEntity, { nullable: false })
	@JoinColumn({ name: 'status_id' })
	status!: AppealStatusEntity;
}
