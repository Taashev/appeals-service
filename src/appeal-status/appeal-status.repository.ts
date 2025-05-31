import { Repository } from 'typeorm';
import { AppealStatusEntity } from './entities/appeal-status.entity';
import { APPEAL_STATUSES } from './enums/statuses';

export class AppealStatusRepository {
	constructor(private appealStatusRepository: Repository<AppealStatusEntity>) {}

	async getStatusByValue(value: APPEAL_STATUSES) {
		return await this.appealStatusRepository.findOneBy({ value });
	}
}
