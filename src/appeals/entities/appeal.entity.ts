import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { AppealStatusEntity } from '../../appeal-status/entities/appeal-status.entity';

@Entity({ name: 'appeals' })
export class AppealEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	@Column({ type: 'varchar', length: 255, nullable: false })
	theme!: string;

	@Column({ type: 'varchar', length: 1000, nullable: false })
	message!: string;

	@ManyToOne(() => AppealStatusEntity, (appealStatus) => appealStatus.appeals, {
		nullable: false,
	})
	@JoinColumn({ name: 'status_id' })
	status!: AppealStatusEntity;
}
