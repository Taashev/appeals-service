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
		await this.mapAppealLastHistory(appeals);

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
		const defaultStatus = await this.appealStatusService.getStatusNewOrFail();

		buildAppeal.status = defaultStatus;

		// сохроняем заявку в бд
		const createdAppeal = await this.appealsRepository.save(buildAppeal);

		// записываем заявку в историю
		await this.appealStatusHistoryService.createAppealStatusHistory(
			createdAppeal,
			defaultStatus,
		);

		// добавляем историю последнего статуса в заявку
		await this.mapAppealLastHistory([createdAppeal]);

		// преобразуем в DTO
		const responseAppealDto = plainToInstance(
			ResponseAppealDto,
			createdAppeal,
			{ excludeExtraneousValues: true },
		);

		return responseAppealDto;
	}

	async updateStatus(
		appealId: string,
		newStatusValue: APPEAL_STATUSES,
		comment?: string,
	) {
		// получаем заявку по id
		const appeal = await this.appealsRepository.getById(appealId);

		if (!appeal) {
			throw new NotFoundError('Заявка не найдена');
		}

		// получаем текущий статус
		const currentStatus = appeal.status.value;

		// валидируем переходы статусов заявки
		this.appealStatusService.validateTransitionStatusesOrFail(
			currentStatus,
			newStatusValue,
		);

		// получаем статус
		const status = await this.appealStatusService.getStatusByValueOrFail(
			newStatusValue,
		);

		// обновляем статус заявки
		await this.appealsRepository.updateStatus(appealId, status);

		// записываем заявку в историю
		const latestHistory =
			await this.appealStatusHistoryService.createAppealStatusHistory(
				appeal,
				status,
				comment,
			);

		// получаем обновленную заявку
		const updatedAppeal = await this.appealsRepository.getById(appealId);

		// добавляем историю последнего статуса в заявку
		await this.mapAppealLastHistory([updatedAppeal!]);

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

	async mapAppealLastHistory(appeals: AppealEntity[]) {
		for (const appeal of appeals) {
			const lastHistory =
				await this.appealStatusHistoryService.getLatestHistory(appeal.id);

			appeal.lastStatusHistory = lastHistory;
		}
	}
}
