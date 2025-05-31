import { In, Repository } from 'typeorm';

import { AppealEntity } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { QueryDateFilter, QueryDateRangeFilter } from './types/types';

export class AppealsRepository {
	constructor(private appealsRepository: Repository<AppealEntity>) {}

	create(createAppealDto: CreateAppealDto) {
		return this.appealsRepository.create(createAppealDto);
	}

	async save(createAppealDto: CreateAppealDto) {
		return await this.appealsRepository.save(createAppealDto);
	}

	async updateStatuses(ids: string[], newStatus: AppealStatusEntity) {
		return await this.appealsRepository.update(ids, { status: newStatus });
	}

	async getById(id: string) {
		return await this.appealsRepository.findOne({
			where: { id },
			relations: { status: true },
		});
	}

	async getAll() {
		return await this.appealsRepository.find({
			relations: { status: true },
		});
	}

	async getAllByIds(ids: string[]) {
		return await this.appealsRepository.find({
			where: { id: In(ids) },
			relations: { status: true },
		});
	}

	async getAllByStatusId(statusId: number) {
		return await this.appealsRepository.find({
			relations: { status: true },
			where: { status: { id: statusId } },
		});
	}

	async getAllWithDateFilter(date: QueryDateFilter) {
		const queryBuilder = this.appealsRepository
			.createQueryBuilder('appeal')
			.leftJoinAndSelect('appeal.status', 'status')
			.where('DATE(appeal.created_at) = :date', { date });

		return await queryBuilder.getMany();
	}

	async getAllWithDateRangeFilter(dateRangeFilter: QueryDateRangeFilter) {
		const { dateFrom, dateTo } = dateRangeFilter;

		const queryBuilder = this.appealsRepository
			.createQueryBuilder('appeal')
			.leftJoinAndSelect('appeal.status', 'status')
			.where('DATE(appeal.created_at) BETWEEN :dateFrom AND :dateTo', {
				dateFrom,
				dateTo,
			});

		return await queryBuilder.getMany();
	}
}
