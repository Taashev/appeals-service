import { plainToInstance } from 'class-transformer';

import { AppealStatusHistoryService } from '../appeal-status-history/appeal-status-history.service';
import { AppealStatusService } from '../appeal-status/appeal-status.service';
import { NotFoundError } from '../errors/not-found.error';
import { AppealsRepository } from './appeals.repository';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { ResponseAppealDto } from './dto/response-appeal.dto';
import { APPEAL_STATUSES } from '../appeal-status/enums/statuses';
import { AppealEntity } from './entities/appeal.entity';
import { QueryParamsDateFilter } from './types/types';

export class AppealsService {
	constructor(
		private appealsRepository: AppealsRepository,
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
		const buildAppeal = this.appealsRepository.create(createAppealDto);

		// получем статус заявкм "новое"
		const defaultStatus = await this.appealStatusService.getStatusByValueOrFail(
			APPEAL_STATUSES.NEW,
		);

		buildAppeal.status = defaultStatus;

		// сохроняем заявку в бд
		const createdAppeal = await this.appealsRepository.save(buildAppeal);

		// записываем заявку в историю
		await this.appealStatusHistoryService.saveAppealStatusHistory(
			[createdAppeal],
			defaultStatus,
		);

		// добавляем историю последнего статуса в заявку
		const appealsWithLastHistory =
			await this.appealStatusHistoryService.mapAppealStatusLastHistory([
				createdAppeal,
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

		// обновляем статусы заявок
		await this.appealsRepository.updateStatuses(appealIds, newStatus);

		// получаем обновленные заявки
		const updatedAppeals = await this.appealsRepository.getAll(appealIds);

		// записываем заявки в историю с новым статусом и комментарием
		await this.appealStatusHistoryService.saveAppealStatusHistory(
			updatedAppeals,
			newStatus,
			comment,
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
