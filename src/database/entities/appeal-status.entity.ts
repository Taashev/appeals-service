import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AppealEntity } from './appeal.entity';

@Entity({ name: 'appeal_status' })
export class AppealStatusEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'varchar', length: 30, nullable: false, unique: true })
	value!: string;

	@OneToMany(() => AppealEntity, (appealEntity) => appealEntity.status)
	appeals!: AppealEntity[];
}
