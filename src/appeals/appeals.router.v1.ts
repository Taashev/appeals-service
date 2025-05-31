import { Router } from 'express';

import { AppealsController } from './appeals.controller';
import { CreateAppealDto } from './dto/create-appeal.dto';

import { ValidateDtoMiddleware } from '../middlewares/validate.dto';
import { validationQueryParamsDateFilter } from './validate/validate-query-date-filter';

export class AppealsRouterV1 {
	private router: Router = Router();
	private prefix = '/appeals';

	constructor(
		private appealsController: AppealsController,
		private validateDto: ValidateDtoMiddleware,
	) {
		this.init();
	}

	private buildPath(path: string = '') {
		return this.prefix + path;
	}

	getAllAppealsWithDateFilter() {
		const path = this.buildPath();
		const handlerGetAllAppealsWithDateFilter =
			this.appealsController.getAllAppealsWithDateFilter;

		this.router.get(
			path,
			validationQueryParamsDateFilter,
			handlerGetAllAppealsWithDateFilter,
		);
	}

	createAppeal() {
		const path = this.buildPath();
		const validateBodyDto = this.validateDto.validateBody(CreateAppealDto);
		const handlerCreateAppeal = this.appealsController.createAppeal;

		this.router.post(path, validateBodyDto, handlerCreateAppeal);
	}

	takeToWork() {
		const path = this.buildPath('/:id/status/take');
		const handlerTakeToWork = this.appealsController.inWork;

		this.router.post(path, handlerTakeToWork);
	}

	endAppeal() {
		const path = this.buildPath('/:id/status/complete');
		const handlerEndEppeal = this.appealsController.endAppeal;

		this.router.post(path, handlerEndEppeal);
	}

	cancelAppeal() {
		const path = this.buildPath('/:id/status/cancel');
		const handlerCancelAppeal = this.appealsController.cancelAppeal;

		this.router.post(path, handlerCancelAppeal);
	}

	private init() {
		this.getAllAppealsWithDateFilter();
		this.createAppeal();
		this.takeToWork();
		this.endAppeal();
		this.cancelAppeal();
	}

	get getRouter() {
		return this.router;
	}
}
