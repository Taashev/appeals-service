import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusHistoryRepository } from './appeal-status-history.repository';

export class AppealStatusHistoryService {
	constructor(
		private appealStatusHistoryRepository: AppealStatusHistoryRepository,
	) {}

	async createAppealStatusHistory(
		appealEntity: AppealEntity,
		appealStatusEntity: AppealStatusEntity,
		comment?: string,
	) {
		const buildItemHistory = this.appealStatusHistoryRepository.create(
			appealEntity,
			appealStatusEntity,
		);

		buildItemHistory.comment ??= comment;

		const createdItemHistory = await this.appealStatusHistoryRepository.save(
			buildItemHistory,
		);

		return createdItemHistory;
	}
}
