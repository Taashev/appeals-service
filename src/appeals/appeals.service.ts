import { plainToInstance } from 'class-transformer';

import { AppealStatusHistoryService } from '../appeal-status-history/appeal-status-history.service';
import { AppealStatusService } from '../appeal-status/appeal-status.service';
import { NotFoundError } from '../errors/not-found.error';
import { AppealsRepository } from './appeals.repository';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { ResponseCreateAppealDto } from './dto/response-create-appeal.dto';
import { ResponseUpdateStatusAppealDto } from './dto/response-update-status-appeal.dto';

export class AppealsService {
	constructor(
		private appealsRepository: AppealsRepository,
		private appealStatusService: AppealStatusService,
		private appealStatusHistoryService: AppealStatusHistoryService,
	) {}

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

		const responseAppealDto = plainToInstance(
			ResponseCreateAppealDto,
			createdAppeal,
			{ excludeExtraneousValues: true },
		);

		return responseAppealDto;
	}

	async takeToWork(appealId: string, comment?: string) {
		// получаем заявку по id
		const appeal = await this.appealsRepository.getById(appealId);

		if (!appeal) {
			throw new NotFoundError('Заявка не найдена');
		}

		// получаем статус "в работе"
		const workStatus = await this.appealStatusService.getStatusWorkOrFail();

		// обновляем статус заявки
		await this.appealsRepository.updateStatus(appealId, workStatus);

		// записываем заявку в историю
		const latestHistory =
			await this.appealStatusHistoryService.createAppealStatusHistory(
				appeal,
				workStatus,
				comment,
			);

		// получаем обновленную заявку
		const updatedAppeal = await this.appealsRepository.getById(appealId);

    // преобразуем в DTO
		const responseAppealDto = plainToInstance(
			ResponseUpdateStatusAppealDto,
			updatedAppeal,
			{ excludeExtraneousValues: true },
		);

    // добавляем комментарий к заявке
		responseAppealDto.comment = latestHistory.comment ?? '';

		return responseAppealDto;
	}
}
