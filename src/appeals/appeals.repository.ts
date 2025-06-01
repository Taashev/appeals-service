import { FindManyOptions, In, Repository } from 'typeorm';

import { AppealEntity } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { QueryParamsDateFilter } from './types/types';

export class AppealsRepository {
	constructor(private appealsRepository: Repository<AppealEntity>) {}

	create(createAppealDto: CreateAppealDto) {
		return this.appealsRepository.create(createAppealDto);
	}

	async save(appealEntity: AppealEntity) {
		return await this.appealsRepository.save(appealEntity);
	}

	async updateStatuses(
		ids: AppealEntity['id'][],
		newStatus: AppealStatusEntity,
	) {
		return await this.appealsRepository.update(ids, { status: newStatus });
	}

	async getById(id: AppealEntity['id']) {
		return await this.appealsRepository.findOne({
			where: { id },
			relations: { status: true },
		});
	}

	async getAll(ids?: AppealEntity['id'][]) {
		const findOptions: FindManyOptions<AppealEntity> = {
			relations: { status: true },
		};

		if (ids !== undefined) {
			findOptions.where = { id: In(ids) };
		}

		return await this.appealsRepository.find(findOptions);
	}

	async getAllByStatusId(statusId: number) {
		return await this.appealsRepository.find({
			relations: { status: true },
			where: { status: { id: statusId } },
		});
	}

	async getAllWithDateFilter(dateFilter: Partial<QueryParamsDateFilter>) {
		const { range, date } = dateFilter;

		const queryBuilder = this.appealsRepository
			.createQueryBuilder('appeal')
			.leftJoinAndSelect('appeal.status', 'status');

		if (range) {
			queryBuilder.where(
				'DATE(appeal.created_at) BETWEEN :dateFrom AND :dateTo',
			);
			queryBuilder.setParameter('dateFrom', range.dateFrom);
			queryBuilder.setParameter('dateTo', range.dateTo);
		} else if (date) {
			queryBuilder.where('DATE(appeal.created_at) = :date');
			queryBuilder.setParameter('date', date);
		}

		return await queryBuilder.getMany();
	}
}
