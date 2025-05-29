import { Repository } from 'typeorm';

import { AppealStatusHistoryEntity } from './entities/appeal_status_history.entity';
import { AppealEntity } from '../appeals/entities/appeal.entity';
import { AppealStatusEntity } from '../appeal-status/entities/appeal-status.entity';

export class AppealStatusHistoryRepository {
	constructor(
		private appealStatusHistoryRepository: Repository<AppealStatusHistoryEntity>,
	) {}

	create(appealEntity: AppealEntity, appealStatusEntity: AppealStatusEntity) {
		return this.appealStatusHistoryRepository.create({
			appeal: appealEntity,
			status: appealStatusEntity,
		});
	}

	save(appealStatusHistoryEntity: AppealStatusHistoryEntity) {
		return this.appealStatusHistoryRepository.save(appealStatusHistoryEntity);
	}
}
