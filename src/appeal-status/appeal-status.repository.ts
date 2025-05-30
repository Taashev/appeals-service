import { Repository } from 'typeorm';
import { AppealStatusEntity } from './entities/appeal-status.entity';
import { APPEAL_STATUSES } from './enums/statuses';

export class AppealStatusRepository {
	constructor(private appealStatusRepository: Repository<AppealStatusEntity>) {}

	async getStatusNew() {
		return await this.appealStatusRepository.findOneBy({
			value: APPEAL_STATUSES.NEW,
		});
	}

	async getStatusWork() {
		return await this.appealStatusRepository.findOneBy({
			value: APPEAL_STATUSES.IN_WORK,
		});
	}

	async getStatusCompleted() {
		return await this.appealStatusRepository.findOneBy({
			value: APPEAL_STATUSES.COMPLETED,
		});
	}

	async getStatusByValue(value: APPEAL_STATUSES) {
		return await this.appealStatusRepository.findOneBy({ value });
	}
}
