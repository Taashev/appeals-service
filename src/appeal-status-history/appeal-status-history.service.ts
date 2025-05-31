import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusHistoryRepository } from './appeal-status-history.repository';

export class AppealStatusHistoryService {
	constructor(
		private appealStatusHistoryRepository: AppealStatusHistoryRepository,
	) {}

	async saveOneAppealStatusHistory(
		appealEntity: AppealEntity,
		appealStatusEntity: AppealStatusEntity,
		comment?: string,
	) {
		const buildItemHistory = this.appealStatusHistoryRepository.createOne(
			appealEntity,
			appealStatusEntity,
		);

		buildItemHistory.comment ??= comment;

		const createdItemHistory = await this.appealStatusHistoryRepository.saveOne(
			buildItemHistory,
		);

		return createdItemHistory;
	}

	async saveManyAppealStatusHistory(
		appealEntities: AppealEntity[],
		appealStatusEntity: AppealStatusEntity,
		comment?: string,
	) {
		const createdItemsHistory = this.appealStatusHistoryRepository.createMany(
			appealEntities,
			appealStatusEntity,
		);

		for (const item of createdItemsHistory) {
			item.comment ??= comment;
		}

		const savedItemsHistory = await this.appealStatusHistoryRepository.saveMany(
			createdItemsHistory,
		);

		return savedItemsHistory;
	}

	async getLatestHistory(appealId: string) {
		return await this.appealStatusHistoryRepository.getLastHistoryByAppealId(
			appealId,
		);
	}
}
