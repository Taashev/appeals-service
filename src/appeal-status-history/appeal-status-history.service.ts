import { EntityManager } from 'typeorm';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusHistoryRepository } from './appeal-status-history.repository';
import { AppealStatusHistoryEntity } from './entities/appeal_status_history.entity';

export class AppealStatusHistoryService {
	constructor(
		private appealStatusHistoryRepository: AppealStatusHistoryRepository,
	) {}

	create(
		appealEntities: AppealEntity[],
		appealStatusEntity: AppealStatusEntity,
		comment?: AppealStatusHistoryEntity['comment'],
	) {
		const createdItemsHistory = this.appealStatusHistoryRepository.create(
			appealEntities,
			appealStatusEntity,
		);

		for (const item of createdItemsHistory) {
			item.comment ??= comment;
		}

		return createdItemsHistory;
	}

	async save(
		appealEntities: AppealEntity[],
		appealStatusEntity: AppealStatusEntity,
		comment?: AppealStatusHistoryEntity['comment'],
	) {
		const createdItemsHistory = this.create(
			appealEntities,
			appealStatusEntity,
			comment,
		);

		return await this.appealStatusHistoryRepository.save(createdItemsHistory);
	}

	async saveWithManager(
		manager: EntityManager,
		appealEntities: AppealEntity[],
		appealStatusEntity: AppealStatusEntity,
		comment?: AppealStatusHistoryEntity['comment'],
	) {
		const createdItemsHistory = this.create(
			appealEntities,
			appealStatusEntity,
			comment,
		);

		return await manager.save(AppealStatusHistoryEntity, createdItemsHistory);
	}

	async mapAppealStatusLastHistory(appeals: AppealEntity[]) {
		const appealsWithLastHistory: AppealEntity[] = [];

		for (const appeal of appeals) {
			const lastHistory =
				await this.appealStatusHistoryRepository.getLastHistoryByAppealId(
					appeal.id,
				);

			if (lastHistory) {
				const appealWithLastHistory: AppealEntity = {
					...appeal,
					lastStatusHistory: lastHistory,
				};

				appealsWithLastHistory.push(appealWithLastHistory);
			}
		}

		return appealsWithLastHistory;
	}
}
