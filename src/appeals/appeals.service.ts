import { plainToInstance } from 'class-transformer';

import { AppealStatusHistoryService } from '../appeal-status-history/appeal-status-history.service';
import { AppealStatusService } from '../appeal-status/appeal-status.service';
import { NotFoundError } from '../errors/not-found.error';
import { AppealsRepository } from './appeals.repository';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { ResponseAppealDto } from './dto/response-appeal.dto';
import { APPEAL_STATUSES } from '../appeal-status/enums/statuses';
import { AppealEntity } from './entities/appeal.entity';
import { DateFilter } from './types/types';

export class AppealsService {
	constructor(
		private appealsRepository: AppealsRepository,
		private appealStatusService: AppealStatusService,
		private appealStatusHistoryService: AppealStatusHistoryService,
	) {}

	async getAllWithDateFilter(dateFilter: DateFilter) {
		let appeals: AppealEntity[] = [];

		if (dateFilter.range) {
			appeals = await this.appealsRepository.getAllWithDateRangeFilter(
				dateFilter.range,
			);
		} else if (dateFilter.date) {
			appeals = await this.appealsRepository.getAllWithDateFilter(
				dateFilter.date,
			);
		} else {
			appeals = await this.appealsRepository.getAll();
		}

		// добавляем историю последнего статуса в заявки
		await this.mapAppealStatusLastHistory(appeals);

		// преобразуем в DTO
		const responseAppealsDto = plainToInstance(ResponseAppealDto, appeals, {
			excludeExtraneousValues: true,
		});

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
		await this.appealStatusHistoryService.saveOneAppealStatusHistory(
			createdAppeal,
			defaultStatus,
		);

		// добавляем историю последнего статуса в заявку
		await this.mapAppealStatusLastHistory([createdAppeal]);

		// преобразуем в DTO
		const responseAppealDto = plainToInstance(
			ResponseAppealDto,
			createdAppeal,
			{ excludeExtraneousValues: true },
		);

		return responseAppealDto;
	}

	async updateStatusById(
		appealId: string,
		newStatusValue: APPEAL_STATUSES,
		comment?: string,
	) {
		// получаем заявку по id
		const appeal = await this.appealsRepository.getById(appealId);

		if (!appeal) {
			throw new NotFoundError('Заявка не найдена');
		}

		// получаем текущий статус обращения
		const currentStatus = appeal.status.value;

		// валидируем переходы статусов заявки
		this.appealStatusService.validateTransitionStatusesOrFail(
			currentStatus,
			newStatusValue,
		);

		// получаем новый статус
		const newStatus = await this.appealStatusService.getStatusByValueOrFail(
			newStatusValue,
		);

		// обновляем статус заявки
		await this.appealsRepository.updateStatuses([appeal.id], newStatus);

		// записываем заявку в историю
		const latestHistory =
			await this.appealStatusHistoryService.saveOneAppealStatusHistory(
				appeal,
				newStatus,
				comment,
			);

		// получаем обновленную заявку
		const updatedAppeal = await this.appealsRepository.getById(appealId);

		// добавляем состояние последнего статуса с комментарием к заявке
		await this.mapAppealStatusLastHistory([updatedAppeal!]);

		// преобразуем в DTO
		const responseAppealDto = plainToInstance(
			ResponseAppealDto,
			updatedAppeal,
			{ excludeExtraneousValues: true },
		);

		// добавляем комментарий к заявке
		responseAppealDto.comment = latestHistory.comment ?? '';

		return responseAppealDto;
	}

	async updateStatusByStatus(
		fromStatus: APPEAL_STATUSES,
		toStatus: APPEAL_STATUSES,
		comment?: string,
	) {
		// получаем статус
		const targetStatus = await this.appealStatusService.getStatusByValueOrFail(
			fromStatus,
		);

		// получаем статус "отменено"
		const newStatus = await this.appealStatusService.getStatusByValueOrFail(
			toStatus,
		);

		// получаем все заявки с указанным целевым статусом
		const targetAppeals = await this.appealsRepository.getAllByStatusId(
			targetStatus.id,
		);

		if (!targetAppeals.length) {
			throw new NotFoundError(
				`Заявки со статусом "${targetStatus.value}" не найдены`,
			);
		}

		// получаем массив id заявок
		const appealIds = targetAppeals.map((appeal) => appeal.id);

		// обновляем статусы заявок
		await this.appealsRepository.updateStatuses(appealIds, newStatus);

		// получаем обновленные заявки
		const updatedAppeals = await this.appealsRepository.getAllByIds(appealIds);

		// записываем заявки в историю с новым статусом и комментарием
		await this.appealStatusHistoryService.saveManyAppealStatusHistory(
			updatedAppeals,
			newStatus,
			comment,
		);

		// добавляем состояние последнего статуса с комментарием к заявкам
		await this.mapAppealStatusLastHistory(updatedAppeals);

		// преобразуем в DTO
		const responseAppealsDto = plainToInstance(
			ResponseAppealDto,
			updatedAppeals,
			{ excludeExtraneousValues: true },
		);

		return responseAppealsDto;
	}

	async mapAppealStatusLastHistory(appeals: AppealEntity[]) {
		for (const appeal of appeals) {
			const lastHistory =
				await this.appealStatusHistoryService.getLatestHistory(appeal.id);

			appeal.lastStatusHistory = lastHistory;
		}
	}
}
