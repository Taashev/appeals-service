import { AppDataSource } from '../../ormconfig';

import { AppealsController } from './appeals.controller';
import { AppealsService } from './appeals.service';
import { AppealsRepository } from './appeals.repository';
import { AppealsRouterV1 } from './appeals.router.v1';
import { AppealEntity } from './entities/appeal.entity';

import { appealStatusService } from '../appeal-status';
import { validateDtoMiddleware } from '../middlewares/validate.dto';
import { appealStatusHistoryService } from '../appeal-status-history';
import { AppealManagerRepository } from './appeals.manager.repository';

const appealRepository = new AppealsRepository(
	AppDataSource.getRepository(AppealEntity),
);

const appealManagerRepository = new AppealManagerRepository(AppDataSource);

const appealService = new AppealsService(
	appealRepository,
	appealManagerRepository,
	appealStatusService,
	appealStatusHistoryService,
);

const appealsController = new AppealsController(appealService);

const appealsRouterV1 = new AppealsRouterV1(
	appealsController,
	validateDtoMiddleware,
).getRouter;

export { appealsRouterV1 };
