import { NextFunction, Request, Response, Router } from 'express';

import { AppealsController } from './appeals.controller';
import { CreateAppealDto } from './dto/create-appeal.dto';

import { ValidateDtoMiddleware } from '../middlewares/validate.dto';

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

	createAppeal() {
		const path = this.buildPath();
		const validateDto = this.validateDto.validate(CreateAppealDto);
		const handlerCreateAppeal = this.appealsController.createAppeal;

		this.router.post(path, validateDto, handlerCreateAppeal);
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

	private init() {
		this.createAppeal();
		this.takeToWork();
		this.endAppeal();
	}

	get getRouter() {
		return this.router;
	}
}
