import { Router } from 'express';

import { AppealsController } from './appeals.controller';
import { CreateAppealDto } from './dto/create-appeal.dto';

import { ValidateDto } from '../middlewares/validate.dto';

export class AppealsRouterV1 {
	private router: Router = Router();
	private prefix = '/appeals';

	constructor(
		private appealsController: AppealsController,
		private validateDto: ValidateDto,
	) {
		this.init();
	}

	private buildPath(path: string = '') {
		return this.prefix + path;
	}

	private init() {
		this.router.post(
			this.buildPath(),
			this.validateDto.validate(CreateAppealDto),
			this.appealsController.createAppeal,
		);
	}

	get getRouter() {
		return this.router;
	}
}
