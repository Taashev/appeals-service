import {
	allowedTransitionStatuses,
	statusTransitionErrorMessages,
} from '../appeals/constansts/status-transition.map';
import { BadRequestError } from '../errors/bad-request.error';
import { StatusNotConfiguredError } from '../errors/status-not-configured.error';
import { AppealStatusRepository } from './appeal-status.repository';
import { APPEAL_STATUSES } from './enums/statuses';

export class AppealStatusService {
	constructor(private appealStatusRepository: AppealStatusRepository) {}

	async getStatusNewOrFail() {
		const defaultStatus = await this.appealStatusRepository.getStatusNew();

		if (!defaultStatus) {
			throw new StatusNotConfiguredError(APPEAL_STATUSES.NEW);
		}

		return defaultStatus;
	}

	async getStatusWorkOrFail() {
		const workStatus = await this.appealStatusRepository.getStatusWork();

		if (!workStatus) {
			throw new StatusNotConfiguredError(APPEAL_STATUSES.IN_WORK);
		}

		return workStatus;
	}

	async getStatusCompletedOrFail() {
		const completedStatus =
			await this.appealStatusRepository.getStatusCompleted();

		if (!completedStatus) {
			throw new StatusNotConfiguredError(APPEAL_STATUSES.COMPLETED);
		}

		return completedStatus;
	}

	async getStatusByValueOrFail(status: APPEAL_STATUSES) {
		const statusEntity = await this.appealStatusRepository.getStatusByValue(
			status,
		);

		if (!statusEntity) {
			throw new StatusNotConfiguredError(status);
		}

		return statusEntity;
	}

	validateTransitionStatusesOrFail(
		currentStatus: APPEAL_STATUSES,
		newStatus: APPEAL_STATUSES,
	) {
		const allowedStatuses = allowedTransitionStatuses[currentStatus];
		const isAllowed = allowedStatuses.includes(newStatus);

		if (!isAllowed) {
			const specificError =
				statusTransitionErrorMessages[currentStatus]?.[newStatus];

			if (specificError) {
				throw new BadRequestError(specificError);
			}

			throw new BadRequestError(
				`Недопустимый переход из статуса ${currentStatus} в статус ${newStatus}`,
			);
		}
	}
}
