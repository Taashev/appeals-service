import { NextFunction, Request, Response } from 'express';

import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { APPEAL_STATUSES } from '../appeal-status/enums/statuses';
import { DateFilter } from './types/types';

export class AppealsController {
	constructor(private appealsService: AppealsService) {}

	getAllAppealsWithDateFilter = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const dateFilter: DateFilter = req.body.dateFilter;

			const responseAppealsDto = await this.appealsService.getAllWithDateFilter(
				dateFilter,
			);

			res.send(responseAppealsDto);
		} catch (error) {
			next(error);
		}
	};

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

	inWorkById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const appealId = req.params.id;
			const comment = req.body.comment;

			const responseAppealDto = await this.appealsService.updateStatusById(
				appealId,
				APPEAL_STATUSES.IN_WORK,
				comment,
			);

			res.send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};

	endAppealById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const appealId = req.params.id;
			const comment = req.body.comment;

			const responseAppealDto = await this.appealsService.updateStatusById(
				appealId,
				APPEAL_STATUSES.COMPLETED,
				comment,
			);

			res.send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};

	cancelAppealById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const appealId = req.params.id;
			const comment = req.body.comment;

			const responseAppealDto = await this.appealsService.updateStatusById(
				appealId,
				APPEAL_STATUSES.CANCEL,
				comment,
			);

			res.send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};

	cancelAppealsInWork = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const comment = req.body.comment;

			const responseAppealDto = await this.appealsService.updateStatusByStatus(
				APPEAL_STATUSES.IN_WORK,
				APPEAL_STATUSES.CANCEL,
				comment,
			);

			res.send(responseAppealDto);
		} catch (error) {
			next(error);
		}
	};
}
