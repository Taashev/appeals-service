import { plainToInstance } from 'class-transformer';

import { NotFoundError } from '../errors/not-found.error';
import { APPEAL_STATUSES } from '../appeal-status/enums/statuses';
import { AppealStatusService } from '../appeal-status/appeal-status.service';
import { AppealStatusHistoryService } from '../appeal-status-history/appeal-status-history.service';

import { QueryParamsDateFilter } from './types/types';
import { AppealEntity } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { ResponseAppealDto } from './dto/response-appeal.dto';
import { AppealsRepository } from './appeals.repository';
import { AppealManagerRepository } from './appeals.manager.repository';

export class AppealsService {
	constructor(
		private appealsRepository: AppealsRepository,
		private appealManagerRepository: AppealManagerRepository,
		private appealStatusService: AppealStatusService,
		private appealStatusHistoryService: AppealStatusHistoryService,
	) {}

	async getAllWithDateFilter(dateFilter: QueryParamsDateFilter) {
		let appeals: AppealEntity[] = [];

		if (dateFilter.range) {
			appeals = await this.appealsRepository.getAllWithDateFilter({
				range: dateFilter.range,
			});
		} else if (dateFilter.date) {
			appeals = await this.appealsRepository.getAllWithDateFilter({
				date: dateFilter.date,
			});
		} else {
			appeals = await this.appealsRepository.getAll();
		}

		// получаем историю последнего статуса для каждой заявки
		const appealsWithLastHistory =
			await this.appealStatusHistoryService.mapAppealStatusLastHistory(appeals);

		// преобразуем в DTO
		const responseAppealsDto = this.convertToResponseAppealDto(
			appealsWithLastHistory,
		);

		return responseAppealsDto;
	}

	async createAppeal(createAppealDto: CreateAppealDto) {
		// создаем обьект заявки
		const createdAppeal = this.appealsRepository.create(createAppealDto);

		// получем статус заявкм "новое"
		const defaultStatus = await this.appealStatusService.getStatusByValueOrFail(
			APPEAL_STATUSES.NEW,
		);

		// создаем новое обращение через транзацию
		// если что то пойдет не так то обращение не будет записано в историю
		const savedAppeal = await this.appealManagerRepository.transaction(
			async (manager) => {
				const savedAppeal = await this.appealManagerRepository.save(manager, {
					...createdAppeal,
					status: defaultStatus,
				});

				await this.appealStatusHistoryService.saveWithManager(
					manager,
					[savedAppeal],
					defaultStatus,
				);

				return savedAppeal;
			},
			'Неудалось создать обращение. Попробуйте еще раз или обратитесь в поддержку.',
		);

		// добавляем историю последнего статуса в заявку
		const appealsWithLastHistory =
			await this.appealStatusHistoryService.mapAppealStatusLastHistory([
				savedAppeal,
			]);

		// преобразуем в DTO
		const responseAppealDto = this.convertToResponseAppealDto(
			appealsWithLastHistory,
		)[0];

		return responseAppealDto;
	}

	async updateStatusById(
		appealId: AppealEntity['id'],
		newStatusValue: APPEAL_STATUSES,
		comment?: string,
	) {
		const appeal = await this.appealsRepository.getById(appealId);

		if (!appeal) {
			throw new NotFoundError('Заявка не найдена');
		}

		// обновляем статус заявки с валидацией переходов
		const updatedAppeals = await this.applyStatusUpdate({
			appeals: [appeal],
			toStatus: newStatusValue,
			comment,
			validateTransition: true,
		});

		const responseAppealDto = this.convertToResponseAppealDto(updatedAppeals);

		return responseAppealDto;
	}

	async updateAllWithStatus(
		fromStatus: APPEAL_STATUSES,
		toStatus: APPEAL_STATUSES,
		comment?: string,
	) {
		// получаем текущий статус
		const currentStatus = await this.appealStatusService.getStatusByValueOrFail(
			fromStatus,
		);

		// получаем все заявки с указанным целевым статусом
		const appeals = await this.appealsRepository.getAllByStatusId(
			currentStatus.id,
		);

		if (!appeals.length) {
			throw new NotFoundError(
				`Заявки со статусом "${currentStatus.value}" не найдены`,
			);
		}

		// обновляем статусы заявок без валидации переходов
		const updatedAppeals = await this.applyStatusUpdate({
			appeals,
			toStatus,
			comment,
			validateTransition: false,
		});

		const responseAppealsDto = this.convertToResponseAppealDto(updatedAppeals);

		return responseAppealsDto;
	}

	// получает список обращений которые нужно обновить
	// вторым параметром статус на который нужно обновиться
	// по желанию можно добавить комментарий к этим заявкам и валидацию между переходами статусов
	// возвращает обращения с обновленными статусами и комментарием к статусу
	private async applyStatusUpdate({
		appeals,
		toStatus,
		comment,
		validateTransition = false,
	}: {
		appeals: AppealEntity[];
		toStatus: APPEAL_STATUSES;
		comment?: string;
		validateTransition?: boolean;
	}) {
		// получаем новый статус
		const newStatus = await this.appealStatusService.getStatusByValueOrFail(
			toStatus,
		);

		if (validateTransition) {
			// валидируем переходы статусов заявки
			for (const appeal of appeals) {
				this.appealStatusService.validateTransitionStatusesOrFail(
					appeal.status.value,
					toStatus,
				);
			}
		}

		// получаем массив id заявок
		const appealIds = appeals.map((appeal) => appeal.id);

		// Обновляем статусы заявок и сохроняем в историю через транзакцию.
		// В случае ошибки обновления заявки или сохранения историм операция полностью будет отменена.
		const updatedAppeals = await this.appealManagerRepository.transaction(
			async (manager) => {
				// обновляем статусы заявок
				await this.appealManagerRepository.updateStatuses(
					manager,
					appealIds,
					newStatus,
				);

				const updatedAppeals = await this.appealManagerRepository.getAll(
					manager,
					appealIds,
				);

				// записываем заявки в историю с новым статусом и комментарием
				await this.appealStatusHistoryService.saveWithManager(
					manager,
					updatedAppeals,
					newStatus,
					comment,
				);

				return updatedAppeals;
			},
			'Неудалось обновить статус заявок. Попробуйте еще раз или обратитесь в поддержку.',
		);

		// добавляем состояние последнего статуса с комментарием к заявкам
		const appealsWithLastHistory =
			await this.appealStatusHistoryService.mapAppealStatusLastHistory(
				updatedAppeals,
			);

		return appealsWithLastHistory;
	}

	convertToResponseAppealDto(appeals: AppealEntity[]) {
		return plainToInstance(ResponseAppealDto, appeals, {
			excludeExtraneousValues: true,
		});
	}
}
