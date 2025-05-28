import { Request, Response } from 'express';

import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';

export class AppealsController {
	constructor(private appealsService: AppealsService) {}

	createAppeal = async (req: Request, res: Response) => {
		const createdAppealDto: CreateAppealDto = req.body;

		const createdAppeal = await this.appealsService.createAppeal(
			createdAppealDto,
		);

		res.send(createdAppeal);
	};
}
