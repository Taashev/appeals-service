import { AppDataSource } from '../../ormconfig';

import { AppealsController } from './appeals.controller';
import { AppealsService } from './appels.service';
import { AppealsRepository } from './appeals.repository';
import { AppealsRouterV1 } from './appeals.router.v1';
import { AppealEntity } from '../database/entities/appeal.entity';

const appealRepository = new AppealsRepository(
	AppDataSource.getRepository(AppealEntity),
);
const appealService = new AppealsService(appealRepository);
const appealsController = new AppealsController(appealService);
export const appealsRouterV1 = new AppealsRouterV1(appealsController).getRouter;
