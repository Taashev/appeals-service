import { NextFunction, Request, Response } from 'express';

import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';

export class AppealsController {
	constructor(private appealsService: AppealsService) {}

	createAppeal = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const createdAppealDto: CreateAppealDto = req.body;

			const responseAppealDto = await this.appealsService.createAppeal(
				createdAppealDto,
			);

			res.status(201).send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};

	takeToWork = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const appealId = req.params.id;
			const comment = req.body.comment;

			const responseAppealDto = await this.appealsService.takeToWork(
				appealId,
				comment,
			);

			res.send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};
}
