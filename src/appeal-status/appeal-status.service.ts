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
		// получаем массив статусов, в которые можно перейти из текущего
		const allowedStatuses = allowedTransitionStatuses[currentStatus];
		// проверяем, что новый статус находится в массиве разрешенных статусов
		const isAllowed = allowedStatuses.includes(newStatus);

		// если новый статус не разрешен, выбрасываем ошибку
		if (!isAllowed) {
			// проверяем, есть ли у текущего статуса специфическое сообщение об ошибке
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
