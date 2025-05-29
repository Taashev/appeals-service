import { StatusNotConfiguredError } from '../errors/status-not-configured.error';
import { AppealStatusRepository } from './appeal-status.repository';

export class AppealStatusService {
	constructor(private appealStatusRepository: AppealStatusRepository) {}

	async getStatusNewOrFail() {
		const defaultStatus = await this.appealStatusRepository.getNewStatus();

		if (!defaultStatus) {
			throw new StatusNotConfiguredError('Новое');
		}

		return defaultStatus;
	}

	async getStatusWorkOrFail() {
		const workStatus = await this.appealStatusRepository.getWorkStatus();

		if (!workStatus) {
			throw new StatusNotConfiguredError('В работе');
		}

		return workStatus;
	}
}
