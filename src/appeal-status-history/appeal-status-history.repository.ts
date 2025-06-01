import { Repository } from 'typeorm';

import { AppealStatusHistoryEntity } from './entities/appeal_status_history.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';

export class AppealStatusHistoryRepository {
	constructor(
		private appealStatusHistoryRepository: Repository<AppealStatusHistoryEntity>,
	) {}

	create(
		appealEntities: AppealEntity[],
		appealStatusEntity: AppealStatusEntity,
	) {
		return this.appealStatusHistoryRepository.create(
			appealEntities.map((appealEntity) => ({
				appeal: appealEntity,
				status: appealStatusEntity,
			})),
		);
	}

	async save(appealStatusHistoryEntities: AppealStatusHistoryEntity[]) {
		return await this.appealStatusHistoryRepository.save(
			appealStatusHistoryEntities,
		);
	}

	async getLastHistoryByAppealId(appealId: AppealEntity['id']) {
		return await this.appealStatusHistoryRepository.findOne({
			where: {
				appeal: {
					id: appealId,
				},
			},
			order: {
				created_at: 'DESC',
			},
		});
	}
}
