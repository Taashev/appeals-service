import { AppDataSource } from '../../ormconfig';

import { AppealsController } from './appeals.controller';
import { AppealsService } from './appeals.service';
import { AppealsRepository } from './appeals.repository';
import { AppealsRouterV1 } from './appeals.router.v1';
import { AppealEntity } from './entities/appeal.entity';

import { appealStatusService } from '../appeal-status';
import { validateDto } from '../middlewares/validate.dto';

const appealRepository = new AppealsRepository(
	AppDataSource.getRepository(AppealEntity),
);
const appealService = new AppealsService(appealRepository, appealStatusService);
const appealsController = new AppealsController(appealService);
const appealsRouterV1 = new AppealsRouterV1(appealsController, validateDto)
	.getRouter;

export { appealsRouterV1 };
