import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusHistoryRepository } from './appeal-status-history.repository';
import { AppealStatusHistoryEntity } from './entities/appeal_status_history.entity';

export class AppealStatusHistoryService {
	constructor(
		private appealStatusHistoryRepository: AppealStatusHistoryRepository,
	) {}

	async saveAppealStatusHistory(
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

		const savedItemsHistory = await this.appealStatusHistoryRepository.save(
			createdItemsHistory,
		);

		return savedItemsHistory;
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
