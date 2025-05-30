import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppealEntity } from '../../appeals/entities/appeal.entity';
import { APPEAL_STATUSES } from '../enums/statuses';

@Entity({ name: 'appeal_status' })
export class AppealStatusEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	value!: APPEAL_STATUSES;

	@OneToMany(() => AppealEntity, (appealEntity) => appealEntity.status)
	appeals!: AppealEntity[];
}
